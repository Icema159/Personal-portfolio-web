import { useEffect, useRef } from 'react';
import { createEffectsRuntime } from '../effects/runtime';

export default function LiquidCursor() {
  const canvasRef = useRef(null);
  useEffect(() => createEffectsRuntime(canvasRef.current), []);
  return <canvas ref={canvasRef} className="liquid-cursor" aria-hidden="true" />;
}
