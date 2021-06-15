const express = require("express")
const app = express();

const user_md = require("../models/user");
const post_md = require("../models/post")

const router = express.Router();

router.get("/", function(req, res){
    res.render("updatepassword")
})