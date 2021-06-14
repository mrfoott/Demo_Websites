const q = require("q");
const db = require("../common/database");

const conn = db.getConnection();

function getAllPosts(){
    const defer = q.defer();

    const query = conn.query('SELECT * FROM posts', function (error, posts) {
        if(error){
            defer.reject(error);
        }
        else {

            defer.resolve(posts);
        }
    });
    return defer.promise;
}

function addPost(params){
    if (params){
        const defer = q.defer();

        const query = conn.query('INSERT INTO posts SET ?', params, function (error, result) {
            if(error){
                defer.reject(error);
            }
            else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function getPostByID(id){
    const defer = q.defer();

    const query = conn.query('SELECT * FROM posts WHERE ?', {id:id}, function (error, posts) {
        if(error){
            defer.reject(error);
        }
        else {
            defer.resolve(posts);
        }
    });
    return defer.promise;
}

function updatePost(params){
    if (params){
        const defer = q.defer();

        const query = conn.query('UPDATE posts SET title = ?, content = ?, author = ?, updated_at = ? WHERE id = ?', 
                    [params.title, params.content, params.author, new Date(), params.id], function (error, result) {
            if(error){
                defer.reject(error);
            }
            else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function deletePost(id){
    if (id){
        const defer = q.defer();

        const query = conn.query('DELETE FROM posts WHERE id = ?', [id], function (error, result) {
            if(error){
                defer.reject(error);
            }
            else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

module.exports = {
    getAllPosts: getAllPosts,
    addPost: addPost,
    getPostByID: getPostByID,
    updatePost: updatePost,
    deletePost: deletePost
}

