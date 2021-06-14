const express = require("express");

const multiparty = require("multiparty");

const user_md = require("../models/user");
const post_md = require("../models/post")

const router = express.Router();

const helper = require("../helpers/helper");
const user = require("../models/user");

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

            res.render("updateuserinfo", data)
        }).catch(function(err){
            res.json({error: true, message: err.message});
        });
    }
    else {
        res.redirect("/admin/signin");
    }
});

router.put("/", function(req, res){
    const form = new multiparty.Form({ uploadDir: 'public/img' })
    form.parse(req, (err, fields, files) => {
        if(err){
            res.json({})
        }
        else {
            const user = {
                first_name: fields.upfname[0],
                last_name: fields.uplname[0],
                phone: fields.upphone[0],
                company_name: fields.upcompanyname[0],
                company_site: fields.upcompanysite[0],
                imgpath: (typeof files.addAvatar === 'undefined') ? '' : files.addAvatar[0].path
            }
            user_md.updateUser(user, req.session.user.email)
            .then(result => {
                console.log('THANH COONG')
                res.json({message: 'THANH CONG'})

            })
            .catch(error => {
                console.log(error.message)
                res.json({message: 'THAT BAI'})      
            })
        }
    })
})


module.exports = router;