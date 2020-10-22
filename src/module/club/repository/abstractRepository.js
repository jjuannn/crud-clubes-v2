const AbstractRepositoryError = require("./errors/abstractRepositoryError.js")

class AbstractRepository{
    constructor(){
        if(new.target === AbstractRepository){
            throw new AbstractRepositoryError()
        }
    }

    /**
     * @param {import("../entities/club.js")} newTeam
     * @returns {import("../entities/club.js")}
     */
    async saveNewTeam(newTeam){}

    /**
     * @param {import("../entities/club.js")} editedTeam
     * @returns {import("../entities/club.js")}
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
     * @returns {import("../entities/club.js")}
     */
    async getById(id){}

    /**
     * @returns {Array<import("../entities/club.js")>}
     */
    async getAll(){}


}



module.exports = AbstractRepository

