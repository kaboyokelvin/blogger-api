const express = require('express');

const app = express()

app.post('/signup', (req, res) => {
    res.send('ok')
})

module.exports = app;