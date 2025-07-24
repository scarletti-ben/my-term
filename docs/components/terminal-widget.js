/**
 * Core module for `my-term`
 * 
 * Registers the <terminal-widget> custom element and exports:
 * - TerminalWidget
 * - TerminalShell
 * - TerminalCommand
 * - TerminalHijacker
 * 
 * @module terminal-widget
 * @author Ben Scarletti
 * @version 0.9.0
 * @since 2025-07-10
 * @see {@link https://github.com/scarletti-ben}
 * @license MIT
 */

// < ======================================================
// < Declarations
// < ======================================================

/** @type {string} Version name */
const VERSION = 'my-term-v0.9.0';

// < ======================================================
// < Type Definitions
// < ======================================================

/** 
 * @typedef {''|'log'|'themed'|'error'|'success'|'info'|'warning'} EchoColour
 */

/** 
 * @typedef {''|'green'|'cyan'} ThemeColour
 */

/**
 * @typedef {(
 *   widget: TerminalWidget,
 *   shell: TerminalShell,
 *   command: TerminalCommand,
 *   ...args: any[]
 * ) => any} CommandHandler
 */

// < ======================================================
// < Element Queries
// < ======================================================

const page = /** @type {HTMLDivElement} */
    (document.getElementById('page'));

const main = /** @type {HTMLDivElement} */
    (document.getElementById('main'));

// < ======================================================
// < Widget CSS Styling
// < ======================================================

/** 
 * Terminal Widget CSS styling for the shadow root
 * @type {string}
 */
