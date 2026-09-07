import { lazy, Suspense, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const ShaderCanvas = lazy(() => import("./ShaderCanvas"));

export default function StarBackground() {
    const reduceMotion = useReducedMotion();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (reduceMotion) return undefined;
        const schedule = window.requestIdleCallback || ((callback) => window.setTimeout(callback, 350));
        const cancel = window.cancelIdleCallback || window.clearTimeout;
        const id = schedule(() => setReady(true));
        return () => cancel(id);
    }, [reduceMotion]);

    return (
        <div className="atmosphere" aria-hidden="true">
            {ready && <Suspense fallback={null}><ShaderCanvas /></Suspense>}
            <div className="atmosphere-wash" />
            <div className="atmosphere-grain" />
        </div>
    );
}
