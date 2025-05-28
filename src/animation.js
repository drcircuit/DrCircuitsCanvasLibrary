export let setupRun = false;
export let playAnimation = true;

export function stopAnimation() {
    playAnimation = false;
}

export function startAnimation() {
    playAnimation = true;
}

export function animate(dcl, draw, clearEachFrame = true) {
    let last = 0;
    function frame(t) {
        let dt = (t - last) / 50;
        if (!setupRun) {
            dcl.setup();
            setupRun = true;
        }
        let render = dcl.draw || draw;
        if (render) {
            if (clearEachFrame) {
                dcl.clear();
            }
            render(t, dt);
            last = t;
            if (playAnimation) {
                requestAnimationFrame(frame);
            }
        }
    }
    requestAnimationFrame(frame);
}