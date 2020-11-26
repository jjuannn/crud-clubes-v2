const { Equipo } = require("../../entities/club")
const ClubController = require("../clubController.js")
const { formToEntity } = require("../../mapper/formToEntity")
const UndefinedIdError = require("../errors/undefinedError.js")
const area = require("../../../area/entities/area")

const service = {
    getById: jest.fn( () => Promise.resolve({})),
    getAll: jest.fn( () => Promise.resolve([])),
    delete: jest.fn( () => Promise.resolve({})),
    saveEditedTeam: jest.fn(),
    saveNewTeam: jest.fn()
}

const areaService = {
    getById: jest.fn( () => Promise.resolve({})),
    getAll: jest.fn( () => Promise.resolve([])),
    delete: jest.fn( () => Promise.resolve({})),
    saveEditedArea: jest.fn(),
    saveNewArea: jest.fn()
}
const controller = new ClubController({}, {}, service, areaService)

const exampleBodyMock = {
    nombre: 'Arsenal FC',
    abreviatura: 'ARS',
    estadio: 'Emirates Stadium',
    direccion: '75 Drayton Park London N5 1BU',
    anoFundacion: '1889',
    telefono: '+44 (01273) 878288',
    website: 'http://www.arsenal.com',
    area_id: '37',
    fotoEscudo: "/uploads/test123"
}


test("renderHomePage se ejecuta correctamente", async () => {
    const renderMock = jest.fn()

    await controller.renderHomePage({}, {render: renderMock})

    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("home", {"layout": "layout"})

})

test("index se ejecuta habiendo equipos en la lista", async() => {
    const teamsResponse = []
    const renderMock = jest.fn()

    await controller.index({session: {errors: [], messages: []}}, {render: renderMock} )

    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("main", { layout: "layout", data:{ teamsResponse, errors: [], messages: [] }})
})
test("index renderea la pagina empty-list si es que no hay equipos", async() => {
    const teamsResponse = false
    service.getAll.mockImplementationOnce(() => {
        return false
    })
    const renderMock = jest.fn()
    const req = {session: {errors: [], messages: []}}
    const errors = req.session.errors
    const messages = req.session.messages
    await controller.index(req, {render: renderMock})
    
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("empty-team-list", { layout: "layout", data:{ teamsResponse, errors, messages } })
})
test("renderAddPage se ejecuta correctamente si hay equipos", async () => {
    const renderMock = jest.fn()
    const isTeam = true
    const areas = [{}, {}]

    areaService.getAll.mockImplementationOnce(() => Promise.resolve(areas))

    await controller.renderAddPage({}, {render: renderMock})

    expect(areaService.getAll).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("add", { layout: "layout", data:{ isTeam, areas} })
})
test("renderAddPage muestra otra error si no hay areas", async() => {
    const redirectMock = jest.fn()
    const isTeam = true
    const areas = []
    const req = {session: {errors: []}}
    areaService.getAll.mockImplementationOnce(() => Promise.resolve(areas))

    await controller.renderAddPage(req, {redirect: redirectMock})

    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/club")
    expect(req.session.errors).not.toEqual([])
})

