import { compare, hash } from "bcrypt";
import User from "../models/user.model.js";
import jwtUtils from "../utils/jwt.utils.js";

class UserService {
  async createUser(user) {
    const hashedPassword = await hash(user.password, 10);

    return await User.create({
      nickname: user.nickname,
      user_login: user.userLogin,
      password: hashedPassword,
    }).catch((e) => {
      console.error("Ошибка при добавлении пользователя:", e);
      if (e.parent?.code === "23505") {
        throw { status: 409, message: "Пользователь уже существует" };
      } else if (e.errors[0]) {
        throw { status: 400, message: e.errors[0].message };
      }
    });
  }
  async userLogin(userData) {
    const { userLogin, password } = userData;
    const user = await User.findOne({ where: { user_login: userLogin } });
    if (user?.dataValues) {
      const isPasswordValid = await compare(password, user.dataValues.password);

      if (isPasswordValid) {
        const accessToken = jwtUtils.generateToken(user.dataValues);
        user.last_login_at = new Date();
        await user.save();
        return {
          message: "Вход выполнен успешно",
          accessToken,
          nickname: user.nickname,
          userLogin: user.user_login,
          userId: user.id,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          avatars: user.avatars,
        };
      } else {
        throw new Error("Неверные учетные данные");
      }
    } else {
      throw new Error("Пользователь не найден");
    }
  }

  async getUserProfile(userId) {
    const result = await User.findOne({ where: { id: userId } });

    if (result.dataValues) {
      const user = result.dataValues;

      return {
        message: "User data is load success",
        nickname: user.nickname,
        userLogin: user.user_login,
        userId: user.id,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastLogin: user.last_login,
        lastLogout: user.last_logout,
        avatars: user.avatars,
      };
    } else {
      throw new Error("Пользователь не найден");
    }
  }
  async checkLogin(login) {
    try {
      const res = User.findOne({ where: { user_login: login } });

      return res;
    } catch (e) {
      console.error(e);
    }
  }
  async logout(userId) {
    const user = await User.findOne({ where: { id: userId } });
    user.last_logout_at = new Date();

    return user;
  }
}

export default new UserService();
