import fs from "fs";
import path from "path";

function createDirectories(directory, basePath) {
  const fullPath = path.join(basePath, directory.path);

  // Проверка, существует ли директория1
  if (!fs.existsSync(fullPath)) {
    // Если директории нет, создаем ее
    fs.mkdirSync(fullPath);
    console.log(`Директория ${directory.path} была создана.`);

    // Рекурсивно вызываем эту же функцию для поддиректорий
    if (directory.childs && directory.childs.length > 0) {
      directory.childs.forEach((child) => createDirectories(child, fullPath));
    }
  } else {
    console.log(`Директория ${directory.path} уже существует.`);
  }
}

export default createDirectories;
