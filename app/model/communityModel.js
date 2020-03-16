const sql = require('../../db_connection');

//Task object constructor
const Community = function (content) {
    this.title = content.title;
    this.content = content.content;
    this.author = content.author;
    this.date = new Date();
    this.views = content.views;
    this.likes = content.likes;
    this.image = content.image;
};
Community.createComms = function (newContent, result) {
    sql.query("INSERT INTO CommunityRow set ?", newContent, function (err, res) {

        if(err) {
            console.log("error: ", err);
            result(err, null); // result 가 function(err, content) 이다
        }
        else{
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
};
Community.getCommById = function (commId, result) {
    sql.query("Select * from CommunityRow where idx = ? ", commId, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log("success: ",res);
            result(null, res);

        }
    });
};
Community.getAllComms = function (result) {
    sql.query("Select * from CommunityRow", function (err, res) {

        if(err) {
            console.log("error getAllComms: ", err);
            result(null, err);
        }
        else{
            //console.log('Community getAllComms : ', res);

            result(null, res);
        }
    });
};
Community.getSomeofComms = function (index,length,search,result){
    let query;
    let value;
    if (search === undefined){
        query = "Select * from (Select * from CommunityRow limit ? offset ?) as some_data, (select count(*) as totalNum from CommunityRow) as totalNum";
        value = [length,index];
    }
    else {
        query = `select * from (select *  from CommunityRow where (title like '%${search}%')  limit ${length} offset ${index} ) as data, (select count(*) as totalNum from CommunityRow where (title like '%${search}%')) as tot`;
        value = [];
    }

  sql.query(query, value,function (err,res) {
        if (err){
            console.log("error getSomeofComms : ",err);
            result(null,err);
        }else {
            console.log("Community getSomeofComms: ",res);
            result(null,res);
        }
  });
};
Community.updateById = function(id, content, result){
    sql.query("UPDATE CommunityRow SET title = ? , content = ? WHERE idx = ?", [content.title,content.content, id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};
Community.remove = function(commId, result){
    sql.query("DELETE FROM CommunityRow WHERE idx = ?", [commId], function (err, res) {

        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{

            result(null, res);
        }
    });
};

module.exports= Community;