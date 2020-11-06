const { default: DIContainer, object, get, factory } = require("rsdi")
const { ClubController, ClubService, ClubRepository} = require("../module/module");
const bodyParser = require("body-parser")
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const multer = require("multer")
const session = require("express-session")
const SQLiteDatabase = require("better-sqlite3")

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
function configureDatabase(){
    return new SQLiteDatabase(process.env.DB_PATH)
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
function addCommonDefinitions(container){
    container.addDefinitions({
        bodyParser: factory(configureBodyParser),
        mainDatabase: factory(configureDatabase),
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
        ClubRepository: object(ClubRepository).construct(get("mainDatabase"))
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