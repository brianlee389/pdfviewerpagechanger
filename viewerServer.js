// Require express and create an instance of it
var express = require('express');
var cors = require('cors')
var fs = require("fs");
var app = express();
var bodyParser = require('body-parser');

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Content-Range, Accept-Ranges");
  next();
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//
// fs.readFile("pdfSettings.json", function(err, buf) {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log(data);
//   }
// });


var pdfSettings = {
    pageNumber: 1
};

app.get('/', cors(), function (req, res) {
    res.sendStatus(200, 'Nothing is here.');
});

app.get('/getPageNumber', cors(), function (req, res) {
    res.json(pdfSettings);
});

app.get('/getForm', cors(), function (req, res, next) {
  res.setHeader('content-type', 'application/pdf');

  var data =fs.readFileSync('./GunForms.pdf');
  res.contentType("application/pdf");
  res.status(200).send(data);
});

app.options("/getForm", cors(), function(req,res,next){
  res.contentType("application/pdf");
  res.status(200).end();
});

app.post('/setPageNumber', cors(), function (req, res) {
    var newPageNumber = req.body.pageNumber;
    if (!isNaN(newPageNumber) && Number.isInteger(Number(newPageNumber)))
    {
        pdfSettings.pageNumber = newPageNumber;
        res.json(pdfSettings);
    }
    else {
      res.status(400).json({ pageNumber: pdfSettings.pageNumber, errorMessage: "pageNumber must be an integer"});
    }
});
//
// const uploadPath = ''
// app.post('/uploadForm', function(req, res) {
//   var form = new formidable.IncomingForm();
//   form.parse(req, function (err, fields, files) {
//       // oldpath : temporary folder to which file is saved to
//       var oldpath = files.filetoupload.path;
//       var newpath = upload_path + files.filetoupload.name;
//       // copy the file to a new location
//       fs.rename(oldpath, newpath, function (err) {
//           if (err) throw err;
//           // you may respond with another html page
//           res.write('File uploaded and moved!');
//           res.end();
//       });
//   });
// });

// Change the 404 message modifing the middleware
app.use(function(req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

// start the server in the port 3000 !
app.listen(3000, function () {
    console.log('Example app listening on port 3000.');
});
