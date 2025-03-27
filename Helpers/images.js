const multer = require('multer')
 
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        if (file.fieldname === "image") {
          cb(null, "./Uploads/User/");
        }else if(file.fieldname === "catImage"){
            cb(null, "./Uploads/Category/");
        }else if(file.fieldname === "petImage"){
          cb(null, "./Uploads/Dog/");
      }else if(file.fieldname === "contentImage"){
        cb(null, "./Uploads/ContentImage/");
    }else if(file.fieldname === "taskImage"){
      cb(null, "./Uploads/Task/");
  }
      },
      filename: function (req, file, cb) {
        if (file.fieldname === "image") {
          const filename = file.originalname.split(" ").join("-");
          cb(null, `${filename}`);
        }else  if (file.fieldname === "catImage"){
            const filename = file.originalname.split(" ").join("-");
            cb(null, `${filename}`);
        }else  if (file.fieldname === "petImage"){
          const filename = file.originalname.split(" ").join("-");
          cb(null, `${filename}`);
      }else  if (file.fieldname === "contentImage"){
        const filename = file.originalname.split(" ").join("-");
        cb(null, `${filename}`);
    }else  if (file.fieldname === "taskImage"){
      const filename = file.originalname.split(" ").join("-");
      cb(null, `${filename}`);
  }
      },
    });
  
    const  user = multer({ storage : storage }).single('image')
    const  catImage = multer({ storage : storage }).single('catImage')
    const  pet = multer({ storage : storage }).single('petImage')
    const contentimage = multer({ storage : storage }).single('contentImage')
    const taskimage = multer({ storage : storage }).single('taskImage')

    module.exports={
        user ,catImage , pet , contentimage ,taskimage
    }


     
    
    