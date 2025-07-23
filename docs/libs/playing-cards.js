/**
 * Simple classes for playing card games
 * 
 * @module playing-cards
 * @author Ben Scarletti
 * @version 1.0.0
 * @since 2025-07-23
 * @see {@link https://github.com/scarletti-ben}
 * @license MIT
 */

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
// < Suit Class
// < ======================================================

class Suit {

    /** @type {string} */
    title;

    /** @type {string} */
    short;

    /** @type {string} */
    symbol;

    /**
     * Create a suit instance
     * @param {string} title - Title case (Hearts)
     * @param {string} short - Short code (H)
     * @param {string} symbol - Unicode symbol (♥)
     */
    constructor(title, short, symbol) {
        this.title = title;
        this.short = short;
        this.symbol = symbol;
    }

}

// < ======================================================
// < Suits Array
// < ======================================================

/** @type {Suit[]} */
const suits = [
    new Suit('Hearts', 'H', '♥'),
    new Suit('Diamonds', 'D', '♦'),
    new Suit('Clubs', 'C', '♣'),
    new Suit('Spades', 'S', '♠')
];

// < ======================================================
// < Rank Class
// < ======================================================

class Rank {

    /** @type {string} */
    title;

    /** @type {string} */
    short;

    /** @type {number} */
    value;

    /**
     * Create a rank instance
     * @param {string} title - Title case (Ace)
     * @param {string} short - Short code (A)
     * @param {number} value - Number value (1)
     */
    constructor(title, short, value) {
        this.title = title;
        this.short = short;
        this.value = value;
    }
}

// < ======================================================
// < Ranks Array
// < ======================================================

/** @type {Rank[]} */
const ranks = [
    new Rank('Ace', 'A', 1),
    new Rank('Two', '2', 2),
    new Rank('Three', '3', 3),
    new Rank('Four', '4', 4),
    new Rank('Five', '5', 5),
    new Rank('Six', '6', 6),
    new Rank('Seven', '7', 7),
    new Rank('Eight', '8', 8),
    new Rank('Nine', '9', 9),
    new Rank('Ten', '10', 10),
    new Rank('Jack', 'J', 11),
    new Rank('Queen', 'Q', 12),
    new Rank('King', 'K', 13)
];

// < ======================================================
// < Card Class
// < ======================================================

class Card {

    /** @type {Rank} */
    rank;

    /** @type {Suit} */
    suit;

    /** 
     * Create a card instance
     * @param {Rank} rank
     * @param {Suit} suit
     */
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }

}

// < ======================================================
// < Create Cards Function
// < ======================================================

/** 
 * Create a 52-card deck of playing cards
 * @param {boolean} [shuffling=true] Optional shuffle
 * @returns {Card[]} An array of cards
 */
function createCards(shuffling = true) {
    const cards = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            cards.push(new Card(rank, suit));
        }
    }
    if (shuffling) shuffle(cards);
    return cards;
}

// < ======================================================
// < Player Class
// < ======================================================

class Player {

    /** @type {string} */
    name;

    /** @type {Card[]} */
    cards;

    /** 
     * Create a player instance
     * @param {string} name
     */
    constructor(name) {
        this.name = name;
        this.cards = [];
    }

}

// > ======================================================
// > Exports
// > ======================================================

export {
    shuffle,
    Suit,
    Rank,
    Card,
    Player,
    suits,
    ranks,
    createCards
};