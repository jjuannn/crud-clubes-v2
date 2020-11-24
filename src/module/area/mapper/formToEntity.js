const { Area } = require("../entities/area")

function formToEntity(area){
    const {
        nombre,
        id
    } = area

    return new Area({
        id: Number(id), 
        nombre 
    })

}
module.exports = { formToEntity }