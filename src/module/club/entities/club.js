class Equipo{
    constructor(nombre, abreviatura, estadio, direccion, anoFundacion, numeroId, telefono, website, pais, fotoEscudo){
        this.nombre = nombre
        this.abreviatura = abreviatura 
        this.estadio = estadio
        this.direccion = direccion
        this.anoFundacion = anoFundacion
        this.numeroId = numeroId
        this.telefono = telefono
        this.website = website
        this.pais = pais
        this.fotoEscudo = fotoEscudo
    }
}

module.exports = { Equipo }