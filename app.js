const express = require("express");
const config = require("config");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");

const socketio = require("socket.io");

//Body parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: config.get("secret_key"),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

//Template
app.set("views", __dirname + "/apps/views");
app.set("view engine", "ejs");

//Static files
app.use("/static", express.static(__dirname + "/public"));

//Controllers config
const controllers = require(__dirname + "/apps/controllers");

app.use(controllers);

const host = config.get("server.host");
const port = config.get("server.port");

const server = app.listen(port, host, function(){
    console.log("Server is running on port", port);
})

process.on('uncaughtException', function (err) {
    console.log(err);
}); 

const io = socketio(server);

const socketcontrol = require("./apps/common/socketcontrol")(io);