const abstractController = require("./abstractController.js")


module.exports = class ClubController extends abstractController{
    /**
     * 
     * @param {import("../service/clubService.js")} clubService 
     */
    constructor(uploadMiddleware, bodyParser, clubService){
        super()
        this.ROUTE_BASE = "/club" 
        this.uploadMiddleware = uploadMiddleware
        this.bodyParser = bodyParser
        this.clubService = clubService
    }

    /**
     * 
     * @param {import("express").Application} app 
     */
    configureRoutes(app){
        const ROUTE_BASE = this.ROUTE_BASE

        app.get(`${ROUTE_BASE}`, this.index.bind(this))
        app.get(`${ROUTE_BASE}/ver-equipo?:id`, this.view.bind(this))
        app.get(`${ROUTE_BASE}/editar-equipo?:id`, this.edit.bind(this))
        app.post(`${ROUTE_BASE}/editar-equipo?:id`, this.bodyParser , this.saveEditedTeam.bind(this))
    }
    
    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req
     */
    async saveEditedTeam(req, res){

        const editedTeam = req.body
        console.log(req.body)
        this.clubService.saveEditedTeam(editedTeam)

        return res.redirect("/")
    }

    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req 
     */
    async edit(req, res){
        const id = req.query.id

        const equipo = await this.clubService.getById(id)

        res.render("edit-team", {
            layout: "layout",
            data:{
                equipo
            }
        })
    }

    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req 
     */
    async index(req , res){
        const teamList = await this.clubService.getAll()

        res.render("main", {
            layout: "layout",
            data:{
                teamList
            }
        })
    }

    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req 
     */
    async view(req, res){
        const id = req.query.id

        const team = await this.clubService.getById(id)

        res.render("view-team", {
            layout: "layout",
            data:{
                team
            }
        })

    }



}