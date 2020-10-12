module.exports = class clubService{
    /**
     * 
     * @param {import("../repository/abstractRepository")} clubRepository 
     */
    constructor(clubRepository){
        this.clubRepository = clubRepository
    }

    async getById(id){
        if(id === undefined){
            throw new Error("Se necesita un ID para obtener un equipo")
        }
        
        return this.clubRepository.getById(id)
    }


    async saveNewTeam(newTeam){
        if(newTeam === undefined){
            throw new Error("No se pudo agregar el equipo")
        }
        
        return this.clubRepository.saveNewTeam(newTeam)
    }

    async saveEditedTeam(editedTeam){
        if(editedTeam === undefined){
            throw new Error("No se pudo guardar la edicion del equipo")
        }

        return this.clubRepository.saveEditedTeam(editedTeam)  
    }

    async delete(id){
        if(id === undefined){
            throw new Error("Se necesita un ID para borrar un equipo")
        }

        return this.clubRepository.delete(id)  
    }

    async getAll(){
        return this.clubRepository.getAll()
    }
    
}

