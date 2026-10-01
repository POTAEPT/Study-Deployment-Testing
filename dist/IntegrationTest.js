"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = require("./Order");
const Inventory_1 = require("./Inventory");
const runModuleIntegrationTest = () => {
    console.log("--- Starting Module Integration Tests ---");
    Inventory_1.Inventory.resetStock();
    // Test Case 1: สั่งซื้อสินค้าที่มีในสต็อก
    const order1 = Order_1.Order.placeOrder("apple", 2);
    if (order1.success === true && Inventory_1.Inventory.getStock("apple") === 8) {
        console.log("✅ Test 1 Passed: Order processed and Inventory deducted correctly");
    }
    else {
        console.error("❌ Test 1 Failed: Order or Inventory mismatch");
    }
    // Test Case 2: สั่งซื้อสินค้าเกินสต็อก (Negative Path)
    const order2 = Order_1.Order.placeOrder("banana", 10);
    if (order2.success === false && Inventory_1.Inventory.getStock("banana") === 5) {
        console.log("✅ Test 2 Passed: Over-order blocked, Inventory unchanged");
    }
    else {
        console.error("❌ Test 2 Failed: System allowed over-order or modified Inventory");
    }
};
runModuleIntegrationTest();
