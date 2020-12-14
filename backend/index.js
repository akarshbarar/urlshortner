const express =require("express")
const bodyparser=require("body-parser")
const { JsonDB } =require( 'node-json-db')
const { Config } =require( 'node-json-db/dist/lib/JsonDBConfig')
const shortid = require('shortid');

const app=express()
app.use(express.json())
const port=process.env.PORT || 5000

var db = new JsonDB(new Config("myDataBase", true, false, '/'));
app.listen(port,()=>{
    console.log(`SERVER RUNNING AT ${port}`)
});

app.get("/:shorturl",(req,res)=>{
  
    try {
        var data = db.getData("/"+req.params.shorturl);
        console.log(data.url)
        res.json({
            "status":"200",
            "METHOD":"GET",
            "message":data
        });
    } catch(error) {
        // The error will tell you where the DataPath stopped. In this case test1
        // Since /test1/test does't exist.
        console.error(error);
        res.json({
            "status":"500",
            "METHOD":"GET",
            "message":"ERROR"
        }).sendStatus(500);
    };
})

app.get("/api/getall",(req,res)=>{

    try {
        var data = db.getData("/");
        console.log(data)
        res.json({
            "status":"200",
            "METHOD":"GET",
            "message":data
        });
    } catch(error) {
        // The error will tell you where the DataPath stopped. In this case test1
        // Since /test1/test does't exist.
        console.error(error);
        res.json({
            "status":"500",
            "METHOD":"GET",
            "message":"ERROR"
        }).sendStatus(500);
    };

});

app.post("/",(req,res)=>{

    let shorturl=shortid.generate();

    db.push("/"+shorturl,{
        "url":req.body.url,
        "shorturl":shorturl
    },true);

    res.json({
        "status":"200",
        "METHOD":"POST",
        "message":"SAVED DATA",
        "shorturl":shorturl
    });

})