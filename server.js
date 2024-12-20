import app from "./src/index.js"
import dotenv from 'dotenv'

dotenv.config();

app.listen(process.env.PORT, function (err) {
    if (err) console.log(err);
    console.log(`Server listening on http://127.0.0.1:${process.env.PORT}`)
});
