export function setupControls(keys) {
    window.addEventListener('keydown', e => {
        keys[e.code] = true;
        e.preventDefault();
    });
    window.addEventListener('keyup', e => {
        keys[e.code] = false;
    });

    setupTouchControls(keys);
}

function setupTouchControls(keys) {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const touchControls = document.getElementById('touchControls');
    if (!isTouchDevice || !touchControls) return;

    touchControls.style.display = 'block';

    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnJump = document.getElementById('btnJump');

    function bind(el, keyCode) {
        const activate = (e) => {
            e.preventDefault();
            keys[keyCode] = true;
            el.classList.add('active');
        };
        const deactivate = (e) => {
            e.preventDefault();
            keys[keyCode] = false;
            el.classList.remove('active');
        };

        el.addEventListener('touchstart', activate, { passive: false });
        el.addEventListener('touchend', deactivate, { passive: false });
        el.addEventListener('touchcancel', deactivate, { passive: false });

        el.addEventListener('mousedown', activate);
        el.addEventListener('mouseup', deactivate);
        el.addEventListener('mouseleave', deactivate);
    }

    bind(btnLeft, 'ArrowLeft');
    bind(btnRight, 'ArrowRight');
    bind(btnJump, 'Space');

    document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
}
