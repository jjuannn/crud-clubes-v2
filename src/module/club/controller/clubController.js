const abstractController = require("./abstractController.js")
const formMapper = require("../mapper/formToEntity.js")
const UndefinedIdError = require("./errors/undefinedError.js")

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
        
        app.get(`${ROUTE_BASE}/view-team?:id`, this.view.bind(this))
        
        app.get(`${ROUTE_BASE}/edit-team?:id`, this.renderEditPage.bind(this))
        app.post(`${ROUTE_BASE}/edit-team?:id`, this.uploadMiddleware.single("fotoEscudo"), this.bodyParser, this.saveEditedTeam.bind(this))
        
        app.get(`${ROUTE_BASE}/add-team`, this.renderAddPage.bind(this))
        app.post(`${ROUTE_BASE}/add-team`, this.uploadMiddleware.single("fotoEscudo"), this.bodyParser, this.saveNewTeam.bind(this))
    
        app.get(`${ROUTE_BASE}/delete-team?:id`, this.delete.bind(this))
    }

    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */

    async renderAddPage(req, res){
        res.render("add-team", { layout: "layout" })
    }

    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async renderHomePage(req, res){
        res.render("home", { layout: "layout" })
    }

    /**
     * 
     * @param {import("express").Request} req 
     * @param {import("express").Response} res 
     */
    async renderEditPage(req, res){
        if(!req.query.id){
            throw new UndefinedIdError()
        }
        
        const equipo = await this.clubService.getById(req.query.id)
        res.render("edit-team", { layout: "layout", data:{ equipo } })

    }

    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req
     */
    async saveEditedTeam(req, res){
        const editedTeam = formMapper.formToEntity(req.body)
        if(req.file){editedTeam.fotoEscudo = `/uploads/${req.file.filename}`}

        this.clubService.saveEditedTeam(editedTeam)

        return res.redirect("/club")
    }

    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async saveNewTeam(req, res){
        const newTeam = formMapper.formToEntity(req.body)
        if(req.file){newTeam.fotoEscudo = `/uploads/${req.file.filename}`}
        
        this.clubService.saveNewTeam(newTeam)

        res.redirect("/club")
    }
    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req 
     */
    async index(req , res){

        const teamList = await this.clubService.getAll()

        res.render("main", { layout: "layout", data:{ teamList } })
    }

    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req 
     */
    async view(req, res){
        if(!req.query.id){
            throw new UndefinedIdError()
        }

        const team = await this.clubService.getById(req.query.id)

        res.render("view-team", { layout: "layout", data:{ team } })

    }
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async delete(req, res){
        if(!req.query.id){
            throw new UndefinedIdError()
        }

        this.clubService.delete(req.query.id)
    
        return res.redirect("/club")
    }


}