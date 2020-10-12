class AbstractRepository{
    constructor(){
        if(new.target === AbstractRepository){
            throw new Error("no puedes definir esto")
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