const CSS = /*css*/`

/* ========================================================
  CSS Variables
======================================================== */

:host {

    --colour-background: hsla(0, 0%, 10%, 1);
    --colour-background-soft: hsla(0, 0%, 20%, 1);
    --colour-background-rich: hsla(0, 0%, 4%, 1);
    --colour-theme: hsla(283, 40%, 60%, 1);
    --colour-theme-dim: hsla(283, 30%, 25%, 1);
    --colour-theme-mid: hsla(283, 30%, 45%, 1);
    
    --colour-log: hsla(0, 0%, 88%, 1);
    --colour-info: hsla(212, 100%, 65%, 1);
    --colour-success: hsla(129, 68%, 47%, 1);
    --colour-warning: hsla(41, 100%, 59%, 1);
    --colour-error: hsla(3, 100%, 67%, 1);

}

:host(.green) {

    --colour-background: hsla(0, 0%, 10%, 1);
    --colour-background-soft: hsla(0, 0%, 20%, 1);
    --colour-background-rich: hsla(0, 0%, 4%, 1);
    --colour-theme: hsla(120, 60%, 50%, 1);
    --colour-theme-dim: hsla(120, 40%, 25%, 1);
    --colour-theme-mid: hsla(120, 40%, 45%, 1);
    
    --colour-log: hsla(120, 20%, 80%, 1);
    --colour-info: hsla(180, 100%, 70%, 1);
    --colour-success: hsla(140, 70%, 60%, 1);
    --colour-warning: hsla(50, 100%, 60%, 1);
    --colour-error: hsla(10, 100%, 70%, 1);

}

:host(.cyan) {

    --colour-background: hsla(190, 40%, 10%, 1);
    --colour-background-soft: hsla(190, 40%, 20%, 1);
    --colour-background-rich: hsla(190, 40%, 4%, 1);
    --colour-theme: hsla(190, 70%, 50%, 1);
    --colour-theme-dim: hsla(190, 40%, 25%, 1);
    --colour-theme-mid: hsla(190, 50%, 40%, 1);

    --colour-log: hsla(190, 20%, 80%, 1);
    --colour-info: hsla(190, 100%, 75%, 1);
    --colour-success: hsla(160, 80%, 65%, 1);
    --colour-warning: hsla(45, 100%, 65%, 1);
    --colour-error: hsla(5, 100%, 70%, 1);

}

/* ========================================================
  Terminal Widget Element Styling
======================================================== */

:host {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
}

/* ========================================================
  Wildcard Styling
======================================================== */

* {
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    font-family: monospace, 'Courier New';
}

/* ========================================================
  Frame Styling
======================================================== */

#frame {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--colour-background-rich);
    border-radius: 12px;
    border: 2px solid var(--colour-theme-dim);
    outline: 2px solid var(--colour-theme-mid);
}

/* ========================================================
  Header Styling
======================================================== */

#header {
    padding: 12px 20px;
    background: var(--colour-background);
    border-bottom: 1px solid var(--colour-background-soft);
    display: flex;
    align-items: center;
    gap: 16px;
}

#dot-container {
    display: flex;
    gap: 6px;
}
.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}
.dot.red { background: var(--colour-error); }
.dot.yellow { background: var(--colour-warning); }
.dot.green { background: var(--colour-success); }
.dot.semicircle {
    width: 6px;
    height: 12px;
    border-radius: 6px 0 0 6px;
}

/* ========================================================
  Screen Styling
======================================================== */

#screen {
    flex: 1;
    padding: 24px 12px;
    overflow-y: auto;
    scrollbar-gutter: stable both-edges;
    background: var(--colour-background-rich);
    position: relative;
}
#screen::-webkit-scrollbar { width: 8px; }
#screen::-webkit-scrollbar-track { background: transparent; }
#screen::-webkit-scrollbar-thumb {
    background: var(--colour-background-soft);
    border-radius: 4px;
}
#screen.hide-scroll::-webkit-scrollbar {
    display: none;
}
#screen.hide-scroll {
    padding: 24px 27px;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* ========================================================
  Input Styling
======================================================== */

#input-line {
    display: flex;
    align-items: flex-start;
}

#prompt {
    white-space: nowrap;
    line-height: 20px;
}

#textarea {
    padding: 0px;
    margin: 0px;
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-family: inherit;
    color: var(--colour-log);
    caret-color: var(--colour-success);
    resize: none;
    overflow: hidden;
    min-height: 20px;
    line-height: 20px;
}

#textarea:focus {
    outline: none;
}

/* ========================================================
  Output Styling
======================================================== */

.output {
    margin-bottom: 4px;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: var(--colour-log);
    line-height: 20px;
}

.output a,
.output a:visited,
.output a:active {
  color: currentColor;
  text-decoration: underline;
}

.themed { color: var(--colour-theme) !important; }
.error { color: var(--colour-error)!important; }
.success { color: var(--colour-success) !important; }
.info { color: var(--colour-info) !important; }
.warning { color: var(--colour-warning) !important; }

`;

// < ======================================================
// < Widget HTML Structure
// < ======================================================

/** 
 * Terminal Widget HTML structure for the shadow root
 * @type {string}
 */
const HTML = /*html*/`

<div id="frame">
    <div id="header">
        <div id="dot-container">
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
        </div>
    </div>
    <div id="screen">
        <div class="output">Welcome to <span class="themed">${VERSION}</span> by <a href="https://github.com/scarletti-ben" target="_blank">Ben Scarletti</a> (MIT License)</div>
        <div class="output"><span class="info">Hotkeys</span>: <span class="themed">Tab</span> to autocomplete, <span class="themed">Up</span> / <span class="themed">Down</span> to navigate history</div>
        <div class="output">Type <span class="themed">help</span> for available commands</div>
        <div id="input-line">
            <span id="prompt" class="themed">$&nbsp;&nbsp;</span>
            <textarea id="textarea" autocomplete="off" spellcheck="false" rows="1" autocapitalize="off"></textarea>
        </div>
    </div>
</div>

`;

// < ======================================================
// < Widget Inner HTML String
// < ======================================================

/** 
 * Terminal Widget innnerHTML string for the shadow root
 * @type {string}
 */
const INNER_HTML = `<style>${CSS}</style>` + HTML;

// < ======================================================
// < Terminal Widget Class
// < ======================================================

export class TerminalWidget extends HTMLElement {

    /** @type {HTMLDivElement} */
    screen;

