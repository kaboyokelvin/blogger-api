const express = require('express');
const mongoose = require('mongoose');
const user = require('./models/users')
const app = express()

app.use(express.urlencoded({ extended: false }));
app.use(express.json())

mongoose.connect('mongodb+srv://kaboyokelvin:0774466063@cluster0.wtfh4c0.mongodb.net/').catch(error=>console.log(error.message))

app.post('/signup', async(req, res) => {
    const newuser = await user.create({email:req.body.email,password:req.body.password});
    console.log(newuser);
    res.end();
})

module.exports = app;