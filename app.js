var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileUpload = require('express-fileupload');
const iconv = require('iconv-lite');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(fileUpload());

module.exports = app;


app.post('/upload', function(req, res) {
    let sampleFile;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No files were uploaded.' });
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.file;
    const utf8FileName = sampleFile.name;
    let n_archivo = utf8FileName;

    uploadPath = __dirname + '/public/files/' + n_archivo;
  
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function(err) {
        if (err)
            return res.status(500).json({ error: err });
  
        // Envía un JSON de éxito con un mensaje personalizado
        res.json({ success: true, message: 'File uploaded successfully!', nombre: n_archivo});
    })
})
