/**
 * Blackjack demo for `my-term`
 * 
 * Simple implementation of blackjack to give an 
 * example of controlling my-term
 * 
 * @module blackjack
 * @author Ben Scarletti
 * @since 2025-07-10
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
            'player': new Player('player'),
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
     * Draw a card to a specific player
     * @param {Player|string} player - The player drawing the card
     * @returns {Card} The drawn card
     */
    drawTo(player) {
        const card = this.deck.pop();
        player = this.getPlayer(player);
        player.cards.push(card);
        return card;
    }

    /** 
     * Get a player instance
     * @param {string|Player} player - Player name, or player instance
     * @returns {Player} The player instance
     */
    getPlayer(player) {
        if (player instanceof Player) {
            return player;
        }
        return this.players[player];
    }

    /** 
     * Get the rank names for the cards a player has
     * @param {Player|string} player - The player to check
     * @param {boolean} [hiding=false] Whether to ignore first card
     * @returns {string[]} The rank names for the player
     */
    getRanks(player, hiding = false) {
        player = this.getPlayer(player);
        const ranks = player.cards.map(c => c.rank.short);
        console.log(ranks);
        console.log(player.cards);
        return hiding
            ? ranks.slice(1)
            : ranks;
    }

    /** 
     * Start a new round with a new deck
     */
    start() {
        this.deck = createCards(true);
        this.resetPlayer('player');
        this.resetPlayer('dealer');
        for (let i = 0; i < 2; i++) {
            this.drawTo('player');
            this.drawTo('dealer');
        }
    }

    /** 
     * Reset a player, removing all cards
     * @param {Player|string} player - The player to reset
     * @returns {void}
     */
    resetPlayer(player) {
        player = this.getPlayer(player);
        player.cards.length = 0;
    }

    /** 
     * Check if a specific player has gone bust
     * @param {Player|string} player - The player to check
     * @returns {number[]} The scores array
     */
    hasBust(player) {
        const scores = this.getScores(player, false);
        return scores.every(score => score > 21);
    }

    /** 
     * Get current scores for a specific player
     * @param {Player|string} player - The player to check
     * @param {boolean} [hiding=false] Whether to ignore first card
     * @returns {number[]} The scores array
     */
    getScores(player, hiding = false) {
        player = this.getPlayer(player);
        const ranks = this.getRanks(player, hiding);
        return this.calculateScores(ranks);
    }

    /** 
     * Get max score for a specific player
     * @param {Player|string} player - The player to check
     * @returns {number|null} The maximum score a player has
     */
    getValidScore(player) {
        const scores = this.getScores(player);
        const validScores = scores.filter(score => score <= 21);
        if (validScores.length === 0) {
            return null;
        }
        return Math.max(...validScores);
    }

    /** 
     * Calculate blackjack score from given ranks
     * @param {string} ranks
     * @returns {number[]}
     */
    calculateScores(ranks) {

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

        let playerString = 'Player:'.padEnd(10, ' ');
        let ranks = this.getRanks('player');
        let scores = this.getScores('player');
        let ranksString = ranks.join(', ');
        let scoresString = scores.join(', ');
        playerString += `[${ranksString}]`
        playerString += ` (${scoresString})`
        output.push(playerString);
        console.log(playerString);

        let dealerString = 'Dealer:'.padEnd(10, ' ');
        ranks = this.getRanks('dealer', hiding);
        if (hiding) ranks.unshift('?');
        scores = this.getScores('dealer', hiding);
        scores = scores.map(n => String(n) + (hiding ? '?' : ''));
        ranksString = ranks.join(', ');
        scoresString = scores.join(', ');
        dealerString += `[${ranksString}]`
        dealerString += ` (${scoresString})`
        output.push(dealerString);
        console.log(dealerString);

        return output;

    }

}

// > ======================================================
// > Exported Demo Function 
// > ======================================================

/** 
 * Demonstration function to test Blackjack in my-term
 * @param {HTMLDivElement} container - Container for my-term
 * @returns {void}
 */
