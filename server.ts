import {app} from "./app";
require("dotenv").config();
import connectDB from "./utils/db";

//create server
app.listen(process.env.PORT,()=>{
    console.log(`server is connected with ${process.env.PORT}`);
    connectDB();
});