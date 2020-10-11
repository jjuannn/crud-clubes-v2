const uuid = require("uuidv4")
const fs = require("fs")
const { default: DIContainer, object, get, factory } = require("rsdi")
const ClubRepository = require("../module/club/repository/json/clubRepository.js")
const path = require("path")

/**
 * @returns {Function}
 */
function configureUUID(){
    return uuid
}

function configureJSON_DB(){
    process.env.JSON_DB_PATH = "./data/equipos.json"
    return process.env.JSON_DB_PATH
}

function addCommonDefinitions(container){
    container.addDefinitions({
        fs,
        uuid: factory(configureUUID),
        JSON_DB_PATH: factory(configureJSON_DB)
    })
}

function addClubModuleDefinitions(container){
    container.addDefinitions({
        ClubRepository: object(ClubRepository).construct(get("uuid"), get("fs"), get("JSON_DB_PATH"))
    })
}

function configureContainer(){
    const container = new DIContainer()
    addCommonDefinitions(container)
    addClubModuleDefinitions(container)
    return container
}


module.exports = { configureContainer }