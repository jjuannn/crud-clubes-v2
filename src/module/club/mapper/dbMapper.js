const { Equipo } = require("../entities/club")

function fromModelToEntity(team){
    const {
        nombre,
        abreviatura,
        estadio,
        direccion,
        anoFundacion,
        telefono,
        website,
        pais,
        id,
        fotoEscudo
    } = team

    return new Equipo(
        nombre,
        abreviatura,
        estadio,
        direccion,
        String(anoFundacion),
        Number(id),
        telefono,
        website,
        pais,
        fotoEscudo
    )
}

module.exports = { fromModelToEntity }