import jwtUtils from "../utils/jwt.utils.js";

const authenticate = (req, res, next) => {
  const token = req.headers.authorization.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Отсутствует токен авторизации." });
  }

  try {
    const decoded = jwtUtils.verifyToken(token);
    req.user = decoded; // Добавить раскодированные данные в объект запроса
    next(); // Продолжить выполнение следующего middleware или маршрута
  } catch (error) {
    return res.status(401).json({ message: "Неверный токен авторизации." });
  }
};

export default authenticate;
