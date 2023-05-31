const express = require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https =require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

require('dotenv').config();


mailchimp.setConfig({
    apiKey: process.env.KEY,
    server: "us14"
})


const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("publics"));

app.get("/",function(req,res){

    res.sendFile(__dirname +"/signup.html");
});


app.post("/",function(req,res){
    const first_name=req.body.fname;
    const last_name=req.body.lname;
    const mail=req.body.email;

    const listId="18fec4f733";

    // console.log(first_name,last_name,mail);

    const data={
        members: [
            {
                email_address:mail,
                status:"subscribed",
                merge_fields:{
                    FNAME:first_name,
                    LNAME:last_name
                }

            }
        ]
    }

    const subscribe = async () => {
        const response = await mailchimp.lists.batchListMembers(listId, data);
        console.log(response);
            if(response.error_count == 0){
                res.sendFile(__dirname + "/success.html");
            }
            else{
                res.sendFile(__dirname + "/failure.html");
            }
    };
    subscribe();

   

    // const jsonData=JSON.stringify(data);

    // const url="https://us14.api.mailchimp.com/3.0/lists/18fec4f733";

    // const Options={
    //     method: "POST",
    //     auth: "varma:3f082aaafa0d4b051556ed71e13eb57a-us14"
    // };

    // const request=https.request(url,Options,function(response){
    //     response.on("data",function(data){
    //         console.log(JSON.parse(data));
    //     })

    // });

    // request.write(jsonData);
    // request.end;

});

app.post("/failure",function(rep,res){
    res.redirect("/");
})

app.post("/success",function(rep,res){
    res.redirect("/");
})

app.listen(process.env.PORT ||3000,function(){
    console.log("serever is running");
});


// key:
// 8009b3c1740567668e00957b0bb98ce4-us14

// listID:
// 18fec4f733