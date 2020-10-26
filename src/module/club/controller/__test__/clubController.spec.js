const { Equipo } = require("../../entities/club")
const ClubController = require("../clubController.js")
const { formToEntity } = require("../../mapper/formToEntity")
const UndefinedIdError = require("../errors/undefinedError.js")

const service = {
    getById: jest.fn( () => Promise.resolve({})),
    getAll: jest.fn( () => Promise.resolve([])),
    delete: jest.fn( () => Promise.resolve({})),
    saveEditedTeam: jest.fn(),
    saveNewTeam: jest.fn()
}

const controller = new ClubController({}, {}, service)

test("renderHomePage se ejecuta correctamente", async () => {
    const renderMock = jest.fn()

    await controller.renderHomePage({}, {render: renderMock})

    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("home", {"layout": "layout"})

})

test("index se ejecuta correctamente", async() => {
    const teamList = []
    const renderMock = jest.fn()

    await controller.index({session: {errors: [], messages: []}}, {render: renderMock} )

    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("main", { layout: "layout", data:{ teamList, errors: [], messages: [] }})
})

test("renderAddPage se ejecuta correctamente", async () => {
    const renderMock = jest.fn()

    await controller.renderAddPage({}, {render: renderMock})

    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("add-team", { layout: "layout" })
})

test("renderEditPage se ejecuta correctamente", async() => {
    const renderMock = jest.fn()
    const equipo = {id: "1"}

    service.getById.mockImplementationOnce( () => Promise.resolve(equipo))

    await controller.renderEditPage({ query: { id: "1"}} , {render: renderMock})

    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(service.getById).toHaveBeenCalledWith("1")
    expect(renderMock).toHaveBeenCalledWith("edit-team", { layout: "layout", data:{ equipo } })
})
test("renderEditPage falla al renderear el form para editar un equipo sin un ID ", async() => {
    const renderMock = jest.fn()
    try{
        await controller.renderEditPage({query: {}}, {render: renderMock})
    } catch (e){
        expect(e).toBeInstanceOf(UndefinedIdError)
    }
    expect(renderMock).toHaveBeenCalledTimes(0)

})
test("view se ejecuta correctamente", async() => {
    const team = {id: "1"}
    const renderMock = jest.fn()

    service.getById.mockImplementationOnce( () => Promise.resolve(team))

    await controller.view({ query: { id: "1"}} , {render: renderMock})

    expect(service.getById).toHaveBeenCalledWith("1")
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("view-team", { layout: "layout", data:{ team } })
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
    expect.assertions(2)

    const body = {
    nombre: "Estudiantes",
    abreviatura: "ELP",
    estadio: "Jorge Luis Hirschi",
    direccion: "1 y 57",
    anoFundacion: 1905,
    numeroId: 7777,
    telefono: "123-456-789",
    website: "estudiantesdelaplata.com",
    pais: "Argentina",
    fotoEscudo: "/uploads/test123"
    }

    const bodyMock = formToEntity(body)
    const redirectMock = jest.fn()

    controller.saveEditedTeam({body: bodyMock, file: {filename: "test123"}}, {redirect: redirectMock})

    expect(service.saveEditedTeam).toHaveBeenCalledTimes(1)
    expect(service.saveEditedTeam).toHaveBeenCalledWith(bodyMock)
    // FALTA PROBAR redirectMock
})
test("saveNewTeam se ejecuta correctamente", () => {
    expect.assertions(2)
    const body = {
        nombre: "Estudiantes",
        abreviatura: "ELP",
        estadio: "Jorge Luis Hirschi",
        direccion: "1 y 57",
        anoFundacion: 1905,
        numeroId: 7777,
        telefono: "123-456-789",
        website: "estudiantesdelaplata.com",
        pais: "Argentina",
        fotoEscudo: "/uploads/test123"
    }

    const bodyMock = formToEntity(body)
    const redirectMock = jest.fn()

    controller.saveNewTeam({body: bodyMock, file: {filename: "test123"}}, {redirect: redirectMock})

    expect(service.saveNewTeam).toHaveBeenCalledTimes(1)
    expect(service.saveNewTeam).toHaveBeenCalledWith(bodyMock)
    // FALTA PROBAR redirectMock
})

test("delete se ejecuta correctamente", async() => {
    const team = {id: "1"}
    const redirectMock = jest.fn()

    service.delete.mockImplementationOnce( () => Promise.resolve(team))

    await controller.delete({query: {id: "1"} ,session: {messages: [], errors: []}}, {redirect: redirectMock})

    expect(service.delete).toHaveBeenCalledTimes(1)
    expect(service.delete).toHaveBeenCalledWith("1")
    expect(redirectMock).toHaveBeenCalledWith("/club")
})
