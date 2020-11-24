const { Equipo } = require("../entities/club")
const { Area } = require("../../area/entities/area") 

function fromModelToEntity(model){
    return new Equipo(model.toJSON())
}
module.exports = { fromModelToEntity, fromModelToEntity }