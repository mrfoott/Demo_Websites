const bcrypt = require("bcrypt");
const config = require("config");

function hash_password(password){
    const saltRounds = 10;
    // const saltRounds = config.get("salt");

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
}

function compare_password(password, hash){
    return bcrypt.compareSync(password, hash); 
}

module.exports = {
    hash_password : hash_password,
    compare_password: compare_password
}