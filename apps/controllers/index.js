const express = require("express");

const router = express.Router();

const post_md = require("../models/post")

router.use("/admin", require(__dirname + "/admin.js"));
router.use("/blog", require(__dirname + "/blog.js"));
router.use("/updateuserinfo", require(__dirname + "/updateuserinfo.js"))
router.use("/updatepassword", require(__dirname + "/updatepassword.js"))

router.get("/chat", function(req, res){
    res.render("chat");
})

router.post('/signout', (req, res) => {
    req.session.user = undefined;
    res.json({});
})

router.get("/", function(req, res){
    if(req.session.user){
        const data = post_md.getAllPosts();

        const _user = req.session.user;

        data.then(function(posts){
            let avatarpath;

            if(_user.imgpath){
                const rawimgpath = _user.imgpath;
                avatarpath =rawimgpath.substring(rawimgpath.indexOf('img'));
            }
            else{
                avatarpath = ''
            }

            let avatarimgpath = avatarpath.replace(/\\/g, "/")

            const data = {
                user: {
                    first_name: _user.first_name,
                    last_name: _user.last_name,
                    email: _user.email,
                    address1: _user.address1,
                    address2: _user.address2,
                    state: _user.state,
                    country: _user.country,
                    phone: _user.phone,
                    imgpath: avatarimgpath,
                    company_name: _user.company_name,
                    company_site: _user.company_site
                }  
            };

            res.render("home", data)
        }).catch(function(err){
            res.json({error: true, message: err.message});
        });
    }
    else {
        res.redirect("/admin/signin");
    }
});

router.post('/signout', (req, res) => {
    delete req.session.user;
    res.json({});
})

module.exports = router;