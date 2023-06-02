require('@babel/register');

import app from "./src/app";

app.listen(process.env.PORT || 4000, () => {
    console.log('App is listening on port: ', process.env.PORT)
})