    /** @type {HTMLTextAreaElement} */
    textarea;

    /** @type {TerminalShell | null} */
    shell = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = INNER_HTML;
        this.screen = this.query('#screen');
        this.textarea = this.query('#textarea');
        this.shadowRoot.addEventListener('keydown', this._handleKeyDown);
        this.shadowRoot.addEventListener('mouseup', this._handleMouseUp);
        this.textarea.addEventListener('input', this._handleInput);
        this.setPrompt('$', 2);
        this.toggleScrollbar();
    }

    /** 
     * Create a terminal widget instance within a container
     * @param {Element} container - The container to add the widget to
     * @returns {TerminalWidget} The terminal widget instance
     */
    static create(container) {
        const widget = new this();
        container.appendChild(widget);
        return widget;
    }

    /** 
     * Create a default terminal widget instance
     * - Creates an attached TerminalShell
     * 
     * @param {Element?} container - The container to add the widget to
     * @returns {{widget: TerminalWidget, shell: TerminalShell}} Default widget and shell
     * 
     */
    static createDefault(container) {
        const widget = TerminalWidget.create(container);
        const shell = new TerminalShell();
        shell.attachTo(widget);
        return { widget, shell };
    }

    /** 
     * Change the prompt string
     * @param {string} [symbol='$']
     * @param {number} [spaces=0]
     * @returns {void}
     */
    setPrompt(symbol = '$', spaces = 0) {
        const element = this.query('#prompt');
        element.innerHTML = `${symbol}${'&nbsp;'.repeat(spaces)}`;
    }

    /**
     * Set terminal theme via host classname
     * @param {ThemeColour} [theme='']
     * @returns {void}
     */
    setTheme(theme = '') {
        const className = theme ? theme : '';
        this.shadowRoot.host.className = className;
    }

    /**
     * Find and an element inside the shadow root
     * @template {Element} E
     * @param {string} selector - CSS selector string
     * @returns {E} The element
     */
    query(selector) {
        const element = this.shadowRoot.querySelector(selector);
        if (element === null) {
            throw new Error('TerminalWidget queries should never be null');
        }
        return /** @type {E} */ (element);
    }

    /**
     * Auto-resize textarea based on content
     * @returns {void}
     */
    _autoResizeTextarea() {
        this.textarea.style.height = 'auto';
        this.textarea.style.height = this.textarea.scrollHeight + 'px';
    }

    /**
     * Handle input events to auto-resize textarea
     * @param {Event} event
     * @returns {void}
     */
    _handleInput = (event) => {
        this._autoResizeTextarea();
    }

    /**
     * Handle `keydown` events in the terminal
     * - Pass events to terminal shell
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    _handleKeyDown = (event) => {
        if (this.shell) {
            this.shell._handleKeyDown(event);
            return;
        } else if (event.key === 'Enter') {
            this.echo('No shell attached to terminal');
        }
    }

    /**
     * Add element to the terminal screen
     * @param {Element} element - The element to add to screen
     * @param {boolean} scrolling
     * @return {void}
     */
    addToScreen(element, scrolling = true) {
        this.screen.insertBefore(element, this.screen.lastElementChild);
        if (scrolling) {
            this.scrollToBottom();
        }
    }

    /**
     * Add output text to the terminal screen
     * @param {string} text - Text to display
     * @param {EchoColour} [type=''] - Class for element styling
     * @return {void}
     */
    echo(text, type = '') {
        type = type === 'log' ? '' : type;
        const output = document.createElement('div');
        output.className = `output ${type}`;
        output.textContent = text;
        this.addToScreen(output);
    }

    /**
     * Parse HTML string and add resulting element(s) to the terminal screen
     * @param {string} markup - The HTML string to parse and add to screen
     * @param {boolean} scrolling
     * @return {void}
     */
    parseToScreen(markup, scrolling = true) {
        const fragment = document.createElement('template');
        fragment.innerHTML = markup.trim();
        const elements = fragment.content.children;
        for (const element of elements) {
            this.addToScreen(element, scrolling);
        }
    }

    /**
     * Parse HTML string and add resulting element(s) to the terminal screen
     * - The string is automatically wrapped in <div class="output">
     * @param {string} markup - The HTML string to parse and add to screen
     * @param {boolean} scrolling
     * @return {void}
     */
    parseOutput(markup, scrolling = true) {
        const output = document.createElement('div');
        output.className = 'output';
        output.innerHTML = markup.trim();
        this.addToScreen(output, scrolling);
    }

    /**
     * Scroll to the bottom of the terminal screen
     * @returns {void}
     */
    scrollToBottom() {
        this.screen.scrollTop = this.screen.scrollHeight;
    }

    /**
     * Clear the terminal screen
     * @returns {void}
     */
    _clearScreen() {
        const outputs = this.screen.querySelectorAll('.output');
        for (const output of outputs) {
            output.remove();
        }
    }

    /**
     * Clear the terminal screen, with optional delay
     * @param {number} [delay]
     * @returns {void}
     */
    clearScreen(delay) {
        if (delay) {
            setTimeout(() => {
                this._clearScreen();
            }, delay);
            return;
        }
        this._clearScreen();
    }

    /**
     * Clear the terminal textarea
     * @returns {void}
     */
    _clearText(delay) {
        this.textarea.value = '';
    }

    /**
     * Clear the terminal textarea with optional delay
     * @param {number} [delay] 
     * @returns {void}
     */
    clearText(delay) {
        if (delay) {
            setTimeout(() => {
                this._clearText();
            }, delay);
            return;
        }
        this._clearText();
    }

    /**
     * Toggle scrollbar visibility on terminal screen
     * @returns {boolean} The state of the class after toggle
     */
    toggleScrollbar() {
        return this.screen.classList.toggle('hide-scroll');
    }

    /**
     * Handle `mouseup` events in the terminal
     * @param {Event} event
     * @returns {void}
     */
    _handleMouseUp = (event) => {
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
            this.textarea.focus();
        }
    }

}

