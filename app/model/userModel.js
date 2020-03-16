const sql = require('../../db_connection');
const crypto = require('crypto');
const mailer = require('../util/mailer');
const randomString = require('randomstring');
const fs = require('fs');

const models = require('../../models');

const User = function (infos) {
    this.user_id = infos.user_id;
    this.password = infos.password;
    this.email = infos.email;
    this.name = infos.name;
    this.secretToken = infos.secretToken;
};

const getHashPassword = (inputPassword,salt)=>{
    return  crypto.createHash("sha512").update(inputPassword+salt).digest("hex");
};
const getSalt = () =>{
    return Math.round((new Date().valueOf()*Math.random())) + "";
};

User.createUser = function (newInfo,result) {
    let inputPassword = newInfo.password;
    let salt = getSalt();
    let hashPassword = getHashPassword(inputPassword,salt);

    // sql.query("INSERT INTO UserInfo (id, password, email, name,salt) SELECT * FROM (SELECT ?, ?, ? ,?,?) AS tmp WHERE NOT EXISTS (SELECT id FROM UserInfo WHERE id = ?) LIMIT 1",
    //     [newInfo.id,hashPassword,newInfo.email,newInfo.name,salt,newInfo.id],function (err,res) {
    //     if (err){
    //         console.log("err createUser :",err);
    //         result(err,null);
    //     }else {
    //         console.log("createUser : ",res);
    //         if(res.affectedRows === 1)
    //             res = {isRegistered : true};
    //         else
    //             res= {isRegistered: false};
    //         result(null,res);
    //     }
    //
    // });


    //Generate secret token
    const secretToken = randomString.generate();

    models.UserInfo.create({
        user_id : newInfo.user_id,
        password : hashPassword,
        email : newInfo.email,
        name : newInfo.name,
        secretToken : secretToken,
        salt : salt
    })
        .then(res =>{
            console.log("createUser success");
            // email에 담길 내용
            const subject = "[Coconut] 이메일 인증이 필요합니다";
            const html =
                `Welcome to Coconut
            <br/>
            코코넛 가입을 축하드립니다!
            <br/>
            코코넛 계정 활성화를 위해 아래 코드를 입력해주세요
            <br/><br/>
            [코드]<br/><b>${secretToken}</b>`;

            // send an email
            mailer.sendEmail('Coconut@coconut.com',newInfo.email,subject,html);
            result(null,{isRegistered : true});
        })
        .catch(err=>{
            console.log("createUser fail",err);
            result({isRegistered : false, err : err},null);
        });
};

User.checkEmailValidation = function(email, result){

    // sql.query("select if(email = ?,true,false) as checkId from UserInfo where exists(select email from UserInfo where email = ?) limit 1;",
    //     [registerEmail,registerEmail],function (err,res) {
    //     if (err){
    //         console.log("err checkEmailValidation :",err);
    //         result(err,null);
    //     }else {
    //         console.log("checkEmailValidation : ",res);
    //         let isEmailOk = res.length === 0;
    //         console.log('isEmailOk',isEmailOk);
    //         result(null,{isEmailOk : isEmailOk});
    //     }
    // });

    models.UserInfo.count({where : {email : email}})
        .then(count =>{
            console.log("checkEmailValidation : ",count);
            if (count !== 0)
                result(null,{isEmailOk : false});
            else
                result(null,{isEmailOk : true});
        })
        .catch(err =>{
            console.log("err checkEmailValidation err : ",err);
            result(err,null);
        });
};

User.checkLogin = function(loginInfo,result){
    let UserData;
    let isCorrect = false;
    let isConfirmed = false;
    let id;

    // sql.query("select id,password,salt,if(email = ?,true,false) as checkId from UserInfo where email = ? limit 1",
    //     [loginInfo.email,loginInfo.email],function (err,res) {
    //     if (err){
    //         console.log("err checkLogin :",err);
    //         result(err,null);
    //     }else {
    //         if (res.length === 0){
    //             isExist = false;
    //         }else {
    //             isExist = res[0].checkId !== 0;
    //         }
    //         console.log("checkLogin : ",res);
    //         console.log("isExist : ",isExist);
    //         console.log("auto remember check : ",isRemember);
    //         if (isExist){
    //             dbPassword = res[0].password; // 암호화된 값
    //             dbEmail = res[0].email;
    //             inputPassword = loginInfo.password; // 평범한 string
    //             salt = res[0].salt; // db salt값
    //             hashPassword = getHashPassword(inputPassword,salt); // 사용자 입력값으로 암호화된 값 리턴
    //             isCorrect = dbPassword === hashPassword; // 암호화된 값들끼리 비교
    //        }
    //         res = {
    //             "isCorrect":isCorrect,
    //             "email":dbEmail,
    //             "isRemember":isRemember
    //         };
    //         result(null,res);
    //     }
    // });

    models.UserInfo.findOne({where : {email : loginInfo.email}})
        .then(user =>{
            if (user === null) // 존재하지 않는 email
                isCorrect = false;
            else // 존재하는 email
            {
                console.log("checkLogin ",user.dataValues);
                UserData = user.dataValues;
                isCorrect = UserData.password
                    === getHashPassword(loginInfo.password,UserData.salt);
                isConfirmed = UserData.confirmed;
                id = UserData.id;
            }

            result(null,{
                isCorrect : isCorrect,
                isConfirmed : isConfirmed,
                id : id
            });
        })
        .catch(err =>{
            console.log("checkLogin err ",err);
            result(err,null);
        })
};

