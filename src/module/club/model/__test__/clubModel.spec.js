const AreaModel = require("../../../area/model/areaModel")
const ClubModel = require("../clubModel")
const Sequelize = require("sequelize")

const sequelizeInstance = new Sequelize("sqlite::memory")

test("la tabla se crea luego de hacer el setup", async() => {
    ClubModel.setup(sequelizeInstance)
    AreaModel.setup(sequelizeInstance)
    ClubModel.setupAssociations(AreaModel)
    await ClubModel.sync({force: true})
    expect(await ClubModel.findAll()).toEqual([])
    expect(await ClubModel.getTableName()).toEqual("Clubs")
})