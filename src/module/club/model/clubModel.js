const { Model, DataTypes, Sequelize } = require("sequelize")

module.exports = class ClubModel extends Model{
    /**
    * @param {import('sequelize').Sequelize} sequelizeInstance
    * @returns {typeof ClubModel}
    */
   static setup(sequelizeInstance){
       ClubModel.init({
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
          abreviatura: {
                type: DataTypes.STRING
               },
           estadio: {
                type: DataTypes.STRING
               }, 
          direccion: {
                type: DataTypes.STRING
               }, 
          anoFundacion: {
                type: DataTypes.STRING
               }, 
          telefono: {
                type: DataTypes.STRING
               }, 
          website: {
                type: DataTypes.STRING
               }, 
          fotoEscudo: {
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
          modelName: "Club",
          timestamps: false
       })
        return ClubModel
    }

    static setupAssociations(AreaModel){
        ClubModel.belongsTo(AreaModel, {foreignKey: "area_id"})
    }
}