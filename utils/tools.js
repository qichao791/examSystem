var multer = require("../node_modules/multer")
var path = require("path")

let tools = {
    
    multer() {
        var storage = multer.diskStorage({
            //配置上传的目录
            destination: function (req, file, cb) {
                // console.log("req:",req)
                // console.log("file",file)
                
                var mimetype = file.mimetype
                var path
                if(req.body.type=="avatar"){
                    path="/avatar/"
                }else{
                    if(req.body.type=="attachment"&&mimetype.startsWith("image")){//图像
                        path="/attachment/image/"
                    }else if(req.body.type=="attachment"&&mimetype.startsWith("video")){//视频
                        path="/attachment/video/"
                    }else if(req.body.type=="attachment"&&mimetype.startsWith("audio")){//音频
                        path="/attachment/voice/"
                    }
                }
                cb(null, process.cwd()+path)   //上传之前目录必须存在
            },
            //修改上传之后的文件名
            filename: function (req, file, cb) {
                //1.获取后缀名
                let extname = path.extname(file.originalname);
                //2.根据时间戳生成文件名
                cb(null, Date.now() + extname)
            }
        })

        var upload = multer({ storage: storage })

        return upload;
    },
    md5(){

    }
}

module.exports = tools
