const AreaService = require("../areaService.js")
const { formToEntity } = require("../../mapper/formToEntity")
const InvalidIdError = require("../errors/invalidIdError")
const NotMappedError = require("../errors/notMappedError")

const repositoryMock = {
    getById: jest.fn(() => Promise.resolve({})),
    saveNewArea: jest.fn(() => Promise.resolve()),
    saveEditedArea: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
    getAll: jest.fn(() => Promise.resolve([]))
}

const rawBody = {
    nombre: 'Argentina',
    id: NaN
}

const areaExampleBody = formToEntity(rawBody)

const service =  new AreaService(repositoryMock)

test("getById llama al repositorio correctamente", async() => {
    service.getById(3)
    expect(repositoryMock.getById).toHaveBeenCalledTimes(1)
})
test("getById falla al pasar un ID con un typeof invalido", async() => {
    try {
        service.getById("3") // tambien falla con ID undefined
    } catch (e) {
        expect(e).toBeInstanceOf(InvalidIdError)
    }
})
test("saveNewArea da error si el nuevo area no es una instancia de Equipo", async() => {
    try {
        service.saveNewArea(rawBody)    
    } catch (e) {
        expect(e).toBeInstanceOf(NotMappedError)
    }
    expect(repositoryMock.saveNewArea).toHaveBeenCalledTimes(0)
})
test("saveNewArea llama al repositorio correctamente", async() => {
    service.saveNewArea(areaExampleBody)
    expect(repositoryMock.saveNewArea).toHaveBeenCalledTimes(1)
})
test("saveEditedArea da error si el area editado no es una instancia de Equipo", async() => {
    try{
        service.saveEditedArea(rawBody)
    } catch(e){
        expect(e).toBeInstanceOf(NotMappedError)
    }
    expect(repositoryMock.saveEditedArea).toHaveBeenCalledTimes(0)
})
test("saveEditedArea llama al repositorio correctamente", async() => {
    service.saveEditedArea(areaExampleBody)
    expect(repositoryMock.saveEditedArea).toHaveBeenCalledTimes(1)
})
test("delete falla al llamarla con una ID invalida", async() => {
    try {
        service.delete("3") // tambien falla con ID undefined
    } catch (e) {
        expect(e).toBeInstanceOf(NotMappedError)
    }
    expect(repositoryMock.delete).toHaveBeenCalledTimes(0)
})
test("delete llama al repositorio correctamente", async() => {
    service.delete(3)
    expect(repositoryMock.delete).toHaveBeenCalledTimes(1)
})
test("getAll llama al repositorio correctamente", async() => {
    service.getAll()
    expect(repositoryMock.getAll).toHaveBeenCalledTimes(1)
})
