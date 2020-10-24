const { Equipo } = require("../../entities/club")
const { mapearDB } = require("../../mapper/dbMapper")
const IdInUseError = require("../errors/idInUseError")
const IdNotFoundError = require("../errors/idNotFoundError")
const InvalidIdError = require("../errors/invalidIdError")
const ClubRepository = require("../json/clubRepository")
const pathMock = "/fake_route/"

const fs = {
    writeFileSync: jest.fn(() => Promise.resolve()),
    readFileSync: jest.fn(() => Promise.resolve())
}

const repository = new ClubRepository(fs, pathMock)

test("writeDb llama a writeFileSync y se asegura que sea con los parametros", async() => {
    const content = {}
    
    await repository.writeDb(content)

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
    expect(fs.writeFileSync).toHaveBeenCalledWith(pathMock, JSON.stringify(content) )
})

test("readData llama a readFileSync y parsea los elementos", async() => {
    JSON.parse = jest.fn().mockImplementationOnce(() => {});
    
    await repository.readData()

    expect(fs.readFileSync).toHaveBeenCalledTimes(1)
    expect(JSON.parse).toHaveBeenCalledTimes(1)
})

test("getAll llama a readData y mapea los elementos", async() => {
    repository.readData = jest.fn().mockImplementationOnce(() => []);
    Array.prototype.map = jest.fn().mockImplementationOnce(() => [])

    await repository.getAll()

    expect(repository.readData).toHaveBeenCalledTimes(1)
    expect(Array.prototype.map).toHaveBeenCalledTimes(1)
})
test("falla al intentar llamar a getById con un ID invalido", async() => {
    const invalidId = 3
    try {
        await repository.getById(invalidId)
    } catch (e) {
        expect(e).toBeInstanceOf(InvalidIdError)
    }
})
test("falla al no encontrar un equipo con el ID ingresado", async() => {
    const validId = "3"
    repository.getAll = jest.fn().mockImplementationOnce(() => Promise.resolve([{},{}]))

    try{
        await repository.getById(validId)
    } catch(e){
        expect(e).toBeInstanceOf(IdNotFoundError) // preguntar por esta funcion
    }
})
test("prueba correctamente la function getById", async() => {
    const validId = "3"
    repository.getAll = jest.fn().mockImplementationOnce(() => Promise.resolve([{id: "3"}]))
    Array.prototype.findIndex = jest.fn().mockImplementationOnce(() => "0")

    const selectedTeam = await repository.getById(validId)

    expect(repository.getAll).toHaveBeenCalledTimes(1)
    expect(selectedTeam).toBeInstanceOf(Equipo)
    expect(Array.prototype.findIndex).toHaveBeenCalledTimes(1)
})