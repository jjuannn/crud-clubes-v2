const AbstractController = require("../abstractController")
const AbstractControllerError = require("../errors/abstractControllerError")

test("falla al intentar instanciar abstractController", async() => {
    let controller
    try {
        controller = new AbstractController()
    } catch (e) {
        expect(e).toBeInstanceOf(AbstractControllerError)
    }
    expect(controller).toBeUndefined()
})