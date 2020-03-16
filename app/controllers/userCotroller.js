const UserModel = require('../model/userModel');


exports.createUser = function (req,res) {
    var newUser = new UserModel(req.body);
    console.log(newUser);
    UserModel.createUser(newUser,function (err,content) {
        if (err)
            res.json(err);
        res.json(content);
    })
};

exports.checkEmailValidation = function (req, res) {
    UserModel.checkEmailValidation(req.params.email,function (err, content) {
        if (err)
            res.json(err);
        res.json(content);
    })
};

exports.checkLogin = function (req,res) {
    console.log("query",req.query);
    console.log("body",req.body);
    var loginInfo = new UserModel(req.body);
    UserModel.checkLogin(loginInfo,function (err,content) {
        if (err)
            res.json(err);
        console.log(content);
        res.json(content); //jsonp 사용 했으면 json사용 하지 말거라 : ERR_HTTP_HEADERS_SENT
    })
};

exports.verifyEmail = function (req,res) {
    console.log("query",req.query);
    console.log("body",req.body);

    UserModel.verifyEmail(req.body,function (err, content) {
        if (err)
            res.json(err);
        res.json(content);
    })
};

exports.getAllUserDatas = function (req,res) {
    console.log("getAllUserDatas params",req.params);
    UserModel.getAllUserDatas(req.params.id,function (err, content) {
        if (err)
            res.json(err);
        res.json(content);
    })
};

exports.editUserData = function (req,res) {
    console.log("editUserData req.body",req.body);
    console.log("editUserData req.files",req.files);

    UserModel.editUserData(req, function (err, content) {
        if (err)
            res.json(err);
        res.json(content);
    }).then(r  => {
        console.log("editUserData then : ",r)
    })
};

exports.updateFCMToken = function (req,res) {
    UserModel.updateFCMToken(req.body,function (err, content) {
        if (err)
            res.json(err);
        res.json(content);
    }).then(r  => {
        console.log("updateFCMToken then : ",r)
    })
};

exports.deleteFCMToken = function (req,res) {
    UserModel.deleteFCMToken(req.params.id,function (err, content) {
        if (err)
            res.json(err);
        res.json(content);
    }).then(r  => {
        console.log("deleteFCMToken then : ",r)
    })
};