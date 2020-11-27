const AreaModel = require("../../../area/model/areaModel")
const ClubModel = require("../../model/clubModel")
const { Sequelize } = require("sequelize")
const IdNotFoundError = require("../errors/idNotFoundError")
const InvalidIdError = require("../errors/invalidIdError")
const UndefinedError = require("../errors/undefinedError")
const ClubRepository = require("../sqlite/clubRepository")
const { formToEntity } = require("../../mapper/formToEntity")
const { Equipo } = require("../../entities/club") 

const sequelizeInstance = new Sequelize("sqlite::memory")

let repository 

beforeAll(() => {
    const club = ClubModel.setup(sequelizeInstance)
    const area = AreaModel.setup(sequelizeInstance)

    club.belongsTo(area)

    repository = new ClubRepository(club, area)
})

beforeEach(async(done) => {
    await sequelizeInstance.sync({force: true})
    done()
})

const teamExampleBody = new Equipo({
    nombre: 'Arsenal FC',
    abreviatura: 'ARS',
    estadio: 'Emirates Stadium',
    direccion: '75 Drayton Park London N5 1BU',
    anoFundacion: '1889',
    id: NaN,
    telefono: '+44 (0121) 3272299',
    website: 'estudiantesdelaplata.com',
    area_id: undefined,
    fotoEscudo: '/uploads/4a33074be07b4d59251ac58b88f6b656',
    Area: undefined
})

test("llamar a saveNewTeam sin un equipo da un error", async() => {
    let newTeam
    try {
        newTeam = await repository.saveNewTeam()
    } catch (e) {
        expect(e).toBeInstanceOf(UndefinedError)
    }
    expect(newTeam).toBeUndefined()
})
test("guarda un equipo y genera un nuevo ID", async() => {
    const NEW_TEAM_ID = 1
    const newTeam = await repository.saveNewTeam(teamExampleBody)
    expect(newTeam.id).toEqual(NEW_TEAM_ID)
})
test("saveEditedTeam reemplaza los valores de un equipo existente", async() => {
    const NEW_TEAM_ID = 1
    const newTeam = await repository.saveNewTeam(teamExampleBody)
    expect(newTeam.id).toEqual(NEW_TEAM_ID)
    newTeam.nombre = "Estudiantes LP"
    const editedTeam = await repository.saveEditedTeam(newTeam)

    expect(editedTeam.id).toEqual(newTeam.id)
    expect(editedTeam.nombre).toEqual("Estudiantes LP")
})
test("llamar a saveEditedTeam sin un equipo da un error", async() => {
    let saveTeam
    try {
        saveTeam = await repository.saveEditedTeam()
    } catch (e) {
        expect(e).toBeInstanceOf(UndefinedError)
    }
    expect(saveTeam).toBeUndefined()
})
test("getById da error al usar un ID invalido", async() => {
    const INVALID_ID = "3"
    let team
    try {
        await repository.getById(INVALID_ID)
    } catch (e) {
        expect(e).toBeInstanceOf(InvalidIdError)
    }
    expect(team).toBeUndefined()
})
test("getById devuelve un equipo", async() => {
    const savedTeam = await repository.saveNewTeam(teamExampleBody)
    expect(savedTeam.id).toBe(1)

    const getTeam = await repository.getById(1)
    
    expect(savedTeam.id).toEqual(getTeam.id)
})
test("getById da un error al no encontrar el equipo solicitado", async() => {
    let team 
    try {
        team = await repository.getById(123123)
    } catch (e) {
        expect(e).toBeInstanceOf(IdNotFoundError)
    }
    expect(team).toBeUndefined()
})
test("llamar a delete sin un ID da un error", async() => {
    try {
        await repository.delete()
    } catch (e) {
        expect(e).toBeInstanceOf(UndefinedError)
    }
})
test("delete borra un equipo correctamente y devuelve true", async() => {
    const savedTeam = await repository.saveNewTeam(teamExampleBody)
    const { id } = savedTeam

    const deletedTeam = await repository.delete(id)

    expect(deletedTeam).toBe(true)
})
test("getAll devuelve false si la lista de equipso esta vacia", async() => {
    const teamList = await repository.getAll()

    expect(teamList).toBe(false)
})
test("getAll devuelve una lista de equipos", async() => {
    const savedTeam = await repository.saveNewTeam(teamExampleBody)

    const teamList = await repository.getAll()

    expect(teamList).toEqual([savedTeam])
})