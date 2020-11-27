const AreaController = require("../areaController")
const { formToEntity } = require("../../mapper/formToEntity")
const UndefinedIdError = require("../errors/undefinedError.js")
const { Area } = require("../../entities/area")

const service = {
    getById: jest.fn( () => Promise.resolve({})),
    getAll: jest.fn( () => Promise.resolve([])),
    delete: jest.fn( () => Promise.resolve({})),
    saveEditedArea: jest.fn(),
    saveNewArea: jest.fn()
}

const controller = new AreaController({}, service)

const exampleBody = {
    nombre: 'Arsenal',
    id: NaN
} // PASA POR UN MAPPER EN CADA FUNCION

test("renderAddPage se ejecuta correctamente para agregar un equipo", async() => {
    const isArea = true
    const renderMock = jest.fn()
    
    await controller.renderAddPage({}, {render: renderMock})

    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("add", { layout: "layout", data:{ isArea } })
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
    const area = [{}, {}] 
    const renderMock = jest.fn()

    service.getById.mockImplementationOnce(() => Promise.resolve(area))

    await controller.renderEditPage({query: {id: 1}}, {render: renderMock})

    expect(service.getById).toHaveBeenCalledWith(1)
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("edit", { layout: "layout", data:{ area } })
})
test("renderEditPage falla debido a un error en las funciones que llama", async() => {
    const redirectMock =  jest.fn()
    const req = {query: {id: 1}, session: { errors: []} }

    service.getById.mockImplementationOnce(() => Promise.resolve(new Error("failed_op")))

    await controller.renderEditPage(req, {redirect: redirectMock})

    expect(req.session.errors).not.toEqual([])
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/area")
})

test("saveEditedArea se ejecuta y redirecciona correctamente", async() => {
    const req = {body: { exampleBody }, session: {messages: [], errors: []}}
    const redirectMock = jest.fn()

    await controller.saveEditedArea(req, {redirect: redirectMock})

    expect(service.saveEditedArea).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/area")
})
test("saveEditedArea falla por las funciones que llama", async() => {
    const req = {body: { exampleBody }, session: {messages: [], errors: []}, file: {filename: "test"}}
    const redirectMock = jest.fn()

    service.saveEditedArea.mockImplementationOnce(() => {
        throw Error("ejemplo_error")
    })

    await controller.saveEditedArea(req, {redirect: redirectMock})

    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/area")
    expect(req.session.errors).not.toEqual([])
})
test("saveNewArea se ejecuta correctamente", async() => {
    const req = {body: { exampleBody}, session: {messages: [], errors: []}, file: {filename: "test"}}
    const redirectMock = jest.fn()

    await controller.saveNewArea(req, {redirect: redirectMock})
    
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/area")
    expect(req.session.messages).not.toEqual([])
})
test("saveNewArea redirige a /area al fallar", async() => {
    const req = {body: { exampleBody}, session: {messages: [], errors: []}, file: {filename: "test"}}
    const redirectMock = jest.fn()

    service.saveNewArea.mockImplementationOnce(() => {
        throw Error("ejemplo_error")
    })

    await controller.saveNewArea(req, {redirect: redirectMock})

    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/area")
    expect(req.session.errors).not.toEqual([])
})

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
    const area = {id: 1}
    const renderMock = jest.fn()
    service.getById.mockImplementationOnce(() => Promise.resolve(area))

    await controller.view(req, {render: renderMock})

    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("view", { layout: "layout", data:{ area } })
})
test("view redirige a /area al fallar", async() => {
    const req = {query: {id : 1 }, session: { messages: [], errors: []}}
    const redirectMock = jest.fn()

    service.getById.mockImplementationOnce(() => {
        throw new Error("failed_op")
    })

    await controller.view(req, {redirect: redirectMock})
    expect(req.session.errors).not.toEqual([])
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/area")
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
    expect(redirectMock).toHaveBeenCalledWith("/area")
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
    expect(redirectMock).toHaveBeenCalledWith("/area")
})
test("index muestra otra vista si la lista de areas esta vacia", async() => {
    const req = {session: {messages: [], errors: []}}
    const areaResponse = false
    const renderMock = jest.fn()
    const { errors, messages } = req.session

    service.getAll = jest.fn().mockImplementationOnce(() => Promise.resolve(false))

    await controller.index(req, {render: renderMock})
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("empty-area-list", { layout: "layout", data:{ areaResponse, errors, messages } })
    expect(req.session.errors).toEqual([])
    expect(req.session.messages).toEqual([])
})
test("index muestra correctamente la lista de areas", async() => {
    const req = {session: {messages: [], errors: []}}
    const areaResponse = [{}, {}, {}]
    const renderMock = jest.fn()
    const { errors, messages } = req.session
    
    service.getAll = jest.fn().mockImplementationOnce(() => Promise.resolve([{}, {}, {}]))

    await controller.index(req, {render: renderMock})
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("main", { layout: "layout", data:{ areaResponse, errors, messages } })
    expect(req.session.errors).toEqual([])
    expect(req.session.messages).toEqual([])
})

