const express = require('express');
const crypto = require('crypto');
const media = require('./controllers/MediaFilesController');
const route = express.Router();
const jwt  = require('jsonwebtoken');
const multer = require('multer');
const Axios = require('axios').default;

const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024;

const storageTypes = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        file.key = `${hash.toString("hex")}-${file.originalname}`;
        console.log(file)
        cb(null, file.key);
      });
    },
  });



const multerConfig = multer({
  dest: 'uploads',
  storage: storageTypes,
  
});

route.get('/', async (req, res) => {
   
    console.log('ok')
});


route.post('/uploadFile',multer(multerConfig).single('image'), media.uploadPhotos);
route.post('/login', media.login);
route.post('/register', media.register);
route.get('/getMediaFiles', media.getMediaFiles);
route.post('/deleteMediaFiles', media.deleteMediaFiles);
route.get('/uploads/:file', media.view);




module.exports = route;