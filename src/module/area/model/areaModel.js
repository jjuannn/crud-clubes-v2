const { Model, DataTypes, Sequelize } = require("sequelize")

module.exports = class AreaModel extends Model{
    /**
    * @param {import('sequelize').Sequelize} sequelizeInstance
    * @returns {typeof AreaModel}
    */
   static setup(sequelizeInstance){
       AreaModel.init({
           id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                unique: true,
                primaryKey: true
           }, 
           nombre: {
                type: DataTypes.STRING
               },
          createdAt: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.NOW
               },
          updatedAt: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.NOW
          }
        }, 
        {
          sequelize: sequelizeInstance,
          modelName: "Area",
          timestamps: false
       })
        return AreaModel
    }
}