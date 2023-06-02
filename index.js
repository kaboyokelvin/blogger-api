require('@babel/register');

const app =require('./src/app');

app.listen(4000, () => {
    console.log('App is listening on port 4000');
})