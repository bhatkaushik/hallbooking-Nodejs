import fs from "fs";
import express from "express";
import dotenv from 'dotenv';
// config dot env file
dotenv.config();

//rest object
const app = express();

const port = process.env.PORT;
console.log(`Port: ${port}`);

//routes
app.get('/', (req, res) => {
  res.send("<p> Welcome to NodeJS FileSystem !!!</br></br>/logging -> for creating a text file(date-time.txt) in the folder with content as current timestamp</br>/get-files -> for retrieving files available in the folder");
})

// creating file with current time stamps
app.get('/create-file', (req, res) => {
    var timestamp = Date.now();
    var current = (new Date().toLocaleString()).replace(/[ :,\/]/g, "_");
    let content = `${timestamp.toString()}`
    fs.writeFile(`./TextFiles/${current}.txt`,content,(err)=>{
        if(err){
            res.send(err);
        }else{
            res.send(`Completed writing the ${current}.txt file with ${timestamp}</br></br>/create-file -> for creating a text file(date-time.txt) in the folder with content as current timestamp</br>/get-files -> for retrieving files available in the folder`);   
        }
    })
  })

// displaying all files
app.get('/get-files',(req,res) =>{
    const files = fs.readdir("./TextFiles/",(err,files)=>{
      console.log(files);
      if(err){
          console.log(err);
           }else{
            // res.send(files);   
            res.send(`Files available in /TextFiles are: </br>${files.map((file) => `<li>${file}</li>`)}</br></br>/create-file -> for creating a text file(date-time.txt) in the folder with content as current timestamp</br>/get-files -> for retrieving files available in the folder`);
           }
       });
  })
//port
const PORT = 8000 || process.env.PORT;

//listen server
  app.listen(port, () => {
    console.log(`NodeJS FileSystem app listening on port ${port}`)
  })