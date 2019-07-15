var spawn = require('child_process').spawn;
var http = require('http');
var https = require('https');
var url = require('url');
var validUrl = require('valid-url');
var urlExists = require('url-exists');
var fs = require('fs');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var request = require("request");
var EventEmitter = require("events").EventEmitter;
var body = new EventEmitter();
var cheerio = require("cheerio");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const PORT=8080;
const port=8081;

var globalString = "Ori";

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/API1', function (req, res) {
	var dicUrl = req.body.link;
	urlExists(dicUrl, function(err, exists) {
  		console.log(exists); // false 
  		if (exists === true)
  		{
  			var file_name = url.parse(dicUrl).pathname.split('/').pop();
			const path = "./" + file_name;
			if(fs.existsSync(path)) 
			{
				res.json(file_name + " already exists. ");
			} 
			else 
			{
				const file = fs.createWriteStream(path);
				const request = https.get(dicUrl, function(response) {
					response.pipe(file);
					file.on('finish', function() {
		      			file.close();  // close() is async, call cb after close completes.
		      			console.log('Download finished: ' + file_name + ' is downloaded to current directory.');
		      			res.json(file_name + ' is loaded.');
		    		});
				}).on('end', function() {
			      file.end();
			      console.log('Download end' + file_name + ' is downloaded to current directory.');
			      res.json('Download end' + file_name + ' is downloaded to current directory.');
			  	}).on('error', function(err) { // Handle errors
				    fs.unlink(file); // Delete the file async. (But we don't check the result)
				    console.log("??" + err);
				  });
			};
  		}
  		else
  		{
  			res.json('Invalid url - ' + dicUrl);
  		}
	});
    /*
    dicUrl = req.body.link;
    if(dicUrl) {
    	api1(dicUrl, function(result) {
                res.status(200).send(result);
            });
    } else {
    	res.status(500).send("ERROR: Please provide link?");	
    }
    */
});

app.post('/API2', function (req, res, next) {
	//console.log(req.body.word);
	//console.log(req.body.delta);
	//console.log(req.body.number);
	var array = [];
	array.push(req.body.word);
	array.push(req.body.delta);
	array.push(req.body.number);
	//console.log(array);
	//var childProcess = spawn("g++", ["-std=c++11", "nearestWordGenerator.cpp", "-o", "nearestWordParser"]);
	var childProcess = spawn("./nearestWordParser", array);
	var scriptOutput = "";
	childProcess.stdout.setEncoding('utf8');
	childProcess.stdout.on('data', function(data) 
	{
		//console.log('stdout: ' + data);
		data = data.toString();
		scriptOutput+=data;
	});
	childProcess.on('close', function(code) 
	{
		console.log(code);
		//console.log('Full output of script: ', scriptOutput);

		//response.write("Siqi ");
		//console.log(scriptOutput);
		res.json(scriptOutput);
	});
	/*
    //var user = auth(req);
    if((req.body.word)&&(req.body.delta)&&(req.body.number))
    {
        api2(req.body, function(result) {
            res.status(200).send(result);
        });
    } else {
        res.status(500).send("ERROR: Please provide word, delta, and number");
    }
    */
});

app.post('/API3', function (req, res, next) {
	//console.log(req.body.word);
	//console.log(req.body.delta);
	//console.log(req.body.number);
	var array = [];
	array.push("nearestWordGenerator.py")
	array.push(req.body.word);
	array.push(req.body.delta);
	array.push(req.body.number);
	//console.log(array);
	//var childProcess = spawn("g++", ["-std=c++11", "nearestWordGenerator.cpp", "-o", "nearestWordParser"]);
	var childProcess = spawn("python", array);
	var scriptOutput = "";
	childProcess.stdout.setEncoding('utf8');
	childProcess.stdout.on('data', function(data) 
	{
		//console.log('stdout: ' + data);
		data = data.toString();
		scriptOutput+=data;
	});
	childProcess.on('close', function(code) 
	{
		console.log(code);
		//console.log('Full output of script: ', scriptOutput);

		//response.write("Siqi ");
		//console.log(scriptOutput);
		res.json(scriptOutput);
	});
	/*
    //var user = auth(req);
    if((req.body.word)&&(req.body.delta)&&(req.body.number))
    {
        api2(req.body, function(result) {
            res.status(200).send(result);
        });
    } else {
        res.status(500).send("ERROR: Please provide word, delta, and number");
    }
    */
});

app.get('*', function(req, res){
  res.send("This endpoint doesn't exist", 404);
});
app.post('*', function(req, res){
  res.send("This endpoint doesn't exist", 404);
});

var server = app.listen(port, () => console.log(`app listening on port ${port}`));

function api1 (link, callback) 
{
	console.log("--------");

    request(link, function(error, response, data)
    {
    	body.data = data;
    	body.emit('update');
    	//console.log(globalString);
    	/*????????????????????
    	const $ = cheerio.load(data);
    	const pText = $("body > pre").text();
    	console.log(pText);
    	*/
    })
    body.on('update', function () {
    	globalString = body.data; // HOORAY! THIS WORKS!
	});
    callback("????????");
}

function api2 (data, callback) {
    //do things
    callback("");
}

/*
fs.readFile("index.html", function (err, html) 
{

    if (err) throw err;    

    //var childProcess = spawn("g++", ["-std=c++11", "nearestWordGenerator.cpp", "-o", "nearestWordParser"]);

    http.createServer(function(request, response) 
    {   
    	var childProcess = spawn("g++", ["-std=c++11", "nearestWordGenerator.cpp", "-o", "nearestWordParser"]);
        if (request.method == 'POST') 
        {
			console.log("POST");
			var body = "";
			var array;
			request.on('data', function (data) 
			{
				body += data;
				array = body.split(' ');
				console.log(array);
				console.log("fun() start");
				var childProcess = spawn("./nearestWordParser", array);
				var scriptOutput = "";
				childProcess.stdout.setEncoding('utf8');
				childProcess.stdout.on('data', function(data) 
				{
					//console.log('stdout: ' + data);
					data = data.toString();
					scriptOutput+=data;
				});
				childProcess.on('close', function(code) 
				{
					console.log(code);
					//console.log('Full output of script: ', scriptOutput);

					//response.write("Siqi ");
					response.end(scriptOutput);
				});
			});
			//response.writeHead(200, {'Content-Type': 'text/html'});

			//response.write("Siqi " + sendBack);
			//response.end("Liu " + sendBack);
		}
		else
		{
			response.writeHeader(200, {"Content-Type": "text/html"});  
			response.write(html);
			response.end();  
		}  
    }).listen(PORT);
});
*/