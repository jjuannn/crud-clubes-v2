const ClubService = require("../clubService.js")
const { formToEntity } = require("../../mapper/formToEntity")
const InvalidIdError = require("../errors/invalidIdError.js")
const TeamNotMappedError = require("../errors/notMappedError.js")
const { Equipo } = require("../../entities/club")

const repositoryMock = {
    getById: jest.fn(() => Promise.resolve({})),
    saveNewTeam: jest.fn(() => Promise.resolve()),
    saveEditedTeam: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
    getAll: jest.fn(() => Promise.resolve([]))
}

const rawBody = {
    nombre: 'Arsenal FC',
    abreviatura: 'ARS',
    estadio: 'Emirates Stadium',
    direccion: '75 Drayton Park London N5 1BU',
    anoFundacion: '1889',
    id: NaN,
    telefono: '+44 (0121) 3272299',
    website: 'estudiantesdelaplata.com',
    area_id: 38,
    fotoEscudo: '/uploads/4a33074be07b4d59251ac58b88f6b656',
    Area: undefined
}

const teamExampleBody = formToEntity(rawBody)

const service =  new ClubService(repositoryMock)

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
test("saveNewTeam da error si el nuevo equipo no es una instancia de Equipo", async() => {
    try {
        service.saveNewTeam(rawBody)    
    } catch (e) {
        expect(e).toBeInstanceOf(TeamNotMappedError)
    }
    expect(repositoryMock.saveNewTeam).toHaveBeenCalledTimes(0)
})
test("saveNewTeam llama al repositorio correctamente", async() => {
    service.saveNewTeam(teamExampleBody)
    expect(repositoryMock.saveNewTeam).toHaveBeenCalledTimes(1)
})
test("saveEditedTeam da error si el equipo editado no es una instancia de Equipo", async() => {
    try{
        service.saveEditedTeam(rawBody)
    } catch(e){
        expect(e).toBeInstanceOf(TeamNotMappedError)
    }
    expect(repositoryMock.saveEditedTeam).toHaveBeenCalledTimes(0)
})
test("saveEditedTeam llama al repositorio correctamente", async() => {
    service.saveEditedTeam(teamExampleBody)
    expect(repositoryMock.saveEditedTeam).toHaveBeenCalledTimes(1)
})
test("delete falla al llamarla con una ID invalida", async() => {
    try {
        service.delete("3") // tambien falla con ID undefined
    } catch (e) {
        expect(e).toBeInstanceOf(TeamNotMappedError)
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
