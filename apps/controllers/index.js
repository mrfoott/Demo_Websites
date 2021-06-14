const express = require("express");

const router = express.Router();

router.use("/admin", require(__dirname + "/admin.js"));
router.use("/blog", require(__dirname + "/blog.js"));
router.use("/updateuserinfo", require(__dirname + "/updateuserinfo.js"))

router

router.get("/chat", function(req, res){
    res.render("chat");
})

router.post('/signout', (req, res) => {
    req.session.user = undefined;
    res.json({});
})

router.get("/", function(req, res){
    if(req.session.user){
        const _user = req.session.user;

        const data ={
            user: {
                first_name: _user.first_name,
                last_name: _user.last_name,
                email: _user.email,
                address1: _user.address1,
                address2: _user.address2,
                state: _user.state,
                country: _user.country,
                phone: _user.phone
            }
        };
        res.render("home", data)
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