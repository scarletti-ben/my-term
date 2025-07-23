// < ======================================================
// < Imports
// < ======================================================

import {
    TerminalWidget,
    TerminalShell,
    TerminalCommand,
    TerminalHijacker
} from "../components/terminal-widget.js";

import {
    Card,
    createCards,
    Player
} from "../libs/playing-cards.js";

// < ======================================================
// < Blackjack Class
// < ======================================================

/**
 * A simple game of Blackjack with a standard 52-card deck
 */
class Blackjack {

    /** @type {{ you: Player, dealer: Player }} */
    players;

    /** @type {Card[]} */
    deck;

    /** 
     * Create a new game with players and an empty deck
     * 
     * @param {boolean} [starting=true] 
     */
    constructor(starting = true) {
        this.players = {
            'you': new Player('you'),
            'dealer': new Player('dealer')
        };
        this.deck = [];
        if (starting) this.start();
    }

    /** 
     * Draw a card from the top of the deck
     * @returns {Card} The drawn card
     */
    drawCard() {
        return this.deck.pop();
    }

    /** 
     * Start a new round with a new deck
     */
    start() {
        this.deck = createCards(true);
        for (let i = 0; i < 2; i++) {
            this.players.you.cards.push(this.drawCard());
            this.players.dealer.cards.push(this.drawCard());
        }
    }

    /** 
     * Calculate blackjack score from given ranks
     * @param {string} ranks
     * @returns {number[]}
     */
    calculateScore(ranks) {

        let score = 0;
        let aces = 0;
        for (const rank of ranks) {
            if (rank === 'A') aces++;
            else if ('TJQK'.includes(rank)) score += 10;
            else score += Number(rank);
        }
        if (aces === 0) return [score];

        let output = [score + 1, score + 11];
        aces -= 1;
        if (aces <= 0) return output;
        for (let i = 0; i <= aces; i++) {
            output[0] = output[0] + 11;
            output[1] = output[1] + 11;
        }
        return output;

    }

    /** 
     * Get the current game state
     * @param {boolean} [hiding=true]
     * @returns {string[]} The game state
     */
    getState(hiding = true) {

        let output = [];

        let yourString = '';
        const yourRanks = this.players.you.cards.map((card) => card.rank.short);
        const yourScore = this.calculateScore(yourRanks);
        yourString += `You: [ ${yourRanks.join(', ')} ]`;
        yourString += ` (${yourScore})`;
        output.push(yourString);

        let dealerString = '';
        const dealerRanks = this.players.dealer.cards.map((card) => card.rank.short);
        if (hiding) dealerRanks.splice(0, 1);
        const dealerScore = this.calculateScore(dealerRanks);
        if (hiding) dealerRanks.unshift('?');
        dealerString += `Dealer: [ ${dealerRanks.join(', ')} ]`;
        dealerString += ` (${dealerScore})\n`;
        output.push(dealerString);

        return output;

    }

}

// > ======================================================
// > Exported Demo Function 
// > ======================================================

/** 
 * Demonstration function to test Blackjack in my-term
 * 
 * @param {HTMLDivElement} container
 * @returns {void}
 */
export default function demo(container) {

    // ~ Create terminal widget and shell
    const { widget, shell } = TerminalWidget.createDefault(container);

    // ~ Create a Blackjack game instance
    const game = new Blackjack(true);

    // > ========================
    // > Hijack with Blackjack
    // > ========================

    // ~ Create a simple state viewer function
    const showState = () => {
        game.getState().forEach((str) => widget.echo(str));
        widget.echo(' ');
    };

    // ~ Create a hijacker instance
    const hijacker = new TerminalHijacker('Blackjack');

    // ~ Define a handler for when the hijacker is attatched
    hijacker.onAttach = (shell) => {

        widget.setTheme('cyan');
        widget.clearScreen();
        widget.clearText(0);
        widget.echo(`Welcome to ${hijacker.name}`);
        widget.parseToScreen(`<div class="output">Type <span class="themed">help</span> for available commands</div>`);

        // ~ Echo the game state
        showState();

    };

    // ~ Define a handler for submitted text
    hijacker.handleSubmit = (code) => {
        switch (code) {
            case 'help': {
                widget.echo(`Showing commands for ${hijacker.name}`, 'info');
                widget.echo(`    help - Show list of available commands`);
                widget.echo(`    clear - Clear the terminal screen`);
                widget.echo(`    hit - Draw a card`);
                widget.echo(`    stand - End your turn`);
                widget.echo(`    state - Show game state`);
                break;
            }
            case 'clear': {
                widget.clearScreen();
                widget.clearText();
                break;
            }
            case 'twist':
            case 'hit': {
                let card = game.drawCard();
                widget.echo(`You drew a ${card.rank.short}`);
                game.players.you.cards.push(card);
                showState();
                break;
            }
            case 'stick':
            case 'stand': {
                widget.echo('stood');
                break;
            }
            case 'state': {
                showState();
                break;
            }
            default: {
                widget.echo('not implemented');
                break;
            }
        }
    }

    // ~ Attach the hijacker instance to the shell
    hijacker.attachTo(shell);

    // > ========================

    // ~ Put user cursor in the terminal widget
    widget.textarea.focus();

}