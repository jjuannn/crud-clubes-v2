const AbstractController = require("../abstractController.js")
const abstractControllerError = require("../errors/abstractControllerError.js")

test("falla al crear una instancia de abstractController", () => {
    let controller 
    try {
        controller = new AbstractController()
    } catch (e) {
        expect(e).toBeInstanceOf(abstractControllerError)
    }
})

test("crea una instancia correctamente", () => {
    const ClubController = class clubController extends AbstractController {}

    expect(new ClubController()).toBeInstanceOf(AbstractController)
})

