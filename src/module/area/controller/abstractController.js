const AbstractRepository = require("../repository/abstractRepository.js")
const AbstractControllerError = require("./errors/abstractControllerError.js")
module.exports = class AbstractController {
    constructor(){
        if(new.target === AbstractController){
            throw new AbstractControllerError()
        }
    }
}

