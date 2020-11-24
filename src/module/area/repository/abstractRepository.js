const AbstractRepositoryError = require("./errors/abstractRepositoryError.js")

class AbstractRepository{
    constructor(){
        if(new.target === AbstractRepository){
            throw new AbstractRepositoryError()
        }
    }

    /**
     * @param {import("../entities/area.js")} newTeam
     * @returns {import("../entities/area.js")}
     */
    async saveNewTeam(newTeam){}

    /**
     * @param {import("../entities/area.js")} editedTeam
     * @returns {import("../entities/area.js")}
     */
    async saveEditedTeam(editedTeam){}

    /**
     * @param {Number} id
     * @returns {Boolean}
     */
    async delete(id){}

    /**
     * 
     * @param {Number} id 
     * @returns {import("../entities/area.js")}
     */
    async getById(id){}

    /**
     * @returns {Array<import("../entities/area.js")>}
     */
    async getAll(){}


}



module.exports = AbstractRepository

