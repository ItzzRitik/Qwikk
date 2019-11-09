const express = require('express');
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectID;
const ran = require("randomstring");
const ip = require("ip");
const os = require("os");
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
    var x=0, load = ["⠁ ","⠈ "," ⠁"," ⠈"," ⠐"," ⠠"," ⢀"," ⡀","⢀ ","⡀ ","⠄ ","⠂ "];//"⠁⠂⠄⡀⢀⠠⠐⠈";
    return setInterval(function() {
        process.stdout.write("\r" + load[x=(++x<load.length)?x:0]+" "+msg);
    }, 50);
};

var Qwikks = mongoose.model("qwikks", new mongoose.Schema({
    userID: String,
    tag: String,
    url: String
}));

var Users = mongoose.model("users", new mongoose.Schema({
    email: String,
    pass: String,
    fname: String,
    lname: String
}));

const dbOptions = { useNewUrlParser: true, useFindAndModify: false, reconnectTries: Number.MAX_VALUE, useUnifiedTopology: true, poolSize: 10 };
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
    });
};
mongoConnect();

app.post("/qwikk", function(req, res){
    let url = req.body.url,
        tag = "", 
        qwikkUrl = "";
    Qwikks.find({ userID: "", url: url }, function(e, token) {
        if (e) { console.log(">  Error occured :\n>  " + e); }
        else {
            if (token.length){
                qwikkUrl = req.headers.host+"/"+token[0].tag;
                res.send(qwikkUrl);
                console.log(qwikkUrl);
            }
            else{
                var unique = (tag) => {
                    try {
                        Qwikks.find({ tag: tag }, function(e, token) {
                            if (e) { console.log(">  Error occured :\n>  " + e); }
                            else {
                                if (token.length) return true;
                                else return false;
                            }
                        });
                    }
                    catch (err) {
                        console.log(err);
                        return false;
                    }
                };
                do {
                    tag = ran.generate({
                        length: 5,
                        capitalization: 'lowercase',
                        charset: 'alphanumeric'
                    });
                } while (unique(tag));
                Qwikks.create({
                    userID: "",
                    tag : tag,
                    url : url
                }, function(e, user) {
                    if (e) {
                        res.send("0");
                        console.log("\r>  Error While Creating New Qwikk\n>  " + e);
                    }
                    else{
                        console.log("\r>  Qwikk Sucessfully Created");
                        qwikkUrl = req.headers.host+"/"+tag;
                        res.send(qwikkUrl);
                        console.log('  >  '+qwikkUrl);
                    } 
                });
            }
        }
    });
});

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/*", function(req, res) {
    let tag = (req.originalUrl).substring(1, (req.originalUrl).length);
    Qwikks.find({ tag: tag }, function(e, token) {
        if (e) { console.log(">  Error occured :\n>  " + e); }
        else {
            if (token.length) res.redirect(((token[0].url.indexOf('://')  && link.indexOf('mailto:') === -1)? 'http://':'')+token[0].url);
            else{
                res.send('<h1 style="text-align:center">404 Not Found</h1>');
            }
        }
    });
});

app.listen(process.env.PORT || 8080, function() {
    console.log("\n" + ++call + ") Starting Qwikk Server");
    console.log(">  Server is running at http://" + (process.env.IP || ip.address() || "localhost") + ":" + (process.env.PORT || "8080"));
    console.log("\n" + ++call + ") Connection to MongoDB Atlas Server");
    load = loader(" ".repeat(34));
});