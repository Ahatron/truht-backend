import File from "../models/file.model.js";

class FileService {
  async getFile(fileId) {
    const file = await File.findOne({ where: { id: fileId } });

    if (file?.path) {
      const { path, filename } = file;
      return path + "/" + filename;
    }

    throw "File is not exsists";
  }
}

export default new FileService();
