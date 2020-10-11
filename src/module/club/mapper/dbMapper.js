const di = require("../../../config/di")
const { Equipo } = require("../entities/club")

function mapearDB(equipo){
    const {
        nombre,
        abreviatura,
        estadio,
        direccion,
        anoFundacion,
        numeroId,
        telefono,
        website,
        pais,
        fotoEscudo
    } = equipo

    return new Equipo(
        nombre,
        abreviatura,
        estadio,
        direccion,
        anoFundacion,
        numeroId,
        telefono,
        website,
        pais,
        fotoEscudo
    )
}

module.exports = { mapearDB }