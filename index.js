require('@babel/register');
require('dotenv').config()

const app =require('./src/app');

app.listen(4000, () => {
    console.log('App is listening on port 4000');
})