// Provide global fallback for getCtx and renderContext for legacy code
export function getCtx(ctx) {
    return ctx || (window.dcl && window.dcl.renderContext);
}

// Optionally, attach dcl to window/globalThis for legacy scripts
export function attachGlobals(dcl, constants = {}) {
    if (typeof globalThis !== "undefined") {
        globalThis.dcl = dcl;
        Object.entries(constants).forEach(([k, v]) => {
            globalThis[k] = v;
        });
    }
}