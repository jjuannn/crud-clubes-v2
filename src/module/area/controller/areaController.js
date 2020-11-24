const abstractController = require("./abstractController.js")
const formMapper = require("../mapper/formToEntity.js")
const UndefinedIdError = require("./errors/undefinedError.js")
const area = require("../entities/area.js")

module.exports = class AreaController extends abstractController{
    /**
     * 
     * @param {import("../service/areaService.js")} areaService 
     */
    constructor(bodyParser, areaService){
        super()
        this.ROUTE_BASE = "/area"
        this.bodyParser = bodyParser
        this.areaService = areaService
    }

    /**
     * 
     * @param {import("express").Application} app 
     */
    configureRoutes(app){
        const ROUTE_BASE = this.ROUTE_BASE

        app.get(`${ROUTE_BASE}`, this.index.bind(this))
        
        app.get(`${ROUTE_BASE}/view-area?:id`, this.view.bind(this))
        
        app.get(`${ROUTE_BASE}/edit-area?:id`, this.renderEditPage.bind(this))
        app.post(`${ROUTE_BASE}/edit-area?:id`, this.bodyParser, this.saveEditedArea.bind(this))
        
        app.get(`${ROUTE_BASE}/add-area`, this.renderAddPage.bind(this))
        app.post(`${ROUTE_BASE}/add-area`, this.bodyParser, this.saveNewArea.bind(this))
    
        app.get(`${ROUTE_BASE}/delete-area?:id`, this.delete.bind(this))
    }
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */

    async renderAddPage(req, res){
        const isArea = true
        res.render("add", { layout: "layout", data:{ isArea } })
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
        const id = Number(req.query.id)
        if(!req.query.id){throw new UndefinedIdError("Se debe introducir un ID para editar un equipo")}
        try{
            const area = await this.areaService.getById(id)
            res.render("edit", { layout: "layout", data:{ area } })
        }catch(e){
            req.session.errors = [e.message]
            res.redirect("/area")
        }
    }
    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req
     */
    async saveEditedArea(req, res){
        const editedArea = formMapper.formToEntity(req.body)

        try{
            this.areaService.saveEditedArea(editedArea)
            req.session.messages = [`El area con ID ${editedArea.id} se edito correctamente`]
            res.redirect("/area")
        }catch(e){
            req.session.errors = [e.message]
            res.redirect("/area")
        }
    }
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async saveNewArea(req, res){
        const newArea = formMapper.formToEntity(req.body)
        try{
            await this.areaService.saveNewArea(newArea)
            req.session.messages = [`El area con ID ${newArea.id} se agrego correctamente`]
            res.redirect("/area")
        }catch(e){
            req.session.errors = [e.message]
            res.redirect("/area")
        }
    }
    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req 
     */
    async index(req , res){
        const areaResponse = await this.areaService.getAll()
        const { errors, messages } = req.session;
        if(areaResponse === false){
            res.render("empty-area-list", { layout: "layout", data:{ areaResponse, errors, messages } })
        } else {
            res.render("main", { layout: "layout", data:{ areaResponse, errors, messages } })
        }
        req.session.errors = [];
        req.session.messages = [];
    }
    /**
     * 
     * @param {import("express").Response} res 
     * @param {import("express").Request} req 
     */
    async view(req, res){
        const id = Number(req.query.id)
        if(!req.query.id){throw new UndefinedIdError("Se debe introducir un ID para ver un equipo")}
        try {
            const area = await this.areaService.getById(id)
            res.render("view", { layout: "layout", data:{ area } })
        } catch (e) {
            req.session.errors = [e.message]
            res.redirect("/area")
        } 
    }
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async delete(req, res){
        if(!req.query.id){throw new UndefinedIdError("Se debe introducir un ID para borrar un equipo")}
        try{
            await this.areaService.delete(req.query.id)
            req.session.messages = [`El area con ID ${req.query.id} se borro correctamente`];
        }catch(e){
            req.session.errors = [e.message]
        }
        res.redirect("/area")
    }
}