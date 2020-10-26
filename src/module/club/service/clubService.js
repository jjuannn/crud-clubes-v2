const { Equipo } = require("../entities/club.js")
const NotMappedError = require("./errors/notMappedError")
const InvalidIdError = require("./errors/invalidIdError")


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
        if(id === undefined || typeof id !== "string"){
            throw new InvalidIdError("El ID introducido no es valido")
        }
        
        return this.clubRepository.getById(id)
    }

    /**
     * 
     * @param {Equipo} newTeam 
     */
    async saveNewTeam(newTeam){
        if(!(newTeam instanceof Equipo)){
            throw new NotMappedError("team-not-mapped")
        }
        
        return this.clubRepository.saveNewTeam(newTeam)
    }

    /**
     * 
     * @param {Equipo} editedTeam 
     */
    async saveEditedTeam(editedTeam){
        if(!(editedTeam instanceof Equipo)){
            throw new NotMappedError("team-not-mapped")
        }

        return this.clubRepository.saveEditedTeam(editedTeam)  
    }

    /**
     * 
     * @param {String} id 
     */
    async delete(id){
        if(id === undefined || typeof id !== "string"){
            throw new InvalidIdError("El ID introducido no es valido")
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

