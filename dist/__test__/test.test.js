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
const UserController_1 = require("../UserController");
const User_1 = __importDefault(require("../User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const node_mocks_http_1 = require("node-mocks-http");
jest.mock('../User');
jest.mock('bcryptjs');
describe('UserController Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('1. createUser (การสร้างผู้ใช้)', () => {
        it('should return 400 if required fields are missing (Unhappy Path)', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, node_mocks_http_1.createRequest)({ body: { username: 'tae' } }); // ส่งข้อมูลมาไม่ครบ
            const res = (0, node_mocks_http_1.createResponse)();
            yield (0, UserController_1.createUser)(req, res);
            expect(res.statusCode).toBe(400);
            expect(res._getJSONData()).toEqual({ message: "Missing required fields" });
        }));
        it('should create a user securely and return 201 (Happy Path)', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = (0, node_mocks_http_1.createRequest)({
                body: { username: 'tae', email: 'tae@test.com', password: 'password123', age: 25 }
            });
            const res = (0, node_mocks_http_1.createResponse)();
            bcryptjs_1.default.genSalt.mockResolvedValue('mockedSalt');
            bcryptjs_1.default.hash.mockResolvedValue('hashedPassword123');
            User_1.default.prototype.save = jest.fn().mockResolvedValue(true);
            yield (0, UserController_1.createUser)(req, res);
            expect(res.statusCode).toBe(201);
            expect(bcryptjs_1.default.hash).toHaveBeenCalledWith('password123', 'mockedSalt');
        }));
    });
    describe('2. getUsers (การดึงข้อมูลทั้งหมด)', () => {
        it('should return all users and a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUsers = [{ _id: '1', username: 'tae' }];
            User_1.default.find.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUsers)
            });
            const req = (0, node_mocks_http_1.createRequest)();
            const res = (0, node_mocks_http_1.createResponse)();
            yield (0, UserController_1.getUsers)(req, res);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual(mockUsers);
        }));
    });
    describe('3. getUserById (การดึงข้อมูลรายบุคคล)', () => {
        it('should return 404 if user is not found (Unhappy Path)', () => __awaiter(void 0, void 0, void 0, function* () {
            User_1.default.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });
            const req = (0, node_mocks_http_1.createRequest)({ params: { id: '999' } });
            const res = (0, node_mocks_http_1.createResponse)();
            yield (0, UserController_1.getUserById)(req, res);
            expect(res.statusCode).toBe(404);
        }));
    });
    describe('4. updateUser (การแก้ไขข้อมูล)', () => {
        it('should update user and return 200', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedMock = { _id: '1', username: 'tae_updated' };
            User_1.default.findByIdAndUpdate.mockReturnValue({
                select: jest.fn().mockResolvedValue(updatedMock)
            });
            const req = (0, node_mocks_http_1.createRequest)({ params: { id: '1' }, body: { username: 'tae_updated' } });
            const res = (0, node_mocks_http_1.createResponse)();
            yield (0, UserController_1.updateUser)(req, res);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual(updatedMock);
        }));
    });
    describe('5. deleteUser (การลบข้อมูล)', () => {
        it('should delete user and return 200', () => __awaiter(void 0, void 0, void 0, function* () {
            User_1.default.findByIdAndDelete.mockResolvedValue(true);
            const req = (0, node_mocks_http_1.createRequest)({ params: { id: '1' } });
            const res = (0, node_mocks_http_1.createResponse)();
            yield (0, UserController_1.deleteUser)(req, res);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual({ message: "User deleted successfully" });
        }));
    });
});
