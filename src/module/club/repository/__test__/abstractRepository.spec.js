const AbstractRepository = require("../abstractRepository.js")
const abstractRepositoryError = require("../errors/abstractRepositoryError.js")

test("falla al crear una instancia de abstractRepository", async() => {
    let repository
    try{
        repository = new AbstractRepository()
    } catch (e) {
        expect(e).toBeInstanceOf(abstractRepositoryError)
    }
})

test("crea una instancia correctamente", async() => {
    let Repository = class Repository extends AbstractRepository{}

    expect(new Repository()).toBeInstanceOf(AbstractRepository)
})