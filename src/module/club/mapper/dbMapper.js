const { Equipo } = require("../entities/club")

function databaseMapper(team){
    const {
        nombre,
        abreviatura,
        estadio,
        direccion,
        ano_fundacion: anoFundacion,
        id: numeroId,
        telefono,
        website,
        pais,
        foto_escudo: fotoEscudo
    } = team

    return new Equipo(
        nombre,
        abreviatura,
        estadio,
        direccion,
        String(anoFundacion),
        String(numeroId),
        telefono,
        website,
        pais,
        fotoEscudo
    )
}

module.exports = { databaseMapper }