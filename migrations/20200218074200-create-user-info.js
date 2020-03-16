'use strict';
module.exports = {
  // up : 데이터베이스를 변경
  // ./node_modules/.bin/sequelize db:migrate 명령어 실행시
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserInfos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.STRING
      },
      profile_image: {
        type: Sequelize.STRING
      },
      back_image: {
        type: Sequelize.STRING
      },
      fcm_token: {
        type: Sequelize.TEXT
      },
      ip: {
        type: Sequelize.STRING
      },
      salt: {
        type: Sequelize.STRING
      },
      secretToken: {
        type: Sequelize.STRING
      },
      confirmed : {
        type : Sequelize.BOOLEAN,
        defaultValue : false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  // down : up 이 실행되기 전으로 데이터 베이스 복원
  // ./node_modules/.bin/sequelize db:migrate:undo 명령어 실행시
  // https://sequelize.readthedocs.io/en/latest/docs/migrations/
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserInfos');
  }
};