test("renderEditPage se ejecuta correctamente", async() => {
    const renderMock = jest.fn()
    const team = {id: 1}
    const req = { query: { id: 1}}
    const areas = [{}, {}]

    service.getById.mockImplementationOnce( () => Promise.resolve(team))
    areaService.getAll.mockImplementationOnce(() => Promise.resolve(areas))

    await controller.renderEditPage(req , {render: renderMock})

    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(service.getById).toHaveBeenCalledWith(1)
    expect(renderMock).toHaveBeenCalledWith("edit", { layout: "layout", data:{ team, areas } })
})
test("renderEditPage falla al renderear el form para editar un equipo sin un ID ", async() => {
    const renderMock = jest.fn()
    try{
        await controller.renderEditPage({session: {errors: [], messages: []}, query: {}}, {render: renderMock})
    } catch (e){
        expect(e).toBeInstanceOf(UndefinedIdError)
    }
    expect(renderMock).toHaveBeenCalledTimes(0)

})
test("view se ejecuta correctamente", async() => {
    const team = {id: 1}
    const renderMock = jest.fn()

    service.getById.mockImplementationOnce( () => Promise.resolve(team))

    await controller.view({ query: { id: 1}} , {render: renderMock})

    expect(service.getById).toHaveBeenCalledWith(1)
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("view", { layout: "layout", data:{ team } })
})
test("view falla al intentar cargar un equipo sin un ID", async() => {
    const renderMock = jest.fn()
    try{       
        await controller.view({query: {}}, {render: renderMock})
    } catch(e){
        expect(e).toBeInstanceOf(UndefinedIdError)
    }

    expect(renderMock).toHaveBeenCalledTimes(0)
    
})
test("delete falla al intentar borrar un equipo sin un ID", async() => {
    const renderMock = jest.fn()
    try{
        await controller.delete({query: {}}, {render: renderMock})
    } catch(e){
        expect(e).toBeInstanceOf(UndefinedIdError)
    }

    expect(renderMock).toHaveBeenCalledTimes(0)
})
test("saveEditedTeam se ejecuta correctamente", () => {
    const body = exampleBodyMock

    const bodyMock = formToEntity(body)
    const redirectMock = jest.fn()

    controller.saveEditedTeam({session: {messages: [], errors: []}, body: bodyMock, file: {filename: "test123"}}, {redirect: redirectMock})

    expect(service.saveEditedTeam).toHaveBeenCalledTimes(1)
    expect(service.saveEditedTeam).toHaveBeenCalledWith(bodyMock)
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/club")

})
test("saveNewTeam se ejecuta correctamente", async() => {
    const body = exampleBodyMock

    const bodyMock = formToEntity(body)
    const redirectMock = jest.fn()

    await controller.saveNewTeam({session: {messages: [], errors: []}, body: bodyMock, file: {filename: "test123"}}, {redirect: redirectMock})

    expect(service.saveNewTeam).toHaveBeenCalledTimes(1)
    expect(service.saveNewTeam).toHaveBeenCalledWith(bodyMock)
    expect(redirectMock).toHaveBeenCalledWith("/club")
    expect(redirectMock).toHaveBeenCalledTimes(1)
})

test("delete se ejecuta correctamente", async() => {
    const team = {id: 1}
    const redirectMock = jest.fn()

    service.delete.mockImplementationOnce( () => Promise.resolve(team))

    await controller.delete({query: {id: 1} , session: {messages: [], errors: []}}, {redirect: redirectMock})

    expect(service.delete).toHaveBeenCalledTimes(1)
    expect(service.delete).toHaveBeenCalledWith(1)
    expect(redirectMock).toHaveBeenCalledWith("/club")
})
test("renderEditPage setea un error y redirecciona correctamente", async() => {
    service.getById.mockImplementationOnce(() => {
        throw Error("ejemplo_error");
    })

    const redirectMock = jest.fn()
    const req = {query: {id: "1"} , session: {messages: [], errors: []}}
    await controller.renderEditPage(req, {redirect: redirectMock})

    expect(redirectMock).toHaveBeenCalledWith("/club")
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(req.session.errors).not.toEqual([])
})

test("saveNewTeam setea un error y redirecciona correctamente", async() => {
    service.saveNewTeam.mockImplementationOnce(() => {
        throw Error("ejemplo_error")
    })
    const bodyMock = formToEntity(exampleBodyMock)
    const redirectMock = jest.fn()
    const req = {session: {messages: [], errors: []}, body: bodyMock, file: {filename: "test123"}}

    await controller.saveNewTeam(req, {redirect: redirectMock})

    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/club")
    expect(req.session.errors).not.toEqual([])
})
test("saveEditedTeam setea un error y redirecciona correctamente", async() => {
    service.saveEditedTeam.mockImplementationOnce(() => {
        throw Error("ejemplo_error")
    })
    const bodyMock = formToEntity(exampleBodyMock)
    const redirectMock = jest.fn()
    const req = {session: {messages: [], errors: []}, body: bodyMock, file: {filename: "test123"}}

    await controller.saveEditedTeam(req, {redirect: redirectMock})

    expect(redirectMock).toHaveBeenCalledWith("/club")
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(req.session.errors).not.toEqual([])
})
test("view setea un error y redirecciona correctamente", async() => {
    service.getById.mockImplementationOnce(() => {
        throw Error("ejemplo_error")
    })
    const redirectMock = jest.fn()
    const req = {session: {messages: [], errors: []}, query: {id: "3"}}

    await controller.view(req, {redirect: redirectMock})

    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/club")
    expect(req.session.errors).not.toEqual([])
})
test("delete setea un error y redirecciona correctamente", async() => {
    service.delete.mockImplementationOnce(() => {
        throw Error("ejemplo_error")
    })

    const redirectMock = jest.fn()
    const req = {session: {messages: [], errors: []}, query: {id: "3"}}

    await controller.delete(req, {redirect: redirectMock})

    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/club")
    expect(req.session.errors).not.toEqual([])
})
