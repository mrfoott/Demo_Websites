const express = require("express");
const router = express.Router();

const post_md = require("../models/post");

router.get("/", function(req, res){
    const datablog = post_md.getAllPosts();

    datablog.then(function(posts){
        const result = {
            posts: posts,
            error: false
        };
        res.render("blog/index", {data: result});
    }).catch(function(err){
        const result = {
            error: "Could not get posts"
        };
        res.render("blog/index", {data: result});
    });

    // res.render("blog/index");
});

router.get("/post/:id", function(req, res){
    const data = post_md.getPostByID(req.params.id)

    data.then(function(posts){
        const post = posts[0];

        const result = {
            post: post,
            error: false
        };

        res.render("blog/post", {data: result});
    }).catch(function(err){
        const result = {
            error: "Could not get post detail"
        };

        res.render("blog/post", {data: result});
    })
})

router.get("/about", function(req, res){
    res.render("blog/about")
})

module.exports = router;