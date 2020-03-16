var Comm = require('../model/communityModel');

/** community/comm (/comm)*/
exports.list_all_comms = function(req, res) {
    // console.log('req.useragent',req.useragent);
    // client가 모바일인지 웹브라우저인지 확인 가능한 npm 모듈 express-useragent : req.useragent.isMobile
    
    // if (! req.useragent.isMobile){
    //     // web
    //     Comm.getAllComms(function(err, content) {
    //         console.log('controller');
    //         if (err)
    //             res.send(err);
    //         console.log('res', content);
    //
    //         // community/comm.handlebars 파일의 {{contents}} 속에 들어갈 내용
    //         res.render('community/comm', {
    //             title: 'Community',
    //             contents : content
    //         });
    //         /** react로 보낼 response이므로 render하지 말고 JSON만 send해줘야 한다*/
    //     });
    //
    // }else
        {
        //mobile
        let page = isNaN(parseInt(req.query.page)) ? 1 : parseInt(req.query.page); //현재 페이지
        let length = isNaN(parseInt(req.query.length)) ? 10 : parseInt(req.query.length); // 페이지 내 게시물 수
        let index = (page-1)*length; // 현재 페이지의 첫번째 게시물 인덱스
        let search = req.query.search === undefined || req.query.search === "" ? undefined: req.query.search;

        console.log("list_all_comms : ",`page:${page}/index :${index}/length:${length}/search:${search}`);

        Comm.getSomeofComms(index,length,search,function(err,content) {
            if (err)
                res.send(err);
            if (content.length === 0)
                res.json("결과가 없습니다.");
            else
                res.send(content);
        })
    }

};


exports.create_a_comm = function(req, res) {
    console.log("write");
    var new_comm = new Comm(req.body);
    //handles null error
    console.log(`content : ${new_comm.content}/ title : ${new_comm.title}`);
    if(!new_comm.content || !new_comm.title || !new_comm.author){
        res.status(400).send({ error:true, message: 'Please provide content/title/author' });
    }
    else{
        Comm.createComms(new_comm, function(err, content) {
            if (err)
                res.send(err);
            res.json(content);
        });
    }
};

/** community/inner (/comm/:commId)*/
exports.read_a_comm = function(req, res) {
    // if( !req.useragent.isMobile){
    //     //web
    //     Comm.getCommById(req.params.commId, function(err, content) {
    //         if (err)
    //             res.send(err);
    //         content[0].content =
    //             content[0].content===null? "내용이 없습니다" : content[0].content;
    //         res.render('community/inner',{
    //             title : 'Inner',
    //             inner : content[0]
    //         });
    //     });
    // }else
        {
        //mobile
        Comm.getCommById(req.params.commId, function(err, content) {
            if (err)
                res.send(err);
            res.json(content);
        });
    }

};


exports.update_a_comm = function(req, res) {
    Comm.updateById(req.params.commId, new Comm(req.body), function(err, content) {
        if (err)
            res.send(err);
        res.json(content);
    });
};


exports.delete_a_comm = function(req, res) {
    Comm.remove( req.params.commId, function(err, content) {
        if (err)
            res.send(err);
        res.json({ message: 'Community successfully deleted' });
    });
};