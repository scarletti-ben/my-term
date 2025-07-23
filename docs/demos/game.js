// < ======================================================
// < Imports
// < ======================================================

import {
    TerminalWidget,
    TerminalShell,
    TerminalCommand,
    TerminalHijacker
} from "../components/terminal-widget.js";

// < ======================================================
// < Helper Functions
// < ======================================================

/**
 * Shuffle an array in place using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} The shuffled array
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// < ======================================================
// < Game Class
// < ======================================================

/**
 * A simple playing card game with a standard 52-card deck
 */
class Game {

    /** @type {string[]} */
    static suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

    /** @type {string[]} */
    static ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    /** @type {{ suit: string, rank: string}[]} */
    deck;

    /** 
     * Create a new game with a shuffled deck
     */
    constructor() {
        this.deck = this.createDeck();
        shuffle(this.deck);
    }

    /** 
     * Create a 52-card deck
     * @returns {{ suit: string, rank: string}[]} A new deck of cards
     */
    createDeck() {
        const deck = [];
        for (let suit of Game.suits) {
            for (let rank of Game.ranks) {
                deck.push({ suit, rank });
            }
        }
        return deck;
    }

    /** 
     * Draw a card from the top of the deck
     * @returns {{ suit: string, rank: string} | undefined} The drawn card
     */
    drawCard() {
        return this.deck.pop();
    }

}

// > ======================================================
// > Exported Demo Function 
// > ======================================================

/** 
 * 
 * @param {HTMLDivElement} container
 * @returns {void}
 */
export default function demo(container) {

    // ! Create a Game instance
    const game = new Game();

    // ~ Create terminal widget element
    const widget = new TerminalWidget();

    // ~ Hide the terminal widget scrollbar
    widget.toggleScrollbar();

    // ~ Add the terminal widget to the container
    container.appendChild(widget);

    // ~ Create a shell instance
    const shell = new TerminalShell('SHELL');

    // ~ Attach shell to terminal widget
    shell.attachTo(widget);

    // ~ Create a hijacker instance
    const hijacker = new TerminalHijacker('HIJACKER');

    // ~ Define a handler for when the hijacker is attatched
    hijacker.onAttach = (shell) => {

        widget.setTheme('green');
        widget.clearScreen();
        widget.clearText(0);
        widget.echo('Welcome to the Game');

    };

    // ~ Define a handler for submitted text
    hijacker.handleSubmit = (code) => {

        if (code === 'clear') {
            widget.clearScreen();
            widget.clearText();
            return;
        }

        let card = game.drawCard();
        if (card) {
            widget.echo(`You drew the ${card.rank} of ${card.suit}`);
            return;
        }
        widget.echo(`No more cards to draw`);

    }

    // ~ Attach the hijacjer instance to the shell
    hijacker.attachTo(shell);

    // ~ Put user cursor in the terminal widget
    widget.textarea.focus();

}