require('dotenv').config();
const express = require('express');
const fs = require('fs');

const app = express();

app.get('/',(req,res)=>{
    fs.readFile('index.html', (err,data)=>{
        if (err){
            console.log('read index.html error');
            throw err
        }else{
            console.log('reading index.html');
            res.end(data);
        }
    })
})

app.get('/style.css',(req,res)=>{
    fs.readFile('style.css', (err,data)=>{
        if (err){
            throw err
        }else{
            console.log('reading style.css');
            res.end(data);
        }
    })
})

app.get('/app.js',(req,res)=>{
    fs.readFile('app.js', (err,data)=>{
        if (err){
            throw err
        }else{
            console.log('reading app.js');
            res.end(data);
        }
    })
})

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Listening on ${PORT}`);
})