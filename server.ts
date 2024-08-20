import {app} from "./app";
require("dotenv").config();
import connectDB from "./utils/db";

//create server
app.listen(process.env.PORT,()=>{
    console.log(`server is connected with ${process.env.PORT}`);
    connectDB();
    //list all routes
    app._router.stack.forEach(function(r:any){
        if (r.route && r.route.path){
            console.log(r.route.path)
        }
    })
});