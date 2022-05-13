// Required modules 
const express = require("express");
const app = express();
const dblib = require("./dblib.js");

const multer = require("multer");
const upload = multer();

// Add middleware to parse default urlencoded form
// Server configuration

app.use(express.urlencoded({ extended: false })); // <--- middleware configuration


// Setup EJS
app.set("view engine", "ejs");

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Application folders
app.use(express.static("public"));

// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

// Setup routes
app.get("/", (req, res) => {
    //res.send("Root resource - Up and running!")
    res.render("index");
});


//total records
app.get("/import", async (req, res) => {
    // Omitted validation check
    const totRecs = await dblib.getTotalRecords();
    res.render("import", {
        type: "get",
        totRecs: totRecs.totRecords,
        
    });
});

app.post("/book", async (req, res) => {
    // Omitted validation check
    //  Can get this from the page rather than using another DB call.
    //  Add it as a hidden form value.
    const totRecs = await dblib.getTotalRecords();
    res.render("book", {
        type: "post",
        totRecs: totRecs.totRecords,
        result: `Unexpected Error: ${err.message}`,
        cus: req.body
    });
}); 

// Add packages
require("dotenv").config();
// Add database package and connection string
const { Pool } = require('pg');
const { render } = require("express/lib/response");
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
//import local file 
app.get("/import", async (req, res) => {
    res.render("import");
 });
 
 app.post("/import",  upload.single('filename'), async (req, res) => {
     if(!req.file || Object.keys(req.file).length === 0) {
         message = "Error: Import file not uploaded";
         return res.send(message);
     };
     //Read file line by line, inserting records
     const buffer = req.file.buffer; 
     const lines = buffer.toString().split(/\r?\n/);


//Capture Error
//declare variable
var numFailed = 0;
var numInserted = 0;
var errorMessage = "";

     for (line of lines) {
          //console.log(line);
          book = line.split(",");
          //console.log(customer);
          const result = await dblib.insertBook(book);
    console.log("result is: ", result);
    if (result.trans === "success") {
        numInserted++;
    } else {
        numFailed++;
        errorMessage += `${result.msg} \r\n`;
    };
};    
console.log(`Records processed: ${numInserted + numFailed}`);
console.log(`Records successfully inserted: ${numInserted}`);
console.log(`Records with insertion errors: ${numFailed}`);
if(numFailed > 0) {
    console.log("Error Details:");
    console.log(errorMessage);
}; 
 
     //message = `Processing Complete - Processed ${lines.length} records`;
     message = `Total records processed: ${numInserted + numFailed} \n Records inserted successfully: ${numInserted} \n Records not inserted: ${numFailed} \n Errors: \n ${errorMessage} \r\n`;
     res.send(message);
});


app.get("/sum", (req, res) => {
    res.render("sum");
});
   

