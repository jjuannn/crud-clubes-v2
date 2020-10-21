const Club = require("../../entities/club.js")
const ClubController = require("../clubController.js")

const service = {
    getById: jest.fn( () => Promise.resolve({})),
    getAll: jest.fn( () => Promise.resolve([])),
    delete: jest.fn( () => Promise.resolve({})),
    saveEditedTeam: jest.fn(),
    saveNewTeam: jest.fn()
}

const controller = new ClubController({}, {}, service)

test("renderea la main page de la app", async () => {
    const renderMock = jest.fn()

    await controller.renderHomePage({}, {render: renderMock})

    expect(renderMock).toHaveBeenCalledTimes(1)

    expect(renderMock).toHaveBeenCalledWith("home", {"layout": "layout"})

})

test("renderea la pagina para agregar un equipo", async () => {
    const renderMock = jest.fn()

    await controller.renderAddPage({}, {render: renderMock})

    expect(renderMock).toHaveBeenCalledTimes(1)

    expect(renderMock).toHaveBeenCalledWith("add-team", { layout: "layout" })
})

test("renderea la pagina para editar un equipo", async() => {
    const renderMock = jest.fn()
    const fake_team = {id: "1"}

    service.getById.mockImplementationOnce( () => Promise.resolve(fake_team))

    await controller.renderEditPage({ query: { id: "1"}} , {render: renderMock})

    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(service.getById).toHaveBeenCalledWith("1")
})