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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("./User"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, age } = req.body;
        // 🛡️ Security 1: เช็คข้อมูลเบื้องต้น (Fail-Safe) ป้องกันแอปพัง
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // 🛡️ Security 2: เข้ารหัสผ่าน (Password Hashing) ก่อนลง Database
        const salt = yield bcryptjs_1.default.genSalt(12);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = new User_1.default({
            username,
            email,
            password: hashedPassword,
            age
        });
        yield newUser.save();
        // 🛡️ Security 3: ป้องกัน Data Leakage โดยการไม่ส่งข้อมูล User กลับไปตรงๆ
        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        console.error("Create User Error:", error); // พิมพ์ Log ให้เราดูหลังบ้าน
        res.status(500).json({ message: "Internal server error" }); // แจ้ง Client แบบกว้างๆ
    }
});
exports.createUser = createUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 🛡️ Security 4: ใช้ .select("-password") สั่ง Mongoose ให้เว้นการดึงรหัสผ่าน
        const users = yield User_1.default.find().select("-password");
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Get User By ID Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 🛡️ Security 5: ป้องกัน Mass Assignment
        const { username, age } = req.body;
        const updatedUser = yield User_1.default.findByIdAndUpdate(req.params.id, { username, age }, { new: true, runValidators: true }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield User_1.default.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteUser = deleteUser;
