const express = require('express');
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, callback): void {
        callback(null, file.originalname);
    }
});
const upload = multer({storage: storage});
const gm = require("gm").subClass({
    imageMagick: true
});
const app = express();
app.post('/api/file', upload.single('file'), (req, res) => {
    gm(req.file.path)
        .resize(720)
        .write('uploads/small_' + req.file.filename, (err) => {
            console.log(err);
        });
    gm(req.file.path)
        .resize(1280)
        .write('uploads/medium_' + req.file.filename, (err) => {
            console.log(err);
        });
    gm(req.file.path)
        .resize(1920)
        .write('uploads/big_' + req.file.filename, (err) => {
            console.log(err);
        });
    res.status(200).json({success: true});
});
app.use('/files', express.static('uploads'));
app.listen(process.env.PORT || 4000, function () {
    console.log('Your node js server is running on ' + process.env.PORT);
});
app.get('/', function(req,res){
console.log("xyz");
});