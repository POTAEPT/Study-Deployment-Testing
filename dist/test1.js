"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Units_1 = require("./Units");
const unit_test = () => __awaiter(void 0, void 0, void 0, function* () {
    if (Units_1.Units.add(2, 2) === 4) {
        console.log("test case 1 passed");
    }
    else {
        console.error("Test case 1 failed: if(unit.add(2,2) == 4 )");
        process.exit(1);
    }
    if (Units_1.Units.add(3, 3) === 6) {
        console.log("test case 2 passed");
    }
    else {
        console.error("Test case 2 failed: if(unit.add(3,3) == 6 )");
        process.exit(1);
    }
});
unit_test();
