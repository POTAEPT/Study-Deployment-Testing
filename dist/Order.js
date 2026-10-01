"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const Inventory_1 = require("./Inventory");
exports.Order = {
    placeOrder: (item, amount) => {
        const currentStock = Inventory_1.Inventory.getStock(item);
        if (currentStock >= amount) {
            //Inventory.deductStock(item, amount);
            return { success: true, message: `สั่งซื้อ ${item} สำเร็จ` };
        }
        else {
            return { success: false, message: `สินค้า ${item} หมด หรือไม่เพียงพอ` };
        }
    }
};
