"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Inventory_1 = require("./Inventory");
const runUnitTests = () => {
    console.log("--- Starting Unit Tests ---");
    Inventory_1.Inventory.resetStock();
    // Test 1: ทดสอบการเพิ่มสต๊อกสำเร็จ
    Inventory_1.Inventory.addStock("orange", 20);
    if (Inventory_1.Inventory.getStock("orange") === 20) {
        console.log("✅ Unit 1 Passed: addStock works correctly");
    }
    else {
        console.error("❌ Unit 1 Failed");
        process.exit(1);
    }
    // Test 2: ทดสอบระบบป้องกันเลขติดลบ
    try {
        Inventory_1.Inventory.addStock("apple", -5);
        console.error("❌ Unit 2 Failed: System allowed negative stock addition!");
        process.exit(1);
    }
    catch (error) {
        if (error.message === "Amount must be greater than 0") {
            console.log("✅ Unit 2 Passed: Negative stock addition is blocked");
        }
        else {
            console.error("❌ Unit 2 Failed: Wrong error message");
            process.exit(1);
        }
    }
};
runUnitTests();
