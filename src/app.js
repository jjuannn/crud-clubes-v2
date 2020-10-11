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

app.get("/", async (req, res) => {
    const container = configureDI.configureContainer()

    const ClubRepository = container.get('ClubRepository');
    const clubes = await ClubRepository.getAll();
    res.render("main", {
        layout: "layout",
        data:{
            clubes
        }
    })
})

const PUERTO = 3030
app.listen(process.env.PUERTO || PUERTO, console.log(`listening at port ${PUERTO}`))