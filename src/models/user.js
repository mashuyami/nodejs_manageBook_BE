'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // lien ket khoa ngoai
      // thang nao de khoa ngoai : belongto, foreignkey : ten khoa ngoai , targetkey : ten khoa chinh o bang role ,as : dat ten,ten dinh danh
      User.belongsTo(models.Role,{foreignKey:'role_code',targetKey:'code',as:'roleData'})
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar : DataTypes.STRING,
    //khoa ngoai : role_code vs bang role
    role_code :DataTypes.STRING,
    refresh_token : DataTypes.STRING
  
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};