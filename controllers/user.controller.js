import userService from "../services/user.service.js";

class UserController {
  async createUser(req, res) {
    try {
      await userService.createUser(req.body);

      res.status(201).json({ message: "Пользователь успешно добавлен" });
    } catch (error) {
      if (error.status) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
  async userLogin(req, res) {
    try {
      const result = await userService.userLogin(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("Ошибка входа:", error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }
  async getUserProfile(req, res) {
    try {
      const result = await userService.getUserProfile(req.user.id);
      res.json(result);
    } catch (error) {
      console.error("Error getting user", error);
      res.status(500).send("Error getting user");
    }
  }
  async checkLogin(req, res) {
    try {
      console.log(req.body);
      const result = await userService.checkLogin(req.body.userLogin);
      if (!result) {
        res.json({ message: "Login is free" });
      } else {
        res.status(409).json({ message: "This login is busy" });
      }
    } catch (e) {
      console.error("Error check login", e);

      res.status(500).send("Error check login", e);
    }
  }
  async logout(req, res) {
    try {
      const result = await userService.logout(req.user.id);
      res.json(result);
    } catch (error) {
      console.error("Error getting user", error);
      res.status(500).send("Error getting user");
    }
  }
}

export default new UserController();
