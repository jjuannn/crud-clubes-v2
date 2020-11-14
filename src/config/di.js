const { default: DIContainer, object, get, factory } = require("rsdi")
const { ClubController, ClubService, ClubRepository, ClubModel} = require("../module/module");
const bodyParser = require("body-parser")
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const multer = require("multer")
const session = require("express-session")
const { Sequelize } = require("sequelize")

function configureBodyParser(){
    return urlencodedParser
}
function configureSession(){
    const ONE_WEEK_IN_SECONDS = 604800000

    const sessionOptions = {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: ONE_WEEK_IN_SECONDS }
    }

    return session(sessionOptions)
}
function configureSequelizeDatabase(){
    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: process.env.DB_PATH
    })

    return sequelize
}
function configureMulter(){

    const upload = multer({
        dest: process.env.UPLOAD_MULTER_DIR
    })

    return upload
}
/**
 * 
 * @param {DIContainer} container 
 */
function configureClubModel(container){
    ClubModel.setup(container.get("Sequelize"))
    return ClubModel
}
/**
 * 
 * @param {DIContainer} container 
 */
function addCommonDefinitions(container){
    container.addDefinitions({
        bodyParser: factory(configureBodyParser),
        Sequelize: factory(configureSequelizeDatabase),
        multer: factory(configureMulter),
        session: factory(configureSession)
    })
}

/**
 * 
 * @param {DIContainer} container 
 */
function addClubModuleDefinitions(container){
    container.addDefinitions({
        ClubController: object(ClubController).construct(get("multer"), get("bodyParser"), get("ClubService")),
        ClubService: object(ClubService).construct(get('ClubRepository')),
        ClubRepository: object(ClubRepository).construct(get("ClubModel")),
        ClubModel: factory(configureClubModel)
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