const { Equipo } = require("../entities/club")
const { Area } = require("../../area/entities/area")

function formToEntity(team){
    const {
        nombre,
        abreviatura,
        estadio,
        direccion,
        anoFundacion,
        id,
        telefono,
        website,
        fotoEscudo,
        area_id
    } = team

    return new Equipo({
        nombre,
        abreviatura,
        estadio,
        direccion,
        anoFundacion: String(anoFundacion),
        id: Number(id),
        telefono,
        website,
        area_id: Number(area_id),
        fotoEscudo
    })

}
module.exports = { formToEntity }