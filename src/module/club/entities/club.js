class Equipo{
    constructor({nombre, abreviatura, estadio, direccion, anoFundacion, id, telefono, website, area_id, fotoEscudo, Area}){
        this.nombre = nombre
        this.abreviatura = abreviatura 
        this.estadio = estadio
        this.direccion = direccion
        this.anoFundacion = anoFundacion
        this.id = id
        this.telefono = telefono
        this.website = website
        this.area_id = area_id
        this.fotoEscudo = fotoEscudo
        this.Area = Area
    }
}

module.exports = { Equipo }