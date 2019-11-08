const express = require('express');
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const ip = require("ip");
require('dotenv').config();

app.set("view engine", "ejs");
app.use('/public', express.static('public'));
app.use('/lib', express.static('node_modules'));
app.use(bodyparser.json({limit: "50mb"}));
app.use(bodyparser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let call = 0, load, mongoCall=0;
let loader = function(msg) {
        var x=0,load = ["⠁ ","⠈ "," ⠁"," ⠈"," ⠐"," ⠠"," ⢀"," ⡀","⢀ ","⡀ ","⠄ ","⠂ "];//"⠁⠂⠄⡀⢀⠠⠐⠈";
        return setInterval(function() {
            process.stdout.write("\r" + load[x=(++x<load.length)?x:0]+" "+msg);
        }, 50);
    };

const dbOptions = { useNewUrlParser: true,useFindAndModify: false, reconnectTries: Number.MAX_VALUE, useUnifiedTopology: true, poolSize: 10 };
var mongoConnect = function(callback) {
    mongoose.connect(process.env.MONGO_KEY, dbOptions).then(
        () => { 
            clearInterval(load);
            console.log("\r>  Connection Established"); 
        },
        e => { 
            clearInterval(load);
            if(++mongoCall > 1)process.stdout.write("\033[A\33[2K\r"); 
            console.log("\r>  Connection Failed - " + e.code +" "+ ((mongoCall>1)?"("+mongoCall+")":"")); 
            load=loader("  Reconnecting"); 
            setTimeout(mongoConnect,10000);
        }
    ).catch((error) => {
        assert.isNotOk(error,'Promise error');
    });;
};
mongoConnect();

app.get("/*", function(req, res) {
    res.render("index");
});

app.listen(process.env.PORT || 8080, function() {
    console.log("\n" + ++call + ") Starting Qwikk Server");
    console.log(">  Server is running at http://" + (process.env.IP || ip.address() || "localhost") + ":" + (process.env.PORT || "8080"));
    console.log("\n" + ++call + ") Connection to MongoDB Atlas Server");
    load = loader(" ".repeat(34));
});