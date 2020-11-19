require("dotenv").config({path: "../.env"})
const express = require("express")
const app = express()
const path = require("path")

const configureDI = require("./config/di.js")
const { initClubModule } = require("./module/club/module.js")
const { initAreaModule } = require("./module/area/module.js")


app.use(express.static("src"))
app.use(express.static(__dirname + "/module/club"))
app.use(express.static(__dirname + '/styles'))

const viewsPath = path.join(__dirname, "/views")

const expHandlebars = require ("express-handlebars")
const hbs = expHandlebars.create()

app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")
app.set("views", viewsPath)

const container = configureDI.configureContainer()

const mainDb = container.get("Sequelize")
container.get("ClubModel")
container.get("AreaModel")

mainDb.sync()

app.use(container.get("session"))


initAreaModule(app, container)
initClubModule(app, container)

const clubController = container.get("ClubController")
app.get("/", clubController.renderHomePage.bind(clubController))

const PUERTO = 8080
app.listen(process.env.PUERTO || PUERTO, console.log(`listening at port ${PUERTO}`))