const AreaModel = require("../../model/areaModel")
const { Sequelize } = require("sequelize")
const IdNotFoundError = require("../errors/idNotFoundError")
const InvalidIdError = require("../errors/invalidIdError")
const UndefinedError = require("../errors/undefinedError")
const AreaRepository = require("../sqlite/areaRepository")
const { formToEntity } = require("../../mapper/formToEntity")
const { Area } = require("../../entities/area") 

const sequelizeInstance = new Sequelize("sqlite::memory")

let repository 

beforeAll(() => {
    const area = AreaModel.setup(sequelizeInstance)
    repository = new AreaRepository(area)
})

beforeEach(async(done) => {
    await sequelizeInstance.sync({force: true})
    done()
})

const areaExampleBody = new Area({
    nombre: 'Argentina',
    id: NaN
})

test("llamar a saveNewArea sin un area da un error", async() => {
    let newArea
    try {
        newArea = await repository.saveNewArea()
    } catch (e) {
        expect(e).toBeInstanceOf(UndefinedError)
    }
    expect(newArea).toBeUndefined()
})
test("guarda un area y genera un nuevo ID", async() => {
    const NEW_AREA_ID = 1
    const newArea = await repository.saveNewArea(areaExampleBody)
    expect(newArea.id).toEqual(NEW_AREA_ID)
})
test("saveEditedArea reemplaza los valores de un area existente", async() => {
    const NEW_AREA_ID = 1
    const newArea = await repository.saveNewArea(areaExampleBody)
    expect(newArea.id).toEqual(NEW_AREA_ID)
    newArea.nombre = "Brasil"
    const editedArea = await repository.saveEditedArea(newArea)

    expect(editedArea.id).toEqual(newArea.id)
    expect(editedArea.nombre).toEqual("Brasil")
})
test("llamar a saveEditedArea sin un area da un error", async() => {
    let saveArea
    try {
        saveArea = await repository.saveEditedArea()
    } catch (e) {
        expect(e).toBeInstanceOf(UndefinedError)
    }
    expect(saveArea).toBeUndefined()
})
test("getById da error al usar un ID invalido", async() => {
    const INVALID_ID = "3"
    let area
    try {
        await repository.getById(INVALID_ID)
    } catch (e) {
        expect(e).toBeInstanceOf(InvalidIdError)
    }
    expect(area).toBeUndefined()
})
test("getById devuelve un area", async() => {
    const savedArea = await repository.saveNewArea(areaExampleBody)
    expect(savedArea.id).toBe(1)

    const getArea = await repository.getById(1)
    
    expect(savedArea.id).toEqual(getArea.id)
})
test("llamar a delete sin un ID da un error", async() => {
    try {
        await repository.delete()
    } catch (e) {
        expect(e).toBeInstanceOf(UndefinedError)
    }
})
test("delete borra un area correctamente y devuelve true", async() => {
    const savedArea = await repository.saveNewArea(areaExampleBody)
    const { id } = savedArea

    const deletedArea = await repository.delete(id)

    expect(deletedArea).toBe(true)
})
test("getAll devuelve false si la lista de equipso esta vacia", async() => {
    const areaList = await repository.getAll()

    expect(areaList).toBe(false)
})
test("getAll devuelve una lista de areas", async() => {
    const savedArea = await repository.saveNewArea(areaExampleBody)

    const areaList = await repository.getAll()

    expect(areaList).toEqual([savedArea])
})