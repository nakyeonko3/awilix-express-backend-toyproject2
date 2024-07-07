import { BaseRepository } from "../BaseRepository/BaseRepository.js";
import { camelToSnakeCase } from "../utils/camelToSnakeCase.js";

export class UserRepository extends BaseRepository {
  constructor() {
    super("Users");
  }

  // 회원가입
  async create(entity) {
    await this.initialize();
    const keys = this.convertKeysToSnakeCase(Object.keys(entity));
    const values = Object.values(entity);

    const placeholders = keys.map(() => "?").join(",");

    try {
      const { lastID } = await this.db.run(
        `INSERT INTO ${this.tableName} (${keys.join(
          ","
        )}) VALUES (${placeholders})`,
        values
      );
      return { id: lastID, ...entity };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // 직원 전체 조회
  async getAll() {
    await this.initialize();
    try {
      return await this.db.all(
        `SELECT * FROM ${this.tableName} WHERE is_deleted = 0`
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // 직원 조회: 이메일로 조회
  async getByEmail(email) {
    await this.initialize();

    try {
      return await this.db.get(
        `SELECT * FROM ${this.tableName} WHERE email = ?
      AND is_deleted = 0
      `,
        email
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // 직원 조회: 아이디로 조회
  async getByLoginId(loginId) {
    await this.initialize();
    try {
      return await this.db.get(
        `SELECT * FROM ${this.tableName} WHERE login_id = ?
      AND is_deleted = 0`,
        loginId
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // 로그인: 아이디와 비밀번호로 조회
  async getByLoginIdAndPassword(loginId, password) {
    await this.initialize();
    try {
      const result = await this.db.get(
        `SELECT * FROM ${this.tableName} WHERE login_id = ? AND password = ?
        AND is_deleted = 0`,
        loginId,
        password
      );
      return result;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // 계정 수정
  async updateByLoginId(loginId, entity) {
    await this.initialize();
    const keys = this.convertKeysToSnakeCase(Object.keys(entity));
    const values = Object.values(entity);

    const sets = keys.map((key) => `${key} = ?`).join(", ");

    try {
      await this.db.run(
        `UPDATE ${this.tableName} SET ${sets} WHERE login_id = ?`,
        [...values, loginId]
      );
      return await this.getByLoginId(loginId);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  //  계정 삭제
  async deleteByLoginId(loginId) {
    await this.initialize();
    try {
      await this.db.run(
        `UPDATE ${this.tableName} 
      SET is_deleted = 1
      WHERE login_id = ?
      AND is_deleted = 0`,
        loginId
      );
      return { loginId };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  //  계정 복구
  async restoreLoginId(loginId) {
    await this.initialize();
    try {
      await this.db.run(
        `UPDATE ${this.tableName} 
      SET is_deleted = 0
      WHERE login_id = ?
      AND is_deleted = 1`,
        loginId
      );
      return { loginId };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // 회원가입 필드 검증
  verifyCreateFields(entity) {
    if (!entity.login_id || !entity.password || !entity.name) {
      throw new Error("login_id, password, name 가 필요합니다.");
    }
  }

  // json 필드로 받은 데이터를 스네이크케이스로 변환
  convertKeysToSnakeCase(keys) {
    return keys.map((key) => camelToSnakeCase(key));
  }
}
