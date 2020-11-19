const { Area } = require("../entities/area")

function fromModelToEntity(area){
    const {
        nombre,
        id
    } = area

    return new Area(
        nombre,
        Number(id)
    )
}

module.exports = { fromModelToEntity }