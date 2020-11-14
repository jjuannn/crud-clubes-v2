const Equipo = require("../../entities/club.js")
const IdNotFoundError = require("../errors/idNotFoundError")
const UndefinedError = require("../errors/undefinedError")
const InvalidIdError = require("../errors/invalidIdError")
const AbstractClubRepository = require("../abstractRepository")
const { fromModelToEntity } = require("../../mapper/dbMapper")
const club = require("../../entities/club.js")

module.exports = class ClubRepository extends AbstractClubRepository{

    constructor(clubModel){
        super()
        this.clubModel = clubModel
    }
    /**
     * 
     * @param {Equipo} editedTeam 
     */
    async saveEditedTeam(editedTeam){
        if(!editedTeam){
            throw new UndefinedError("No se pudo editar el equipo ya que no hay uno")
        }
        const currentId = editedTeam.numeroId

        const newValues = {
            nombre: editedTeam.nombre,
            abreviatura: editedTeam.abreviatura,
            estadio: editedTeam.estadio,
            direccion: editedTeam.direccion,
            anoFundacion: editedTeam.anoFundacion,
            telefono: editedTeam.telefono,
            website: editedTeam.website,
            pais: editedTeam.pais,
        } = editedTeam
        if(editedTeam.fotoEscudo){
            newValues.fotoEscudo = editedTeam.fotoEscudo
        }
        const teamToSave = await this.clubModel.update(newValues, { where: {id : currentId}})

        return this.getById(currentId)
    }
    /**
     * 
     * @param {Equipo} newTeam 
     */
    async saveNewTeam(newTeam){
        if(!newTeam){
            throw new UndefinedError("No se pudo agregar el equipo ya que no hay uno")
        }
        let clubModel
        const buildOptions = { isNewRecord: true }
        clubModel = await this.clubModel.create(newTeam, buildOptions)

        return fromModelToEntity(clubModel)
    }
    /**
     * @param {Number} id
    */
    async getById(id){
        if(typeof id !== "number"){
            throw new InvalidIdError("El ID introducido no es valido repo")
        }
        const teamToFind = await this.clubModel.findByPk(id)

        return fromModelToEntity(teamToFind)
    }

    /**
     * @param {Number} id
    */
    async delete(id){
        if(!id){
            throw new UndefinedError("Necesitas introducir un ID para borrar un equipo")
        }
        const teamToDelete = await this.clubModel.findByPk(id)
        await teamToDelete.destroy()

        return true
    }
    /**
     * @returns {Promise<Array<import("../../entities/club.js")>>}
     */
    async getAll(){
        const teams = await this.clubModel.findAll()

        if(teams.length === 0){
            return false
        } else {
            return teams.map(team => fromModelToEntity(team))
        }   
    }
    
}