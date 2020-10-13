const abstractController = require("./abstractController.js")

module.exports = class ClubController extends abstractController{
    /**
     * 
     * @param {import("../service/clubService.js")} clubService 
     */
    constructor(uploadMiddleware, clubService){
        super()
        this.ROUTE_BASE = "/club" 
        this.uploadMiddleware = uploadMiddleware
        this.clubService = clubService
    }

    /**
     * 
     * @param {import("express").Application} app 
     */
    configureRoutes(app){
        const ROUTE_BASE = this.ROUTE_BASE

        app.get(`${ROUTE_BASE}`, this.index.bind(this))
        app.get(`${ROUTE_BASE}ver-equipo?:id`, this.view.bind(this))
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


    async view(){
        const { id } = req.query.id

        const team = this.clubService.getById(id)

        res.render("view-team", {
            layout: "layout",
            data:{
                team
            }
        })

    }

}