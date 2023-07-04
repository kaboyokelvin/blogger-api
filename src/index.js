require('@babel/register')
require('dotenv').config()
// require('dotenv-safe').config();

const app = require('./app')

app.listen(1200, () => {
  console.log('App is listening on port 1200')
})
