const express = require("express");

const user_md = require("../models/user");
const post_md = require("../models/post")

const router = express.Router();

const helper = require("../helpers/helper");

router.get("/", function(req, res){
    // res.json({"message" : "This is Admin page"});

    if(req.session.user){
        const data = post_md.getAllPosts();

        data.then(function(posts){
        const data = {
            posts: posts,
            error:false
        };
            res.render("admin/home", {data: data})
        }).catch(function(err){
            res.render("admin/home", {data: {error: "Get data error"}})
        });
    }
    else {
        res.redirect("/admin/signin");
    }

    
});

router.get("/signup", function(req, res){
    res.render("signup", {data: {}});
});

router.get("/signin", function(req, res){
    res.render("signin", {data: {}});
});

router.post("/signin", function(req, res){
    const params = req.body;

    // if(params.email.trim().length == 0){
    //     res.render("signin", {data: {error: "Please enter an email"}});
    // }
    // else {
    const data = user_md.getUserByEmail(params.email);
    if (data){
        data.then(function(users){
            const uuser = users[0];
            const status = helper.compare_password(params.password, uuser.password)
            
            if (!status) {
                res.status(500).send({status: 500, message: "Password is incorrect"});
            }
            else {
                req.session.user = uuser;
                res.status(200).json({status: 200, message: "success"});
                console.log(uuser);
                res.redirect("/admin");
            }
        });
    }
    else {
        res.render("signin", {data: {error: "User not exist"}});
    }
    // }
});

router.post("/signup", function(req, res){
    const user = req.body;

    console.log(user);

    if(user.email.trim().length == 0){
        res.render("signup", {data: {error: "Email is required"}});
    }

    if(user.passwd != user.repasswd && user.passwd.trim().length != 0){
        res.render("signup", {data: {error: "Password is not matched"}});
    }

    //Insert into DB
    const password = helper.hash_password(user.passwd);

    userAdd = {
        email: user.email,
        password: password,
        first_name: user.fname,
        last_name: user.lname,
        address1: user.address1,
        address2: user.address2,
        phone: user.phone,
        state: user.state,
        country: user.country
    }

    // result.then(function(data){
    //     res.redirect("/admin/signin");
    // })
    // .catch(function(err){
    //     res.render("signup", {data: {error: "error"}});
    // });

    const result = user_md.addUser(userAdd);

    // if (!result) {
    //     res.render("signup", {data: {error: "Could not insert data to DB"}});
    // }
    // else {
    //     res.json({message : "Inserted to DB"});
    // }

    result
    .then ( (data) => { res.redirect("/admin/signin");})
    .catch( (err) => {res.json({message: err.message})});
});

router.get("/post/new", function(req, res){
    if(req.session.user){
        res.render("admin/post/new", {data: {error: false}});
    }
    else {
        res.redirect("/admin/signin");
    }
});

router.post("/post/new", function(req, res){
    const params = req.body;

    if(params.title.trim().length == 0){
        const data = {
            error: "Please enter a tittle"
        };

        res.render("admin/post/new", {data: data})
    }
    else {
        const now = new Date();

        params.created_at = now;
        params.updated_at = now;

        const data = post_md.addPost(params);

        data.then(function(result){
            res.redirect("/admin");
        }).catch(function(err){
            const data = {
                error: "Could not post new post"
            };
            res.render("admin/post/new", {data: data});
        });
    }
});

router.get("/post/edit/:id", function(req, res){
    if(req.session.user){
        const params = req.params;
        const id = params.id;

        const data = post_md.getPostByID(id);

        if(data)
        {
            data.then(function(posts){
                const post = posts[0];
                const data = {
                    post: post,
                    error: false
                };
                res.render("admin/post/edit", {data: data})
            }).catch(function(err){
                const data = {
                    error: "Could not get post by ID"
                };
                res.render("admin/post/edit", {data: data})
            })
        }
        else {
            const data = {
                error: "Could not get post by ID"
            };
            res.render("admin/post/edit", {data: data})
        }
    }
    else {
        res.redirect("/admin/signin");
    }    
})

router.put("/post/edit", function(req,res){
    const params = req.body;

    data = post_md.updatePost(params);

    if(!data){
        res.json({status_code: 500});
    }
    else {
        data.then(function(result){
            res.json({status_code: 200});
        }).catch(function(err){
            res.json({status_code: 500});
        })
    }
});

router.delete("/post/delete", function(req,res){
    const post_id = req.body.id;

    const data = post_md.deletePost(post_id);

    if(!data){
        res.json({status_code: 500});
    }
    else {
        data.then(function(result){
            res.json({status_code: 200});
        }).catch(function(err){
            res.json({status_code: 500});
        });
    }
});

router.get("/post", function(req, res){
    if(req.session.user){
        res.redirect("/admin");
    }
    else {
        res.redirect("/admin/signin");
    }
})

router.get("/user", function(req, res){
    if(req.session.user){
        const data = user_md.getAllUsers();

        data.then(function(users){
            const data = {
                users: users,
                error: false
            }

            res.render("admin/user",{data: data});
        }).catch(function(err){
            const data = {
                error: "Could not get user info"
            };

            res.render("admin/user", {data: data});
        });
    }
    else {
        res.redirect("/admin/signin");
    }    
});

module.exports = router;