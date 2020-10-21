const AbstractRepository = require("../../repository/abstractRepository.js")
const AbstractController = require("../abstractController.js")
const abstractController = require("../abstractController.js")
const abstractControllerError = require("../abstractControllerError.js")

test("falla al crear una instancia de abstractController", () => {
    let controller 
    try {
        controller = new AbstractController()
    } catch (e) {
        expect(e).toBeInstanceOf(abstractControllerError)
    }
})

test("crea una instancia correctamente", () => {
    const ClubController = class clubController extends abstractController {}

    expect(new ClubController()).toBeInstanceOf(abstractController)
})

