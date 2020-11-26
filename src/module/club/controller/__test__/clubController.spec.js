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

const exampleBody = {
    nombre: 'Arsenal',
    abreviatura: 'ARS',
    estadio: 'Emirates Stadium',
    direccion: '75 Drayton Park London N5 1BU',
    anoFundacion: '1889',
    id: '41',
    telefono: '+44 (020) 76195003',
    website: 'http://www.arsenal.com',
    area_id: '38'
} // ESTO NECESITA PASAR POR EL MAPPER

test("renderAddPage se ejecuta correctamente para agregar un equipo", async() => {
    const areas = [{},{}]
    const isTeam = true
    const renderMock = jest.fn()
    
    areaService.getAll.mockImplementationOnce(() => Promise.resolve(areas))

    await controller.renderAddPage({}, {render: renderMock})

    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("add", { layout: "layout", data:{ isTeam, areas} })
})
test("renderAddPage redirecciona si no hay areas creadas", async() => {
    const areas = []
    const isTeam = true
    const redirectMock = jest.fn()
    const req = {session: {errors: []}}

    areaService.getAll.mockImplementationOnce(() => Promise.resolve(areas))

    await controller.renderAddPage(req, {redirect: redirectMock})

    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/club")
    expect(req.session.errors).not.toEqual([])
})
test("renderHomePage se ejecuta correctamente", async() => {
    const renderMock = jest.fn()

    await controller.renderHomePage({}, {render: renderMock})

    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("home", { layout: "layout" })
})
test("renderEditPage falla al no introducir un ID", async() => {
    const renderMock = jest.fn()
    try {
        await controller.renderEditPage({session: {errors: [], messages: []}, query: {}}, {render: renderMock})
    } catch (e) {
        expect(e).toBeInstanceOf(UndefinedIdError)
    }
    expect(renderMock).toHaveBeenCalledTimes(0)
})
test("renderEditPage se ejecuta correctamente", async() => {
    const team = {}
    const areas = [{}, {}] 
    const renderMock = jest.fn()

    service.getAll.mockImplementationOnce(() => Promise.resolve(team))
    areaService.getAll.mockImplementationOnce(() => Promise.resolve(areas))

    await controller.renderEditPage({query: {id: 1}}, {render: renderMock})

    expect(service.getById).toHaveBeenCalledWith(1)
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("edit", { layout: "layout", data:{ team, areas } })
})
test("renderEditPage falla debido a un error en las funciones que llama", async() => {
    const team = {}
    const areas = [{}, {}]
    const redirectMock =  jest.fn()
    const req = {query: {id: 1}, session: { errors: []} }

    service.getById.mockImplementationOnce(() => Promise.resolve(new Error("failed_op")))
    areaService.getAll.mockImplementationOnce(() => Promise.resolve(areas))

    await controller.renderEditPage(req, {redirect: redirectMock})

    expect(req.session.errors).not.toEqual([])
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/club")
})

test("saveEditedTeam se ejecuta y redirecciona correctamente", async() => {
    const req = {body: { exampleBody}, session: {messages: [], errors: []}, file: {filename: "test"}}
    const redirectMock = jest.fn()

    await controller.saveEditedTeam(req, {redirect: redirectMock})

    expect(service.saveEditedTeam).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/club")
})
test("saveEditedTeam falla por las funciones que llama", async() => {
    const req = {body: { exampleBody}, session: {messages: [], errors: []}, file: {filename: "test"}}
    const redirectMock = jest.fn()

    service.saveEditedTeam.mockImplementationOnce(() => {
        throw Error("ejemplo_error")
    })

    await controller.saveEditedTeam(req, {redirect: redirectMock})

    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/club")
    expect(req.session.errors).not.toEqual([])
})
test("saveNewTeam se ejecuta correctamente", async() => {
    const req = {body: { exampleBody}, session: {messages: [], errors: []}, file: {filename: "test"}}
    const redirectMock = jest.fn()

    await controller.saveNewTeam(req, {redirect: redirectMock})
    
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/club")
    expect(req.session.messages).not.toEqual([])
})
test("saveNewTeam redirige a /club al fallar", async() => {
    const req = {body: { exampleBody}, session: {messages: [], errors: []}, file: {filename: "test"}}
    const redirectMock = jest.fn()

    service.saveNewTeam.mockImplementationOnce(() => {
        throw Error("ejemplo_error")
    })

    await controller.saveNewTeam(req, {redirect: redirectMock})

    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/club")
    expect(req.session.errors).not.toEqual([])
})
// TESTEAR INDEX CORRECTAMENTE 
// TESTEAR INDEX CORRECTAMENTE 
// TESTEAR INDEX CORRECTAMENTE 
// TESTEAR INDEX CORRECTAMENTE 
// TESTEAR INDEX CORRECTAMENTE 
// TESTEAR INDEX CORRECTAMENTE 
// TESTEAR INDEX CORRECTAMENTE 

test("view falla al no introducir un id", async() => {
    const req = {query: {}}
    try {
        await controller.view(req, {})
    } catch (e) {
        expect(e).toBeInstanceOf(UndefinedIdError)
    }
})
test("view llama a las funciones correctas", async() => {
    const req = {query: {id : 1}}
    const team = {id: 1}
    const renderMock = jest.fn()
    service.getById.mockImplementationOnce(() => Promise.resolve(team))

    await controller.view(req, {render: renderMock})

    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("view", { layout: "layout", data:{ team } })
})
test("view redirige a /club al fallar", async() => {
    const req = {query: {id : 1 }, session: { messages: [], errors: []}}
    const redirectMock = jest.fn()

    service.getById.mockImplementationOnce(() => {
        throw new Error("failed_op")
    })

    await controller.view(req, {redirect: redirectMock})
    expect(req.session.errors).not.toEqual([])
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/club")
})
test("delete falla al no introducir un ID", async() => {
    const req = {query: {}}
    try {
        await controller.delete(req, {})
    } catch (e) {
        expect(e).toBeInstanceOf(UndefinedIdError)
    }
})
test("delete llama a las funciones correctas", async() => {
    const req = {query: {id: 1}, session: {messages: [], errors: []}}
    const redirectMock = jest.fn()

    await controller.delete(req, {redirect: redirectMock})

    expect(req.session.messages).not.toEqual([])
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/club")
})
test("delete falla y setea un error", async() => {
    const req = {query: {id: 1}, session: {messages: [], errors: []}}
    const redirectMock = jest.fn()
    
    service.delete.mockImplementationOnce(() => {
        throw new Error("failed_op")
    })

    await controller.delete(req, {redirect: redirectMock})

    expect(req.session.errors).not.toEqual([])
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/club")
})
