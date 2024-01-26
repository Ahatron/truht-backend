import File from "../models/file.model.js";
import path from "path";

class FileService {
  async getFile(fileId) {
    const { path, filename } = await File.findOne({ where: { id: fileId } });

    return path + "/" + filename;
  }
}

export default new FileService();