// < ======================================================
// < Terminal Command Class
// < ======================================================

/** 
 * 
 */
export class TerminalCommand {

    /** @type {string} */
    name;

    /** @type {CommandHandler} */
    handler;

    /**
     * Create a command instance
     * @param {string} name
     * @param {CommandHandler} handler
     */
    constructor(name, handler) {
        this.name = name;
        this.handler = handler;
    }

    /**
     * Execute command handler
     * @param {TerminalWidget} widget
     * @param {TerminalShell} shell
     * @param {...*} args
     */
    execute(widget, shell, ...args) {
        this.handler(widget, shell, this, ...args);
    }

}

// < ======================================================
// < Terminal Hijacker Class
// < ======================================================


export class TerminalHijacker {

    /** @type {string} */
    name;

    /** @type {TerminalShell | null} */
    shell = null;

    /**
     * Create a TerminalHijacker instance
     * @param {string} [name='hijacker'] The name of the hijacker instance
     */
    constructor(name = 'hijacker') {
        this.name = name;
    }

    /**
     * Attach hijacker to a shell
     * @param {TerminalShell} shell
     * @returns {void}
     */
    attachTo(shell) {
        if (!shell.widget) {
            throw new Error('Shell must be attached to widget first');
        }
        shell.hijacker = this;
        this.shell = shell;
        this.onAttach(shell);
    }

    /**
     * Detatch hijacker from current shell
     * @returns {void}
     */
    detatch() {
        const shell = this.shell;
        shell.hijacker = null;
        this.shell = null;
        this.onDetatch(shell);
    }

    /**
     * Called when hijacker is attached to shell
     * @param {TerminalShell} shell
     * @returns {void}
     */
    onAttach(shell) {

        shell.widget.echo('onAttach method should be overwritten');

    }

    /**
     * Called when hijacker is detatched from shell
     * @param {TerminalShell} shell
     * @returns {void}
     */
    onDetatch(shell) {

        shell.widget.echo('onDetatch method should be overwritten');

    }

