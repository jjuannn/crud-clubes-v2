const AreaController = require("./controller/areaController")
const AreaService = require("./service/areaService")
const AreaRepository = require("./repository/sqlite/areaRepository")
const AreaModel = require("./model/areaModel")
/**
 * 
 * @param {import("express").Application} app 
 * @param {import("rsdi").IDIContainer} container 
 */
function initAreaModule(app, container){
    
    const controller = container.get("AreaController")
    controller.configureRoutes(app)
}

module.exports = {
    initAreaModule,
    AreaController,
    AreaService,
    AreaRepository,
    AreaModel
}