'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserInfo = sequelize.define('UserInfo', {
    user_id: {
      type:DataTypes.STRING,
      allowNull:false
    },
    password: {
      type:DataTypes.STRING,
      allowNull:false
    },
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    message: DataTypes.STRING,
    profile_image: DataTypes.STRING,
    back_image: DataTypes.STRING,
    fcm_token: DataTypes.TEXT,
    ip: DataTypes.STRING,
    salt: DataTypes.STRING,
    secretToken : DataTypes.STRING,
    confirmed : {
      type : DataTypes.BOOLEAN,
      defaultValue : false
    }
  }, {});
  UserInfo.associate = function(models) {
    // associations can be defined here
  };
  return UserInfo;
};

/**
 * command로 model 만들기
 * ./node_modules/.bin/sequelize model:create  --name UserInfo --attributes "user_id:string, password:string, email:string, name:string, session:text, ip:string, salt:string"
 */