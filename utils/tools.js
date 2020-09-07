const multer = require("multer");
const path = require("path");
const fs = require("fs");

module.exports = {
  multer() {
    let storage = multer.diskStorage({
      destination: function (req, file, cb) {
        let { type } = req.body;
        let mimetype = file.mimetype
        let file_path = "";
        if (type === "avatar") {
          file_path = "/avatar/";
        } else {
          if (mimetype.startsWith("image")) {
            file_path = "/attachment/image/"
          } else if (mimetype.startsWith("video")) {
            file_path = "/attachment/video/"
          } else if (mimetype.startsWith("audio")) {
            file_path = "/attachment/voice/"
          }
        }
        cb(null, process.cwd() + file_path)   //上传之前目录必须存在
      },
      filename: function (req, file, cb) {
        let { type } = req.body;
        let extname = path.extname(file.originalname);
        let file_path = type === "avatar" ? file.originalname : Date.now() + extname;
        cb(null, file_path);
      }
    })
    let upload = multer({ storage: storage });
    return upload;
  },
  md5() { }
}
