const aws = require('aws-sdk');



const uploadVideoTos3 = (( video) => {
    return new Promise(async (resolve, reject) => {
      let s3bucket = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
      // const file = await Jimp.read(Buffer.from(video.buffer, 'base64'))
      //   .then(async video => {
      //     return video.getBufferAsync(Jimp.AUTO);
      //   })
      console.log("test file",video)
       const file = video.buffer
      // const fileType = myFile[myFile.length - 1]
  
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: video.originalname,
        Body: file,
        ContentType: video.mimetype,
        ACL: 'public-read'
      };
      console.log("File", video);
      const fileName = video.originalname;
      console.log("param", params)
      s3bucket.upload(params, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        else {
          resolve({
            url: `https://homerent.s3.ap-south-1.amazonaws.com/${fileName}`
          });
        }
  
      });
  
    })
  })

  
exports.imageUpload = async (req, res, next) => {
    try {
        console.log("req", req)
      //  const content = req.files;
      imageUrls =[];

        if(req.files){
            for(var i=0; i<req.files.length; i++){
                let image = await uploadVideoTos3( req.files[i]); // images is a directory in the Azure container
                 imageUrls.push(image)
              //  return res.status(200).json({message: "image uploaded successfully", image});
            }

        }
         return res.status(200).json({message: "image uploaded successfully", urls:imageUrls});
      
    } catch (error) {
        console.log("--------error" + error);
        next(error);
    }
  };