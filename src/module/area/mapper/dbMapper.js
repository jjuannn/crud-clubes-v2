const { Area } = require("../entities/area")

function fromModelToEntity(area){
    const {
        nombre,
        id
    } = area

    return new Area({
        id: Number(id),
        nombre
    })
}

module.exports = { fromModelToEntity }