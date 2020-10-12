require("dotenv").config()
const express = require("express")
const app = express()

const configureDI = require("./config/di.js")

app.use(express.static("src"))
app.use(express.static(__dirname + "/uploads"))
app.use(express.static(__dirname + '/styles'))


const expHandlebars = require ("express-handlebars")
const hbs = expHandlebars.create()

app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")

const container = configureDI.configureContainer()
const clubController = container.get("ClubController")

app.get("/", clubController.index.bind(clubController))

const PUERTO = 3030
app.listen(process.env.PUERTO || PUERTO, console.log(`listening at port ${PUERTO}`))