User.verifyEmail = function(body,result){
    let UserData;
    let isConfirmed = false;
    let id;

    models.UserInfo.findOne({
        where : {
            email : body.email,
            secretToken : body.secretToken
    }})
        .then(user =>{
            if (user !== null)
            {
                UserData = user.dataValues;
                isConfirmed = body.secretToken === UserData.secretToken;
                id = UserData.id;
            }
            if(isConfirmed){
                models.UserInfo.update(
                    {confirmed: true},
                    {where : {email : body.email}}
                    )
                    .then(()=>{
                        console.log("verifyEmail confirmed = true")})
                    .catch(err =>{
                        console.log("verifyEmail confirmed err ",err)
                    })
            }
            result(null,{
                isConfirmed : isConfirmed,
                id : id
            });
        })
        .catch(err =>{
            console.log("checkLogin err ",err);
            result(err,null);
        })
};

User.getAllUserDatas = function(id,result){
    models.UserInfo.findAll({
        attributes : ["id","profile_image","back_image","user_id","email","name","message"]
    })
        .then(user => {

            let myJson;
            let friendJson =[];
            user.filter(data =>{
                // 로그인한 사람의 id는 myJson에 삽입
                // 나머지 사람들의 id는 friendJson에 삽입
                if(data.id != id) friendJson.push(data);
                else myJson= data;
            });

            // myJson를 friendJson의 앞에 삽입
            // 로그인한 사람의 정보를 맨 앞에 보내기 위함
            if (myJson !== undefined) {
                friendJson.unshift(myJson);
                result(null,friendJson)
            }else
                result(null,[{err : "존재하지 않은 회원입니다"}]);
        })
        .catch(err =>{
            console.log("getAllUserDatas err ",err);
            result(err,null);
        })
};


User.editUserData = async function(req,result){
    let body = req.body;
    let file = req.files;
    var updateOptions = {};

    const user = await models.UserInfo.findByPk(body.id);
    console.log(user.profile_image);

    if (typeof body.user_id !== "undefined"){
        updateOptions.user_id = body.user_id;
    }
    if (typeof body.name !== "undefined"){
        updateOptions.name = body.name;
    }
    if (typeof body.message !== "undefined"){
        updateOptions.message = body.message;
    }
    if (typeof file.user_img !== "undefined"){
        updateOptions.profile_image = file.user_img[0].path.replace('/var/www/html','');
    }
    if (typeof file.back_img !== "undefined"){
        updateOptions.back_image = file.back_img[0].path.replace('/var/www/html','');
    }
    console.log("editUserData updateOptions",updateOptions);

    models.UserInfo.update(
        updateOptions,
        {   where : {id : body.id} })
        .then(res =>{
            console.log("editUserData ",res);

            if (typeof file.user_img !== "undefined" && user.profile_image !== null){
                try {fs.unlinkSync('/var/www/html'+user.profile_image);
                }catch (e) {console.log("unlinkSync err",e)}
            }
            if (typeof file.back_img !== "undefined" && user.back_image !== null){
                try {fs.unlinkSync('/var/www/html'+user.back_image)
                }catch (e) {console.log("unlinkSync err",e)}
            }

            let send = {};
            if (res){
                send.success = true;
                send.message = "편집 완료"
            }else {
                send.success = false;
                send.message = "편집 실패"
            }
            result(null,send);
        })
        .catch(err =>{
            console.log("editUserData err ",err);
            result(err,null)
        })
};

User.updateFCMToken = async function(body,result){
    console.log({body});
    let send = {};

    models.UserInfo.update(
        {
            fcm_token : body.fcm_token
        },
        {
            where : {id : body.id}
        }
    ).then(res =>{
        console.log("updateFCMToken success",res);

        if (res === 1){
            send.success = true;
            send.message = "fcm token update 성공";
            send.message_two =`${res}`;
        }else {
            send.success = false;
            send.message = "fcm token update 알수 없는 실패";
            send.message_two = `${res}`;
        }


        result(null,send);
    }).catch(err =>{
        console.log("updateFCMToken err",err);
        send.success = false;
        send.message = "fcm token update 실패";

        result(err,null);

    });
};

User.deleteFCMToken = async function(id,result){
    console.log({id});
    let send = {};

    models.UserInfo.update(
        {
            fcm_token : null
        },
        {
            where : {id : id}
        }
    ).then(res =>{
        console.log("deleteFCMToken success",res);

        if (res === 1){
            send.success = true;
            send.message = "fcm token delete 성공";
            send.message_two =`${res}`;
        }else {
            send.success = false;
            send.message = "fcm token delete 알수 없는 실패";
            send.message_two = `${res}`;
        }


        result(null,send);
    }).catch(err =>{
        console.log("deleteFCMToken err",err);
        send.success = false;
        send.message = "fcm token delete 실패";

        result(err,null);

    });
};



module.exports = User;