export default function demo(container) {

    // ~ Create terminal widget and shell
    const { widget, shell } = TerminalWidget.createDefault(container);

    // ~ Create an alias for echo
    const echo = (...args) => {
        widget.echo(...args);
    };

    // ~ Create a function for raising errors
    const raise = (text) => {
        widget.echo(text, 'error');
    };

    // ~ Create a function to clear screen
    const clear = (delay) => {
        widget.clearScreen(delay);
        widget.clearText(delay);
    };

    // > ========================
    // > Hijack with Blackjack
    // > ========================

    // ~ Create a hijacker instance
    const hijacker = new TerminalHijacker('Blackjack');

    // ~ Create a Blackjack game instance
    const game = new Blackjack(true);

    // ~ Create a simple game state viewer
    const showState = (hiding) => {
        game.getState(hiding).forEach((str) => echo(str));
        echo(' ');
    };

    // ~ Any key to continue, with callback
    const anyKeyContinue = (callback) => {
        echo(`Press any key to continue...`, 'info');
        setTimeout(() => {
            widget.addEventListener('keydown', () => {
                callback();
            }, { once: true });
        }, 100);
    };

    // ~ Create a reset function
    const reset = () => {
        clear();
        game.start();
        showState();
    };

    // ~ Define a handler for when the hijacker is attatched
    hijacker.onAttach = (shell) => {

        // ~ Change theme and add welcome message
        widget.setTheme('cyan');
        clear();
        widget.parseOutput(`Welcome to <span class="themed">${hijacker.name}</span>`)
        widget.parseOutput(`Module for <span class="themed">my-term-v0.9.0</span> by <a href="https://github.com/scarletti-ben" target="_blank">Ben Scarletti</a> (MIT License)`);
        widget.parseOutput(`Type <span class="themed">help</span> for available commands`);

        // ~ Echo the game state
        showState(true);

    };

    // ~ Create a simple draw function
    const draw = (name, hiding) => {
        const card = game.drawTo(name);
        echo(`The ${name} drew a ${card.rank.short}`);
        showState(hiding);
    };

    // ~ Define a handler for submitted text
    hijacker.handleSubmit = (code) => {
        switch (code) {
            case 'help': {

                // ~ Echo all available commands
                echo(`Showing commands for ${hijacker.name}`, 'info');
                echo(`    help - Show list of available commands`);
                echo(`    clear - Clear the terminal screen`);
                echo(`    hit - Draw a card`);
                echo(`    stand - End your turn`);
                echo(`    state - Show game state`);
                echo(`    reset - Reset the game`);

                break;
            }
            case 'clear': {

                // ~ Clear the screen
                clear();
                break;
            }
            case 'twist':
            case 'hit': {

                // > ==========================
                // > Player Logic
                // > ==========================

                const name = 'player';

                draw(name, true);
                let bust = game.hasBust(name);
                if (bust) {
                    echo(`The ${name} has gone bust!`, 'warning');
                    anyKeyContinue(reset);
                }

                break;
            }
            case 'stick':
            case 'stand': {

                // ~ Get the score that the player stood on
                const playerActualScores = game.getScores('player');
                const playerScore = Math.max(...playerActualScores);

                // ~ Show message
                echo(`The ${'player'} has chosen to stand on ${playerScore}`, 'info');
                showState(false);

                // > ==========================
                // > Dealer Logic
                // > ==========================

                // ~ Dealer check
                const willPlay = () => {

                    const scores = game.getScores('dealer');
                    const valid = [...scores.filter(score => score <= 21)];

                    // ? No valid cards
                    if (valid.length === 0) {
                        return false;
                    }

                    // ? Will not play if already winning
                    if (valid.some((score) => score > playerScore)) {
                        return false;

                        // ? Will not play if 17 or higher
                    } else if (valid.some((score) => score >= 17)) {
                        return false;

                        // ? Plays otherwise
                    } else {
                        return true;
                    }

                }

                // ~ Dealer decision loop
                function dealerLoop() {
                    if (willPlay()) {
                        draw('dealer', false);
                        requestAnimationFrame(dealerLoop);
                    }
                }
                dealerLoop();

                const dealerScore = game.getValidScore('dealer');

                if (!dealerScore) {
                    echo(`The ${'dealer'} has gone bust!`, 'warning');
                    const dealerActualScores = game.getScores('dealer');
                    const dealerActualScore = Math.max(...dealerActualScores);
                    echo(`The ${'dealer'} had ${dealerActualScore}`, 'log');
                    echo(`The ${'player'} had ${playerScore}`, 'log');
                } else if (playerScore < dealerScore) {
                    echo(`The ${'dealer'} won with ${dealerScore}`, 'warning');
                    echo(`The ${'player'} had ${playerScore}`, 'log');
                } else if (playerScore === dealerScore) {
                    echo(`There was a tie on ${dealerScore}`, 'warning');
                } else {
                    echo(`The ${'player'} won with ${playerScore}`, 'success');
                    echo(`The ${'dealer'} had ${dealerScore}`, 'log');
                }
                anyKeyContinue(reset);

                break;
            };
            case 'state': {

                // ~ Show current game state
                showState(false);

                break;
            }
            case 'r':
            case 'reset': {

                // ~ Reset the game
                reset();

                break;
            }
            default: {

                // ~ Echo for unknown commands
                echo(`${code} is not a valid command`);

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