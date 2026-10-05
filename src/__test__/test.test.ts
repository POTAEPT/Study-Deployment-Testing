import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../UserController';
import { createRequest, createResponse } from 'node-mocks-http';
import bcrypt from 'bcryptjs';
import User from '../User';

// 🛠️ FIX 1: Mock bcryptjs แบบกำหนดเอง ป้องกันปัญหา method undefined
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn(),
  hash: jest.fn()
}));

jest.mock('../User', () => {
  // 2.1 สร้าง Constructor จำลอง สำหรับเอาไปใช้กับ new User(...)
  const MockUserModel = jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(true) // จำลองให้ .save() สำเร็จเสมอ
  }));
  
  // 2.2 ยัด Static Methods จำลองเข้าไปใน Model (สำหรับ User.find, User.findById)
  Object.assign(MockUserModel, {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
  });

  return {
    __esModule: true,
    default: MockUserModel
  };
});

describe('UserController Unit Tests', () => {
  beforeEach(() => {
    // ล้างค่าที่จำลองไว้ในแต่ละข้อให้สะอาดก่อนเริ่มข้อใหม่
    jest.clearAllMocks();
  });

  describe('1. createUser', () => {
    it('should return 400 if required fields are missing (Unhappy Path)', async () => {
      const req = createRequest({ body: { username: 'tae' } }); 
      const res = createResponse();

      await createUser(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: "Missing required fields" });
    });

    it('should create a user securely and return 201 (Happy Path)', async () => {
      const req = createRequest({ 
        body: { username: 'tae', email: 'tae@test.com', password: 'password123', age: 25 } 
      });
      const res = createResponse();

      (bcrypt.genSalt as jest.Mock).mockResolvedValue('mockedSalt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');

      await createUser(req, res);

      expect(res.statusCode).toBe(201);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'mockedSalt');
    });
  });

  describe('2. getUsers', () => {
    it('should return all users and a 200 status code', async () => {
      const mockUsers = [{ _id: '1', username: 'tae' }];
      
      // ตอนนี้ User.find มีตัวตนแล้ว สามารถ Chain .select() ได้ไม่พังครับ
      (User.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers)
      });

      const req = createRequest();
      const res = createResponse();

      await getUsers(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockUsers);
    });
  });

  describe('3. getUserById', () => {
    it('should return 404 if user is not found (Unhappy Path)', async () => {
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const req = createRequest({ params: { id: '999' } });
      const res = createResponse();

      await getUserById(req, res);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('4. updateUser', () => {
    it('should update user and return 200', async () => {
      const updatedMock = { _id: '1', username: 'tae_updated' };
      (User.findByIdAndUpdate as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(updatedMock)
      });

      const req = createRequest({ params: { id: '1' }, body: { username: 'tae_updated' } });
      const res = createResponse();

      await updateUser(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(updatedMock);
    });
  });

  describe('5. deleteUser', () => {
    it('should delete user and return 200', async () => {
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

      const req = createRequest({ params: { id: '1' } });
      const res = createResponse();

      await deleteUser(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ message: "User deleted successfully" });
    });
  });
});