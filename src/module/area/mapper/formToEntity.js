const { Area } = require("../entities/area")

function formToEntity(area){
    const {
        nombre,
        id
    } = area

    return new Area(
        nombre,
        Number(id)
    )

}
module.exports = { formToEntity }