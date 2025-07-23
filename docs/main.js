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

    // ~ Add links for all of the demos
    for (const [name, demo] of Object.entries(demos)) {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = name;
        link.onclick = (event) => {
            event.preventDefault();
            links.remove();
            demo(main);
        };
        links.appendChild(link);
    }

})();