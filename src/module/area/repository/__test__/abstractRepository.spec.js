const AbstractRepostory = require("../abstractRepository")
const AbstractRepostoryError = require("../errors/abstractRepositoryError")

test("falla al intentar instanciar abstractRepository", async() => {
    let repository 
    try {
        repository = new AbstractRepostory()
    } catch (e) {
        expect(e).toBeInstanceOf(AbstractRepostoryError)
    }
    expect(repository).toBeUndefined
})