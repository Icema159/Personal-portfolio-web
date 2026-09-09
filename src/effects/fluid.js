// Screen-space stable fluid. Velocity is measured in simulation cells/second.
const vertex = `#version 300 es
precision highp float;
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
const header = `#version 300 es
precision highp float;
in vec2 uv;out vec4 color;
uniform sampler2D source,velocity,aux,heading;
uniform vec2 headingOrigin,headingSize,screenSize,hoverPoint;
uniform float headingOpacity,clipY,distortion,smokeEnabled;
uniform vec2 texel,point,previous,force;
uniform float dt,decay,amount,radius,aspect;
vec4 bilerp(sampler2D s,vec2 p){vec2 q=p/texel-.5;vec2 i=floor(q),f=fract(q);return mix(mix(texture(s,(i+.5)*texel),texture(s,(i+vec2(1.5,.5))*texel),f.x),mix(texture(s,(i+vec2(.5,1.5))*texel),texture(s,(i+1.5)*texel),f.x),f.y);}
`;
const passes = {
  advect: `void main(){vec2 v=texture(velocity,uv).xy;color=bilerp(source,uv-dt*v*texel)*exp(-decay*dt);}`,
  splat: `void main(){vec2 p=uv*vec2(aspect,1.),a=previous*vec2(aspect,1.),b=point*vec2(aspect,1.);vec2 ab=b-a;float t=clamp(dot(p-a,ab)/max(dot(ab,ab),.000001),0.,1.);vec2 d=p-a-t*ab;float g=exp(-dot(d,d)/radius);color=texture(source,uv)+vec4(force,amount,0.)*g;}`,
  curl: `void main(){float l=texture(velocity,uv-vec2(texel.x,0)).y,r=texture(velocity,uv+vec2(texel.x,0)).y,b=texture(velocity,uv-vec2(0,texel.y)).x,t=texture(velocity,uv+vec2(0,texel.y)).x;color=vec4(.5*(r-l-t+b),0,0,1);}`,
  vorticity: `void main(){float l=abs(texture(aux,uv-vec2(texel.x,0)).x),r=abs(texture(aux,uv+vec2(texel.x,0)).x),b=abs(texture(aux,uv-vec2(0,texel.y)).x),t=abs(texture(aux,uv+vec2(0,texel.y)).x);vec2 n=vec2(t-b,l-r);n/=length(n)+.0001;vec2 v=texture(velocity,uv).xy+n*texture(aux,uv).x*dt*12.;color=vec4(clamp(v,vec2(-500),vec2(500)),0,1);}`,
  divergence: `void main(){vec2 c=texture(velocity,uv).xy;float l=uv.x<texel.x?-c.x:texture(velocity,uv-vec2(texel.x,0)).x,r=uv.x>1.-texel.x?-c.x:texture(velocity,uv+vec2(texel.x,0)).x,b=uv.y<texel.y?-c.y:texture(velocity,uv-vec2(0,texel.y)).y,t=uv.y>1.-texel.y?-c.y:texture(velocity,uv+vec2(0,texel.y)).y;color=vec4(.5*(r-l+t-b),0,0,1);}`,
  pressure: `void main(){float l=texture(source,uv-vec2(texel.x,0)).x,r=texture(source,uv+vec2(texel.x,0)).x,b=texture(source,uv-vec2(0,texel.y)).x,t=texture(source,uv+vec2(0,texel.y)).x;color=vec4((l+r+b+t-texture(aux,uv).x)*.25,0,0,1);}`,
  project: `void main(){float l=texture(aux,uv-vec2(texel.x,0)).x,r=texture(aux,uv+vec2(texel.x,0)).x,b=texture(aux,uv-vec2(0,texel.y)).x,t=texture(aux,uv+vec2(0,texel.y)).x;color=vec4(texture(velocity,uv).xy-.5*vec2(r-l,t-b),0,1);}`,
  display: `void main(){
    vec4 textColor=vec4(0.);
    if(headingOpacity>0. && uv.y>clipY){
      vec2 delta=(uv-hoverPoint)*screenSize;
      float mask=exp(-dot(delta,delta)/(145.*145.))*distortion;
      vec2 v=bilerp(velocity,uv).xy;
      vec2 offset=clamp(v*1.8,vec2(-65.),vec2(65.))*mask/screenSize;
      vec2 q=(uv-offset-headingOrigin)/headingSize;
      if(all(greaterThanEqual(q,vec2(0.)))&&all(lessThanEqual(q,vec2(1.)))){
        textColor=texture(heading,q);textColor.a*=headingOpacity;textColor.rgb*=textColor.a;
      }
    }
    float d=max(0.,bilerp(source,uv).z);
    float a=min(.42,1.-exp(-d*.55))*smokeEnabled;
    vec3 smoke=vec3(.64,.61,.78);
    color=vec4(smoke*a,a)+textColor*(1.-a);
  }`,
};

export function createFluid(gl, config) {
  if (!gl.getExtension('EXT_color_buffer_float')) throw new Error('Float render targets unavailable');
  const programs = [], targets = [];
  let width, height, flow, dye, pressure, curl, divergence;
  function shader(type, text) {
    const s=gl.createShader(type);gl.shaderSource(s,text);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error(message);}return s;
  }
  function program(body) {
    const v=shader(gl.VERTEX_SHADER,vertex),f=shader(gl.FRAGMENT_SHADER,header+body),p=gl.createProgram();
    gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);gl.deleteShader(v);gl.deleteShader(f);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS)){gl.deleteProgram(p);throw new Error('Fluid shader link failed');}
    programs.push(p);return {p, locations:new Map()};
  }
  function releaseTargets(){for(const t of targets){gl.deleteTexture(t.texture);gl.deleteFramebuffer(t.fbo);}targets.length=0;}
  function target(){
    const texture=gl.createTexture(),fbo=gl.createFramebuffer();const t={texture,fbo};targets.push(t);
    gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA16F,width,height,0,gl.RGBA,gl.HALF_FLOAT,null);
    for(const axis of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,axis,gl.CLAMP_TO_EDGE);
    for(const filter of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,filter,gl.NEAREST);
    gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);
    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw new Error('Incomplete fluid framebuffer');
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);return t;
  }
  function pair(){return {read:target(),write:target(),swap(){[this.read,this.write]=[this.write,this.read];}};}
  function resize(w,h){
    const scale=config.resolution/Math.max(w,h),nw=Math.max(32,Math.round(w*scale)),nh=Math.max(32,Math.round(h*scale));
    if(width===nw&&height===nh)return;releaseTargets();width=nw;height=nh;
    flow=pair();dye=pair();pressure=pair();curl=target();divergence=target();gl.bindFramebuffer(gl.FRAMEBUFFER,null);
  }
  let compiled;
  const dispose=()=>{releaseTargets();programs.forEach(p=>gl.deleteProgram(p));};
  try {compiled=Object.fromEntries(Object.entries(passes).map(([k,v])=>[k,program(v)]));resize(gl.canvas.width,gl.canvas.height);}catch(error){dispose();throw error;}
  function draw(name,out,uniforms={}){
    const {p,locations}=compiled[name];gl.useProgram(p);gl.bindFramebuffer(gl.FRAMEBUFFER,out?.fbo??null);
    gl.viewport(0,0,out?width:gl.canvas.width,out?height:gl.canvas.height);
    let unit=0;
    for(const [key,value] of Object.entries({texel:[1/width,1/height],...uniforms})){
      if(!locations.has(key))locations.set(key,gl.getUniformLocation(p,key));const loc=locations.get(key);if(loc===null)continue;
      if(value?.texture){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,value.texture);gl.uniform1i(loc,unit++);}
      else if(Array.isArray(value))gl.uniform2f(loc,...value);else gl.uniform1f(loc,value);
    }
    gl.drawArrays(gl.TRIANGLES,0,3);
  }
  function step(dt,pointer,headingState,distortion,hoverPoint,simulate=true){
    dt=Math.min(dt,1/30);if(dt<=0)return;
    if (simulate) {
    draw('advect',flow.write,{source:flow.read,velocity:flow.read,dt,decay:1.1});flow.swap();
    const motion=Math.hypot(pointer.dx,pointer.dy);
    if(pointer.inside&&motion>.1){
      const uniforms={point:[pointer.u,pointer.v],previous:[pointer.u-pointer.dx/innerWidth,pointer.v+pointer.dy/innerHeight],aspect:width/height,radius:config.radius**2};
      const gain=Math.min(1,150/motion);
      draw('splat',flow.write,{source:flow.read,...uniforms,force:[pointer.dx*gain*width/innerWidth*35,-pointer.dy*gain*height/innerHeight*35],amount:0});flow.swap();
      draw('splat',dye.write,{source:dye.read,...uniforms,force:[0,0],amount:Math.min(.8,motion*.025)});dye.swap();
    }
    draw('curl',curl,{velocity:flow.read});draw('vorticity',flow.write,{velocity:flow.read,aux:curl,dt});flow.swap();
    draw('divergence',divergence,{velocity:flow.read});
    // Reinitialise pressure, avoiding old pressure impulses after quiet periods.
    gl.bindFramebuffer(gl.FRAMEBUFFER,pressure.read.fbo);gl.clear(gl.COLOR_BUFFER_BIT);
    for(let i=0;i<config.pressureIterations;i++){draw('pressure',pressure.write,{source:pressure.read,aux:divergence});pressure.swap();}
    draw('project',flow.write,{velocity:flow.read,aux:pressure.read});flow.swap();
    draw('advect',dye.write,{source:dye.read,velocity:flow.read,dt,decay:config.decay});dye.swap();
    }
    draw('display',null,{source:dye.read,velocity:flow.read,
      heading:headingState || dye.read,headingOrigin:headingState?.origin || [0,0],
      headingSize:headingState?.size || [1,1],headingOpacity:headingState?.opacity || 0,
      clipY:headingState?.clipY || 0,screenSize:[innerWidth,innerHeight],
      distortion,hoverPoint,smokeEnabled:config.smokeEnabled?1:0});
  }
  function clear(){
    for(const t of targets){gl.bindFramebuffer(gl.FRAMEBUFFER,t.fbo);gl.clear(gl.COLOR_BUFFER_BIT);}
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.clear(gl.COLOR_BUFFER_BIT);
  }
  return {step,resize,dispose,clear};
}
