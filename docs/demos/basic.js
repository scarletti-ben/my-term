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
 * 
 * @param {HTMLDivElement} container
 * @returns {void}
 */
export default function demo(container) {

    // ~ Create terminal widget element
    const widget = new TerminalWidget();

    // ~ Add the terminal widget to the container
    container.appendChild(widget);

    // ~ Create a shell instance
    const shell = new TerminalShell('SHELL');

    // ~ Attach shell to terminal widget
    shell.attachTo(widget);

    // ~ Create an array of terminal command instances
    const commands = [

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

                widget.parseToScreen(`<div class='output'>Welcome to <span class="error">${hijacker.name}</span></div>`);

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

                widget.parseToScreen(`<div class='output'><span class="error">${hijacker.name}</span> ignored <span class="themed">${code}</span></div>`);

            }

            // ~ Define a handler for when the hijacker is detatched
            hijacker.onDetatch = (shell) => {

                widget.setPrompt('$', 2);
                widget.setTheme();
                widget.clearScreen();
                widget.echo(`${hijacker.name} disconnected...`, 'log');
                widget.clearText(0);

            };

            // ~ Attach the hijacjer instance to the shell
            hijacker.attachTo(shell);

        })

    ]

    // ~ Add the terminal commands to the shell instance
    shell.commands.push(...commands);

    // ~ Hide the terminal widget scrollbar
    widget.toggleScrollbar();

    // ~ Put user cursor in the terminal widget
    widget.textarea.focus();

}