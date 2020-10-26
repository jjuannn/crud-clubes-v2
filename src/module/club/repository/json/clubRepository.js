const AbstractClubRepository = require("../abstractRepository")
const mapper = require("../../mapper/dbMapper.js")
const { mapearDB } = require("../../mapper/dbMapper.js");
const Equipo = require("../../entities/club.js")
const IdInUseError = require("../errors/idInUseError")
const IdNotFoundError = require("../errors/idNotFoundError")
const InvalidIdError = require("../errors/invalidIdError")

module.exports = class ClubRepository extends AbstractClubRepository{
    /**
     * @param {import("uuid")} uuid
     * @param {import("fileSystem")} fileSystem
     * @param {String} jsonDbPath
     */

     constructor(fileSystem, jsonDbPath){
        super()
        this.fileSystem = fileSystem;
        this.jsonDbPath = jsonDbPath
    }


    /**
     * 
     * @param {Number} id 
     */
    async getById(id){
        if(typeof id !== "string"){
            throw new InvalidIdError("El ID introducido no es valido")
        }
        const teamList = await this.getAll()
        
        const teamIndex = teamList.findIndex( team => team.numeroId === id )
        if(teamIndex === -1){
            throw new IdNotFoundError("No se encontro un equipo con el ID solicitado")
        }

        return mapearDB(teamList[teamIndex])
    }


    /**
     * 
     * @param {Equipo} newTeam 
     */
    async saveNewTeam(newTeam){
        const teamList = await this.getAll()
        
        const equalTeam = teamList.find( team => team.numeroId === newTeam.numeroId )

        if(!equalTeam){
            teamList.push(newTeam)
            this.writeDb(teamList)
        } else {
            throw new IdInUseError("El ID ingresado ya esta en uso")
        }
        
        return teamList
    }


    /**
     * 
     * @param {Equipo} editedTeam 
     */
    async saveEditedTeam(editedTeam){
        const teamList = await this.getAll()

        const teamIndex = teamList.findIndex( team => team.numeroId === editedTeam.numeroId )
        if(teamIndex === -1 ){
            throw new IdNotFoundError("No se encontro un equipo con el ID solicitado")
        }
        
        if(!editedTeam.fotoEscudo){
            editedTeam.fotoEscudo = teamList[teamIndex].fotoEscudo
        }

        teamList.splice(teamIndex, 1, editedTeam)

        this.writeDb(teamList)

        return teamList
    }

    /**
     * 
     * @param {String} id 
     */
    async delete(id){
        const teamList = await this.getAll()

        const teamIndex = teamList.findIndex( team => team.numeroId === id )
        if(teamIndex === -1){
            throw new IdNotFoundError("No se encontro un equipo con el ID solicitado")
        }

        teamList.splice(teamIndex, 1)
        
        return this.writeDb(teamList)
    }


    /**
     * @returns {Promise<Array<import("../../entities/club.js")>>}
     */
    async getAll(){
        return this.readData().map( team => mapper.mapearDB(team) )
    }
    

    /**
     * @param {Array<import("../../entities/club.js")}
     */
    readData(){
        return JSON.parse( this.fileSystem.readFileSync( this.jsonDbPath, "utf-8") )
    }


    /**
     * 
     * @param {Object} content 
     */
    writeDb(content){
        this.fileSystem.writeFileSync( this.jsonDbPath, JSON.stringify(content) )
    }

}
