/**
 * Basic demo for `my-term`
 * 
 * @module basic
 * @author Ben Scarletti
 * @since 2025-07-23
 * @see {@link https://github.com/scarletti-ben}
 * @license MIT
 */

// < ======================================================
// < Imports
// < ======================================================

import {
    TerminalWidget,
    TerminalShell,
    TerminalCommand,
    TerminalHijacker
} from "../components/terminal-widget.js";

// > ======================================================
// > Exported Demo Function 
// > ======================================================

/** 
 * Create an example terminal widget in a given container
 * @param {HTMLDivElement} container - Container for my-term
 * @returns {void}
 */
export default function demo(container) {

    // ~ Create terminal widget and shell
    const { widget, shell } = TerminalWidget.createDefault(container);

    // ~ Put user cursor in the terminal widget textarea
    widget.textarea.focus();

    // ~ Add command instances to the terminal shell
    shell.commands.push(...[

        // ~ Create a terminal command to clear the terminal widget screen
        new TerminalCommand('clear', (widget, shell, command, ...args) => {
            widget.clearScreen();
        }),

        // ~ Create a terminal command to show shell commands
        new TerminalCommand('help', (widget, shell, command, ...args) => {
            widget.echo(`Showing commands for ${shell.name}`, 'info');
            shell.showHelp();
            widget.echo(` `);
        }),

        // ~ Create a terminal command to toggle the terminal widget scrollbar
        new TerminalCommand('toggleScrollbar', (widget, shell, command, ...args) => {
            const disabled = widget.toggleScrollbar();
            widget.echo(`Scrollbar ${disabled ? 'disabled' : 'enabled'}`);
        }),

        // ~ Create an example terminal command to hijack the shell
        new TerminalCommand('hijack', (widget, shell, command, ...args) => {

            // ~ Create a hijacker instance
            const hijacker = new TerminalHijacker('HIJACKER');

            // ~ Define a handler for when the hijacker is attatched
            hijacker.onAttach = (shell) => {

                widget.setPrompt('>>>', 1);

                widget.setTheme('green');
                widget.clearScreen();

                widget.parseToScreen(`Welcome to <span class="error">${hijacker.name}</span>`);

                widget.clearText(0);

            };

            // ~ Define a handler for submitted text
            hijacker.handleSubmit = (code) => {

                const trimmed = code.trim().toLowerCase();
                if (
                    trimmed === "q" ||
                    trimmed === "quit" ||
                    trimmed === "quit()"
                ) {
                    hijacker.detatch();
                    return;
                }

                widget.parseOutput(`<span class="error">${hijacker.name}</span> ignored <span class="themed">${code}</span>`);

            }

            // ~ Define a handler for when the hijacker is detatched
            hijacker.onDetatch = (shell) => {

                widget.setPrompt('$', 2);
                widget.setTheme();
                widget.clearScreen();
                widget.echo(`${hijacker.name} disconnected...`, 'log');
                widget.clearText(0);

            };

            // ~ Attach the hijacker instance to the shell
            hijacker.attachTo(shell);

        })

    ]);

}