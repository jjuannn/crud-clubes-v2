const ClubController = require("./controller/clubController")
const ClubService = require("./service/clubService")
const ClubRepository = require("./repository/sqlite/clubRepository")
const ClubModel = require("./model/clubModel")
/**
 * 
 * @param {import("express").Application} app 
 * @param {import("rsdi").IDIContainer} container 
 */
function initClubModule(app, container){
    
    const controller = container.get("ClubController")
    controller.configureRoutes(app)
}

module.exports = {
    initClubModule,
    ClubController,
    ClubService,
    ClubRepository,
    ClubModel
}