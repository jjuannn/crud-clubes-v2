const Equipo = require("../../entities/club.js")
const IdNotFoundError = require("../errors/idNotFoundError")
const UndefinedError = require("../errors/undefinedError")
const InvalidIdError = require("../errors/invalidIdError")
const AbstractClubRepository = require("../abstractRepository")
const { databaseMapper } = require("../../mapper/dbMapper")

module.exports = class ClubRepository extends AbstractClubRepository{

    constructor(databaseAdapter){
        super()
        this.databaseAdapter = databaseAdapter
    }
    /**
     * 
     * @param {Equipo} editedTeam 
     */
    async saveEditedTeam(editedTeam){
        const statements = this.databaseAdapter.prepare(`
        UPDATE clubes SET
        ${editedTeam.fotoEscudo ? `foto_escudo = ?,` : ""}
        nombre = ?,
        abreviatura = ?,
        estadio = ?,
        direccion = ?,
        ano_fundacion = ?,
        telefono = ?,
        website = ?,
        pais = ?
        WHERE id = ?
        `)

        const newData = [
            editedTeam.nombre,
            editedTeam.abreviatura,
            editedTeam.estadio,
            editedTeam.direccion,
            editedTeam.anoFundacion,
            editedTeam.telefono,
            editedTeam.website,
            editedTeam.pais,
            editedTeam.numeroId
        ]

        if(editedTeam.fotoEscudo){
            newData.unshift(editedTeam.fotoEscudo)
        }

        statements.run(newData);

        return this.getById(editedTeam.numeroId)
    }
    /**
     * 
     * @param {Equipo} newTeam 
     */
    async saveNewTeam(newTeam){
        const statements = this.databaseAdapter.prepare(`
        INSERT INTO clubes(
            nombre,
            abreviatura,
            estadio,
            direccion,
            ano_fundacion,
            telefono,
            website,
            pais,
            foto_escudo
        ) VALUES (?,?,?,?,?,?,?,?,?)
        `)

        const insertNewTeamValues = statements.run(
            newTeam.nombre,
            newTeam.abreviatura,
            newTeam.estadio,
            newTeam.direccion,
            newTeam.anoFundacion,
            newTeam.telefono,
            newTeam.website,
            newTeam.pais,
            newTeam.fotoEscudo
        )

        const id = String(insertNewTeamValues.lastInsertRowid)
        return this.getById(id)
    }
    /**
     * @param {Number} id
    */
    async getById(id){
        if(typeof id !== "string"){
            throw new InvalidIdError("El ID introducido no es valido")
        }

        const teamToFind = this.databaseAdapter.prepare(`
        SELECT 
        id,
        nombre,
        abreviatura,
        estadio,
        direccion,
        ano_fundacion,
        telefono,
        website,
        pais,
        foto_escudo 
        FROM clubes WHERE id = ?
        `).get(id)

        if(teamToFind === undefined){
            throw new IdNotFoundError("No se encontro un equipo con el ID solicitado")
        }

        return databaseMapper(teamToFind)
    }

    /**
     * @param {Number} id
    */
    async delete(id){
        if(!id){
            throw new UndefinedError("Necesitas introducir un ID para borrar un equipo")
        }
        const teamToDelete = this.databaseAdapter.prepare(`
        DELETE FROM clubes WHERE id = ?
        `).run(id)

        return true
    }
    /**
     * @returns {Promise<Array<import("../../entities/club.js")>>}
     */
    async getAll(){
        return this.readDatabase()
    }
    /**
     * @param {Array<import("../../entities/club.js")}
     */
    async readDatabase(){
        const results = this.databaseAdapter.prepare(`
        SELECT
            id,
            nombre,
            abreviatura,
            estadio,
            direccion,
            ano_fundacion,
            telefono,
            website,
            pais,
            foto_escudo
        FROM clubes
        `)
        .all()
        
        if(results.length === 0 ){
            return false
        }else {
            return results.map(team => databaseMapper(team))
        }
    }
}