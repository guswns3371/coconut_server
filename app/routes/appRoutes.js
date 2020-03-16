module.exports = function(app) {

    /** user */
    const user = require('../controllers/userCotroller');

    const path = require('path');
    const multer = require('multer');
    const upload = multer({
        storage : multer.diskStorage({
            destination : function (req,file,cb) {
                cb(null,'/var/www/html/images/');
            },
            filename : function(req,file,cb) {
                // 이미지 파일 명 : 유저아이디_필드네임_확장자
                // ex) 1_user_img.jpg
                cb(null, `${req.body.id}_${file.fieldname}_${file.originalname}`)
            }
        })});
    
    //user Routes
    app.route('/user/:id')
        .get(user.getAllUserDatas);

    // app.post('/user/edit',upload.single('image'),user.editUserData);
    app.route('/user/edit')
        .post(upload.fields([{name : 'user_img'}, {name: 'back_img'}]),
            user.editUserData);

    app.route('/user/:id')
        .get()
        .put()
        .delete();

    app.route('/register')
        .post(user.createUser);

    app.route('/register/:email')
        .post(user.checkEmailValidation);

    app.route('/login')
        .post(user.checkLogin);

    app.route('/login/verify')
        .post(user.verifyEmail);

    app.route('/user/fcm')
        .post(user.updateFCMToken);

    app.route('/user/fcm/:id')
        .delete(user.deleteFCMToken);


    /** chat */
    const chat = require('../controllers/chatController');
    app.route('/chat')
        .post(upload.fields([{name : 'chat_image_1'}, {name: 'chat_image_2'}]),
            chat.makeHistory);

    app.route('/chat/:id')
        .get(chat.getChatHistory);

    app.route('/chat/list/:id')
        .get(chat.getChatRoomList);

    app.route('/chat/room/make')
        .post(chat.makeChatRoom);


    /** community */
    const comm = require('../controllers/communityController');
    // comm Routes
    app.route('/comm')
        .get(comm.list_all_comms);
    app.route('/write')
        .get(function (req,res) {
            console.log("write get");
        })
        .post(comm.create_a_comm); //middleware 를 controller 에 넣어버림 (보기 좋다)

    app.route('/comm/:commId')
        .get(comm.read_a_comm)
        .put(comm.update_a_comm)
        .delete(comm.delete_a_comm);
};

/**
 app.use('/', indexRouter);
 app.use('/users', usersRouter);
 app.use('/talk', talkRouter);
 app.use('/feed', feedRouter);
 app.use('/tv', tvRouter);
 app.use('/facetime', facetimeRouter);
 // app.use('/comm', commRouter);
 app.use('/music', musicRouter);
 * */