const { Area } = require("../entities/area.js")
const NotMappedError = require("./errors/notMappedError")
const InvalidIdError = require("./errors/invalidIdError")


module.exports = class AreaService{
    /**
     * 
     * @param {import("../repository/abstractRepository")} areaRepository 
     */
    constructor(areaRepository){
        this.areaRepository = areaRepository
    }

    /**
     * 
     * @param {Number} id 
     */
    async getById(id){
        if(id === undefined || typeof id !== "number"){
            throw new InvalidIdError("El ID introducido no es valido")
        }
        
        return this.areaRepository.getById(id)
    }

    /**
     * 
     * @param {Equipo} newArea 
     */
    async saveNewArea(newArea){
        if(!(newArea instanceof Area)){
            throw new NotMappedError("area-not-mapped")
        }
        return this.areaRepository.saveNewArea(newArea)
    }

    /**
     * 
     * @param {Equipo} editedArea 
     */
    async saveEditedArea(editedArea){
        if(!(editedArea instanceof Area)){
            throw new NotMappedError("area-not-mapped")
        }
        return this.areaRepository.saveEditedArea(editedArea)  
    }

    /**
     * 
     * @param {String} id 
     */
    async delete(id){
        if(id === undefined || typeof id !== "number"){
            throw new InvalidIdError("El ID introducido no es valido")
        }
        
        return this.areaRepository.delete(id) 
    }
    /**
     * /**
     * @returns {Promise<Array<import("../../entities/area.js")>>}
     */
    async getAll(){
        return this.areaRepository.getAll()    
    }
    
}

