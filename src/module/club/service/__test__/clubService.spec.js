const ClubService = require("../clubService.js")
const { formToEntity } = require("../../mapper/formToEntity")
const InvalidIdError = require("../errors/invalidIdError.js")
const TeamNotMappedError = require("../errors/notMappedError.js")
const IdInUseError = require("../../repository/errors/idInUseError.js")

const repositoryMock = {
    getById: jest.fn(() => Promise.resolve({})),
    saveNewTeam: jest.fn(() => Promise.resolve()),
    saveEditedTeam: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
    getAll: jest.fn(() => Promise.resolve([])),
    readData: jest.fn(() => Promise.resolve()),
    writeDb: jest.fn(() => Promise.resolve())
}

const exampleBodyMock = {
    nombre: "Estudiantes",
    abreviatura: "ELP",
    estadio: "Jorge Luis Hirschi",
    direccion: "1 y 57",
    anoFundacion: 1905,
    numeroId: 7777,
    telefono: "123-456-789",
    website: "estudiantesdelaplata.com",
    pais: "Argentina",
    fotoEscudo: "/uploads/test123"
}

const service = new ClubService(repositoryMock)

test("prueba buscar un equipo con un ID valida", async() => {
    await service.getById("3")
    expect(repositoryMock.getById).toHaveBeenCalledTimes(1)
})
test("falla al intentar buscar un equipo con una ID invalida", async() => {
    try{
        await service.getById(3) // tambien falla con ID undefined
    } catch(e){
        expect(e).toBeInstanceOf(InvalidIdError)
    }
})
test("prueba guardar un nuevo equipo", async() => {
    const body = exampleBodyMock

    const bodyMock = formToEntity(body)

    await service.saveNewTeam(bodyMock)

    expect(repositoryMock.saveNewTeam).toHaveBeenCalledTimes(1)
})
test("falla al intentar guardar un nuevo club sin clase Equipo", async() => {
    const bodyMock = exampleBodyMock

    try{
        await service.saveNewTeam(bodyMock)
    } catch(e){
        expect(e).toBeInstanceOf(TeamNotMappedError)
    }
})
test("prueba guardar la edicion de un equipo", async() => {
    const body = exampleBodyMock

    const bodyMock = formToEntity(body)

    await service.saveEditedTeam(bodyMock)

    expect(repositoryMock.saveEditedTeam).toHaveBeenCalledTimes(1)
})
test("falla al intentar guardar la edicion de un equipo sin clase Equipo", async() => {
    const body = exampleBodyMock

    try{
        await service.saveEditedTeam(body)
    } catch(e){
        expect(e).toBeInstanceOf(TeamNotMappedError)
    }
})
test("prueba borrar un equipo", async() => {
    await service.delete("1")
    
    expect(repositoryMock.delete).toHaveBeenCalledTimes(1)
})
test("falla al intentar borrar un equipo con un ID invalida", async() => {
    try{
        await service.delete(3) // tambien falla con ID undefined
    }catch(e){
        expect(e).toBeInstanceOf(InvalidIdError)
    }
})
test("llama a la funcion para obtener la lista completa", async() => {
    await service.getAll()
    expect(repositoryMock.getAll).toHaveBeenCalledTimes(1)
})