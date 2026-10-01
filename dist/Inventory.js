"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inventory = void 0;
let stock = {
    "apple": 10,
    "banana": 5
};
exports.Inventory = {
    getStock: (item) => {
        return stock[item] || 0;
    },
    deductStock: (item, amount) => {
        if (stock[item] >= amount) {
            stock[item] -= amount;
        }
    },
    addStock: (item, amount) => {
        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }
        stock[item] = (stock[item] || 0) + amount;
    },
    resetStock: () => {
        stock = { "apple": 10, "banana": 5 };
    }
};
