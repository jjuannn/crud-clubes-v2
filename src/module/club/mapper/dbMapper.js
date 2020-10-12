const { Equipo } = require("../entities/club")

function mapearDB(team){
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
    } = team

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