    /**
     * Handle `keydown` events from the terminal
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    _handleKeyDown = (event) => {

        if (event.key === 'Enter' && !event.shiftKey) {

            // Do not add a newline character
            event.preventDefault();

            const input = this.shell.widget.textarea.value;
            this.shell.widget.textarea.value = '';

            this.handleSubmit(input);

        } else if (event.key === 'Enter') {

            setTimeout(() => this.shell.widget._autoResizeTextarea(), 0);

        }

    }

    /**
     * Handle input from `Enter` key down event
     * @param {string} input
     * @returns {void}
     */
    handleSubmit(input) {
        this.shell.widget.echo('handleSubmit method should be overwritten');
    }

}

// < ======================================================
// < Terminal Shell Class
// < ======================================================

export class TerminalShell {

    /** @type {string} */
    name;

    /** @type {TerminalWidget} */
    widget;

    /** @type {TerminalCommand[]} */
    commands;

    /** @type {TerminalHijacker | null} */
    hijacker;

    /** @type {string[]} */
    _history;

    /** @type {number} */
    _historyIndex;

    /** 
     * 
     * @param {string} [name='shell']
     */
    constructor(name = 'shell') {
        this.name = name;
        this._history = [];
        this._historyIndex = -1;
        this.commands = [];
    }

    /**
     * Handle `keydown` events from the terminal
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    _handleKeyDown = (event) => {
        if (this.hijacker) {
            this.hijacker._handleKeyDown(event);
            return;
        }
        if (event.key === 'Enter') {

            // Do not add a newline character
            event.preventDefault();

            const value = this.widget.textarea.value.trim();
            if (!value) return;
            this._addToHistory(value);

            // this.widget.textarea.value = '';

            this.widget.echo(`>> ${value}`);

            const [key, ...args] = value.split(' ');
            const command = this.commands.find(c => c.name === key);
            if (command) {
                command.execute(this.widget, this, ...args);
            } else {
                this.widget.echo(`${key} is not a valid command`);
            }
            this.widget.scrollToBottom();

            // Clear the textarea
            setTimeout(() => {
                this.widget.textarea.value = '';
            }, 0);

        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this._navigateHistory(-1);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            this._navigateHistory(1);
        } else if (event.key === 'Tab') {
            event.preventDefault();
            this._autocomplete();
        }

    }

    /**
     * Attach shell to the terminal widget
     * @param {TerminalWidget} widget
     * @returns {void}
     */
    attachTo(widget) {
        widget.shell = this;
        this.widget = widget;
    }

    /**
     * Show all shell commands on terminal screen
     * @returns {void}
     */
    showHelp() {
        const commandNames = this.commands.map(c => c.name);
        for (const name of commandNames) {
            this.widget.echo(`    ${name}`)
        }
    }

    /**
     * Simple autocomplete for terminal
     * - Predicts based on saved commands
     * @returns {void}
     */
    _autocomplete() {
        const textarea = this.widget.textarea;
        const partial = textarea.value.trim();
        const names = this.commands.map(cmd => cmd.name);
        const matches = names.filter(name =>
            name.toLowerCase().startsWith(partial.toLowerCase())
        );
        if (matches.length === 1) {
            this.widget.textarea.value = matches[0];
        } else if (matches.length > 1) {
            this.widget.echo(`Available: ${matches.join(', ')}`, 'info');
        }
    }

    /**
     * Add command to history
     * @param {string} command - Command string input
     * @returns {void}
     */
    _addToHistory(command) {
        this._history.push(command);
        this._historyIndex = this._history.length;
    }

    /**
     * Navigate command history
     * @param {number} direction - Integer for index change `+/-`
     * @returns {void}
     */
    _navigateHistory(direction) {
        const index = this._historyIndex + direction;
        if (index >= 0 && index <= this._history.length) {
            this._historyIndex = index;
            this.widget.textarea.value = this._history[this._historyIndex] || '';
        }
    }

}

// * ======================================================
// * Custom Element Registration
// * ======================================================

customElements.define('terminal-widget', TerminalWidget);