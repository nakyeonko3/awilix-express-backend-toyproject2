import express from "express";

export class UserController {
  constructor({ userService }) {
    this.userService = userService;
    this.router = express.Router();
    this.routes();
  }

  routes() {
    this.router.post("/", this.createUser.bind(this));
    this.router.get("/", this.getAll.bind(this));
    this.router.get("/showinfo", this.getUserByLoginId.bind(this));
    this.router.get("/login", this.getUserByLoginIdAndPassword.bind(this));
    this.router.put("/", this.updateByLoginId.bind(this));
    this.router.put("/", this.deleteByLoginId.bind(this));
  }

  // 회원가입,
  // => req.body: { loginId, password, name, email, phone }
  async createUser(req, res) {
    const user = await this.userService.createUser(req.body);
    res.status(200).json(user);
  }

  // 회원 전체 조회
  async getAll(req, res) {
    const users = await this.userService.getAllUsers();
    res.status(200).json(users);
  }

  // 계정 개인 정보 조회
  async getUserByLoginId(req, res) {
    const { loginId } = req.body;
    const user = await this.userService.getUserByLoginId(loginId);
    res.status(200).json(user);
  }

  // 로그인
  // => req.body: { loginId, password }
  async getUserByLoginIdAndPassword(req, res) {
    const { loginId, password } = req.body;
    const user = await this.userService.getUserByLoginIdAndPassword(
      loginId,
      password
    );
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "Invalid loginId or password" });
    }
  }

  // 계정 개인정보 수정
  async updateByLoginId(req, res) {
    const { loginId } = req.body;
    const user = await this.userService.updateByLoginId(loginId, req.body);
    res.status(200).json(user);
  }

  // 계정 삭제
  async deleteByLoginId(req, res) {
    const { loginId } = req.body;
    const deleted = await this.userService.deleteByLoginId(loginId);
    res.status(200).json({ message: "Deleted", loginId: deleted.loginId });
  }

  // 계정 여러개 삭제
  // loginIds: [loginId1, loginId2, ...]
  async deleteByLoginIds(req, res) {
    const { loginIds } = req.body;
    const deleteds = await this.userService.deleteByLoginIds(loginIds);
    res.status(200).json({ message: "Deleted", loginIds: deleteds });
  }
}
