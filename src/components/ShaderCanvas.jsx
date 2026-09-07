import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

export default function ShaderCanvas() {
    return (
        <ShaderGradientCanvas
            style={{ position: "absolute", inset: 0 }}
            pixelDensity={1}
            fov={45}
            gl={{ antialias: false, powerPreference: "low-power" }}
        >
            <ShaderGradient
                animate="on"
                type="plane"
                shader="defaults"
                color1="#080b18"
                color2="#5267d8"
                color3="#d5cce8"
                uSpeed={0.12}
                uStrength={2.2}
                uDensity={1.05}
                uFrequency={4.4}
                uAmplitude={2.8}
                rotationZ={38}
                cDistance={3.4}
                cPolarAngle={88}
                cAzimuthAngle={210}
                brightness={0.62}
                reflection={0.15}
                grain="off"
                lightType="3d"
            />
        </ShaderGradientCanvas>
    );
}
