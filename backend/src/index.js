import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from './app.js';

dotenv.config({
    path: "./.env"
});

const port = process.env.PORT || 8000;

connectDB()
    .then(() => {

        app.on("error", (err) => {
            console.log("Server Error !!!");
        })

        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        })
    })
    .catch((err) => {
        console.log("MONGODB connection failed !!!");
    })