const Equipo = require("../../entities/area.js")
const IdNotFoundError = require("../errors/idNotFoundError")
const UndefinedError = require("../errors/undefinedError")
const InvalidIdError = require("../errors/invalidIdError")
const AbstractAreaRepository = require("../abstractRepository")
const { fromModelToEntity } = require("../../mapper/dbMapper")
const area = require("../../entities/area.js")

module.exports = class AreaRepository extends AbstractAreaRepository{

    constructor(areaModel){
        super()
        this.areaModel = areaModel
    }
    /**
     * 
     * @param {Equipo} editedArea 
     */
    async saveEditedArea(editedArea){
        if(!editedArea){
            throw new UndefinedError("No se pudo editar el area ya que no hay uno")
        }
        const currentId = editedArea.id

        const newValues = {
            nombre: editedArea.nombre
        } = editedArea
        
        const areaToSave = await this.areaModel.update(newValues, { where: {id : currentId}})

        return this.getById(currentId)
    }
    /**
     * 
     * @param {Equipo} newArea 
     */
    async saveNewArea(newArea){
        if(!newArea){
            throw new UndefinedError("No se pudo agregar el area ya que no hay uno")
        }
        let areaModel
        const buildOptions = { isNewRecord: true }
        areaModel = await this.areaModel.create(newArea, buildOptions)

        return fromModelToEntity(areaModel)
    }
    /**
     * @param {Number} id
    */
    async getById(id){
        if(typeof id !== "number"){
            throw new InvalidIdError("El ID introducido no es valido")
        }
        const teamToFind = await this.areaModel.findByPk(id)

        return fromModelToEntity(teamToFind)
    }

    /**
     * @param {Number} id
    */
    async delete(id){
        if(!id){
            throw new UndefinedError("Necesitas introducir un ID para borrar un area")
        }
        const teamToDelete = await this.areaModel.findByPk(id)
        await teamToDelete.destroy()

        return true
    }
    /**
     * @returns {Promise<Array<import("../../entities/area.js")>>}
     */
    async getAll(){
        const teams = await this.areaModel.findAll()
        if(teams.length === 0){
            return false
        } else {
            return teams.map(team => fromModelToEntity(team))
        }   
    }
}