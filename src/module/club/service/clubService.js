const Club = require("../entities/club.js")
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
     * @param {String} id 
     */
    async getById(id){
        if(id === undefined){
            throw new Error("Se necesita un ID para obtener un equipo")
        }
        
        return this.clubRepository.getById(id)
    }

    /**
     * 
     * @param {Club} newTeam 
     */
    async saveNewTeam(newTeam){
        if(newTeam === undefined){
            throw new Error("No se pudo agregar el equipo")
        }
        
        return this.clubRepository.saveNewTeam(newTeam)
    }

    /**
     * 
     * @param {Club} editedTeam 
     */
    async saveEditedTeam(editedTeam){
        if(editedTeam === undefined){
            throw new Error("No se pudo guardar la edicion del equipo")
        }

        return this.clubRepository.saveEditedTeam(editedTeam)  
    }

    /**
     * 
     * @param {String} id 
     */
    async delete(id){
        if(id === undefined){
            throw new Error("Se necesita un ID para borrar un equipo")
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

