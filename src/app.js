require("dotenv").config({path: "../.env"})
const express = require("express")
const app = express()
const path = require("path")

const configureDI = require("./config/di.js")
const { initClubModule } = require("./module/module.js")
app.use(express.static("src"))
app.use(express.static(__dirname + "/uploads"))
app.use(express.static(__dirname + '/styles'))

const viewsPath = path.join(__dirname, "/module/club/views")

const expHandlebars = require ("express-handlebars")
const hbs = expHandlebars.create()

app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")
app.set("views", viewsPath)


const container = configureDI.configureContainer()

initClubModule(app, container)

const clubController = container.get("ClubController")
app.get("/", clubController.index.bind(clubController))

const PUERTO = 3030
app.listen(process.env.PUERTO || PUERTO, console.log(`listening at port ${PUERTO}`))