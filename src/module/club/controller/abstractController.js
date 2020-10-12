module.exports = class AbstractController {
    constructor(){
        if(new.target === AbstractController){
            throw new Error("no puedes definir esto")
        }
    }
}

