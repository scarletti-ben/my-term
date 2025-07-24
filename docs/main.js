// < ======================================================
// < Imports
// < ======================================================

import demos from "./demos/index.js";

// < ======================================================
// < Element Queries
// < ======================================================

const main = /** @type {HTMLDivElement} */
    (document.getElementById('main'));

const links = /** @type {HTMLDivElement} */
    (document.getElementById('links'));

// ~ ======================================================
// ~ Entry Point
// ~ ======================================================

/**
 * IIFE entry point for testing `my-term`
 * - Used to run demos
 */
(() => {

    // ~ Handle back button to reset
    window.addEventListener('popstate', () => {
        location.reload();
    });

    // ~ Check for URL search parameter ?demo=nane
    const params = new URLSearchParams(location.search);
    let demoName;
    if (params.has('demo')) {
        demoName = params.get('demo');
    }

    if (demoName) {

        // ~ Start the demo given in search parameters
        for (const [name, demo] of Object.entries(demos)) {
            if (demoName === name) {
                links.remove();
                demo(main);
                break;
            }
        }
        
    } else {

        // ~ Add links for all of the demos
        for (const [name, demo] of Object.entries(demos)) {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = name;
            link.onclick = (event) => {
                event.preventDefault();
                history.pushState({}, '', location.href);
                links.remove();
                demo(main);
            };
            links.appendChild(link);
        }

    }

})();