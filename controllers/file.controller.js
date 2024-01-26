import fileService from "../services/file.service.js";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

class FileController {
  async getFile(req, res) {
    const { fileId } = req.params;

    try {
      const filePath = await fileService.getFile(fileId);

      res.sendFile(path.resolve(filePath));
    } catch (e) {
      console.error("Error file send: \n", e);
      res.sendStatus(500);
    }
  }
}

export default new FileController();
