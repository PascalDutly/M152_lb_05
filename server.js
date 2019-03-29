var express = require('express');
var multer = require("multer");
const ejs = require('ejs');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('uploads'));

var upload = multer({ storage: storage });

var gm = require("gm").subClass({
    imageMagick: true
});

var app = express();
app.post('/api/file', upload.single('file'), function (req, res) {
    gm(req.file.path)
        .resize(720)
        .write('uploads/small_' + req.file.filename, function (err) {
        console.log(err);
    });
    gm(req.file.path)
        .resize(1280)
        .write('uploads/medium_' + req.file.filename, function (err) {
        console.log(err);
    });
    gm(req.file.path)
        .resize(1920)
        .write('uploads/big_' + req.file.filename, function (err) {
        console.log(err);
    });
    res.status(200).json({ success: true });
});

app.post('/api/files', upload.array('file'), function (req, res) {
    req.files.forEach(function(element){
        gm(element.path)
            .resize(720)
            .write('uploads/small_' + element.filename, function (err) {});
        gm(element.path)
            .resize(1280)
            .write('uploads/medium_' + element.filename, function (err) {});
        gm(element.path)
            .resize(1920)
            .write('uploads/big_' + element.filename, function (err) {});
    });
    res.status(200).json({success: true});
});

app.use('/files', express.static('uploads'));
app.listen(process.env.PORT || 4000, function () {
    console.log('Your node js server is running on ' + process.env.PORT);
});
app.get('/', function (req, res) {
    res.render("\index.ejs");
});

app.get('*', function(req, res){
   res.render("\image_gallery.ejs");
});
