import fs from "fs";
import path from "path";

export function createDirectories(directory, basePath) {
  const fullPath = path.join(basePath, directory.path);

  // Проверка, существует ли директория1
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath);
    console.log(`Директория ${directory.path} была создана.`);
  } else {
    console.log(`Директория ${directory.path} уже существует.`);
  }

  if (directory.childs && directory.childs.length > 0) {
    directory.childs.forEach((child) => createDirectories(child, fullPath));
  }
}

export function deleteFilesRecursively(directoryPath) {
  // Чтение файлов в директории
  const files = fs.readdirSync(directoryPath);

  // Перебор файлов
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);

    // Проверка, является ли текущий элемент директорией
    if (fs.statSync(filePath).isDirectory()) {
      // Если это директория, вызываем функцию рекурсивно для удаления файлов внутри
      deleteFilesRecursively(filePath);

      // Удаляем пустую директорию
      fs.rmdirSync(filePath);
    } else {
      // Если это файл, удаляем его
      fs.unlinkSync(filePath);
    }
  });
}
