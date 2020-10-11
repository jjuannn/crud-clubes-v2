class AbstractRepository{
    constructor(){
        if(new.target === AbstractRepository){
            throw new Error("no puedes definir esto")
        }
    }

    /**
     * @param {import("../entities/club.js")} equipo
     * @returns {import("../entities/club.js")}
     */
    async save(equipo){}


    /**
     * @param {Number} id
     */
    async delete(id){}

    /**
     * 
     * @param {Number} id 
     */
    async getById(id){}

    /**
     * @returns {Array<import("../entities/club.js")>}
     */
    async getAll(){}


}



module.exports = AbstractRepository

