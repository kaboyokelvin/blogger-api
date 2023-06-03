require('@babel/register');
require('dotenv').config()

const app =require('./src/app');

app.listen(1200, () => {
    console.log('App is listening on port 1200');
})