var express = require('express');
var multer = require("multer");
const ejs = require('ejs');
const fs = require('fs');
var fluent_ffmpeg = require("fluent-ffmpeg");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var storageVideo = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploadVideos/');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('uploads'));
var mergedVideo = fluent_ffmpeg();


var upload = multer({ storage: storage });
var uploadVideos = multer({ storage: storageVideo });

var gm = require("gm").subClass({
    imageMagick: true
});

function getPics(){
    return fs.readdirSync("./uploads/");
}

function getVideos(){
    return fs.readdirSync("./mergedVideo/");
}

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

app.post('/api/videos', uploadVideos.array('video'), function(req,res){
    var videoNames = req.files;
    videoNames.forEach(function(videoName){
        mergedVideo = mergedVideo.addInput(videoName.path);
    });
    mergedVideo.mergeToFile('./mergedVideo/' + req.body.videoName + '.mp4')
        .on('error', function(err) {
            console.log('Error ' + err.message);
        })
        .on('end', function() {
            console.log('Finished!');
        });
    res.status(200).json({success: true});
});

app.use('/files', express.static('uploads'));

app.listen(process.env.PORT || 4000, function () {
    console.log('Your node js server is running on ' + process.env.PORT);
});

app.use('/videos', express.static('mergedVideo'));

app.get('/', function (req, res) {
    res.render("\index.ejs");
});

app.get('/video_manager', function (req,res){
    res.render("videoManager.ejs");
});

app.get("/play_video", (req,res) => res.render("\play_video.ejs", {data: req.query.videoName}));

app.get("/gallery/image", (req,res) => res.render("\image_gallery.ejs", {data: getPics()}));

app.get("*", (req,res) => res.render("\image_gallery.ejs", {data: getPics()}));
