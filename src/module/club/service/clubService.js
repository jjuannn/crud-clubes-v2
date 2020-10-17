const { Equipo } = require("../entities/club.js")

module.exports = class ClubService{
    /**
     * 
     * @param {import("../repository/abstractRepository")} clubRepository 
     */
    constructor(clubRepository){
        this.clubRepository = clubRepository
    }

    /**
     * 
     * @param {Number} id 
     */
    async getById(id){
        if(id === undefined){
            throw new Error("Se necesita un ID para obtener un equipo")
        }
        
        return this.clubRepository.getById(id)
    }

    /**
     * 
     * @param {Equipo} newTeam 
     */
    async saveNewTeam(newTeam){
        if(!(newTeam instanceof Equipo)){
            throw new Error("No se pudo agregar el equipo (team-is-not-mapped)")
        }
        
        return this.clubRepository.saveNewTeam(newTeam)
    }

    /**
     * 
     * @param {Equipo} editedTeam 
     */
    async saveEditedTeam(editedTeam){
        if(!(editedTeam instanceof Equipo)){
            throw new Error("No se pudo guardar la edicion del equipo (team-is-not-mapped)")
        }

        return this.clubRepository.saveEditedTeam(editedTeam)  
    }

    /**
     * 
     * @param {String} id 
     */
    async delete(id){
        if(typeof id !== "string"){
            throw new Error("No se pudo borrar el equipo. El ID tiene que ser un string")
        }

        return this.clubRepository.delete(id) 
    }
    /**
     * /**
     * @returns {Promise<Array<import("../../entities/club.js")>>}
     */
    async getAll(){
        return this.clubRepository.getAll()    
    }
    
}

