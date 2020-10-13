const uuid = require("uuidv4")
const fs = require("fs")
const { default: DIContainer, object, get, factory } = require("rsdi")
const { ClubController, ClubService, ClubRepository} = require("../module/module");


const multer = require("multer")
/**
 * @returns {Function}
 */
function configureUUID(){
    return uuid
}

function configureJSONDB(){
    return process.env.JSON_DB_PATH
}
function configureMulter(){

    const upload = multer({
        dest: './uploads/imagenes'
    })

    return multer({ upload})
}
/**
 * 
 * @param {DIContainer} container 
 */
function addCommonDefinitions(container){
    container.addDefinitions({
        fs,
        uuid: factory(configureUUID),
        JSON_DB_PATH: factory(configureJSONDB),
        multer: factory(configureMulter)
    })
}
/**
 * 
 * @param {DIContainer} container 
 */
function addClubModuleDefinitions(container){
    container.addDefinitions({
        ClubController: object(ClubController).construct(get("multer"), get("ClubService")),
        ClubService: object(ClubService).construct(get('ClubRepository')),
        ClubRepository: object(ClubRepository).construct(get("uuid"), get("fs"), get("JSON_DB_PATH"))
    })
}
/**
 * @returns {DIContainer}
 */
function configureContainer(){
    const container = new DIContainer()
    addCommonDefinitions(container)
    addClubModuleDefinitions(container)
    return container
}


module.exports = { configureContainer }