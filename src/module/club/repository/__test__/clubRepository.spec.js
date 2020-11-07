const { Equipo } = require("../../entities/club")
const IdNotFoundError = require("../errors/idNotFoundError")
const InvalidIdError = require("../errors/invalidIdError")
const ClubRepository = require("../sqlite/clubRepository")
const Sqlite3Database = require("better-sqlite3") 
const fs = require("fs")
const { formToEntity } = require("../../mapper/formToEntity")
const UndefinedError = require("../errors/undefinedError")
const club = require("../../entities/club")
let mockDb

beforeEach(() => {
    mockDb = new Sqlite3Database(':memory:');
    const migration = fs.readFileSync('src/config/setup.sql', 'utf-8');
    mockDb.exec(migration);
});
test("guardar un nuevo equipo genera un nuevo id", async() => {
    const repository = new ClubRepository(mockDb)

    const team = {
        nombre: "Estudiantes",
        abreviatura: "ELP",
        estadio: "Jorge Luis Hirschi",
        direccion: "1 y 57",
        anoFundacion: "1905",
        telefono: "123-456-789",
        website: "estudiantesdelaplata.com",
        pais: "Argentina",
        fotoEscudo: "/uploads/test123"
    }
    const teamToSave = await repository.saveNewTeam(formToEntity(team))

    expect(teamToSave.numeroId).toEqual("1")
})
test("editar un equipo cambia los valores actuales", async() => {
    const repository = new ClubRepository(mockDb)

    const newTeam = {
        nombre: "Estudiantes",
        abreviatura: "ELP",
        estadio: "Jorge Luis Hirschi",
        direccion: "1 y 57",
        anoFundacion: "1905",
        telefono: "123-456-789",
        website: "estudiantesdelaplata.com",
        pais: "Argentina",
        fotoEscudo: "/uploads/test123"
    }
    let team = await repository.saveNewTeam(formToEntity(newTeam))

    expect(team.numeroId).toEqual("1")

    const editedTeam = {
        numeroId: "1",
        nombre: "Boke Juniors",
        abreviatura: "ELP",
        estadio: "Jorge Luis Hirschi",
        direccion: "1 y 57",
        anoFundacion: "1905",
        telefono: "123-456-789",
        website: "estudiantesdelaplata.com",
        pais: "Argentina",
        fotoEscudo: "/uploads/test123"
    }

    team = await repository.saveEditedTeam(formToEntity(editedTeam))

    expect(team.numeroId).toEqual("1")
    expect(team.nombre).toEqual("Boke Juniors")
})
test("llamar a getById con un ID invalido da error", async() => {
    const repository = new ClubRepository(mockDb)
    const invalidId = 3
    try{
        await repository.getById(invalidId)
    } catch(e){
        expect(e).toBeInstanceOf(InvalidIdError)
    }
})
test("llamar a getById correctamente devuelve un equipo", async() => {
    const repository = new ClubRepository(mockDb)
    const newTeam = {
        nombre: "Estudiantes",
        abreviatura: "ELP",
        estadio: "Jorge Luis Hirschi",
        direccion: "1 y 57",
        anoFundacion: "1905",
        telefono: "123-456-789",
        website: "estudiantesdelaplata.com",
        pais: "Argentina",
        fotoEscudo: "/uploads/test123"
    }
    const savedTeam = await repository.saveNewTeam(formToEntity(newTeam))

    const teamToFind = await repository.getById("1")

    expect(teamToFind).toEqual(savedTeam)
})
test("getById no encuentra un equipo con el ID introducido ", async() => {
    const repository = new ClubRepository(mockDb)
    let team 
    try{
        team = await repository.getById("123123123")
    } catch(e){
        expect(e).toBeInstanceOf(IdNotFoundError)
    }
    expect(team).toBeUndefined()
})
test("llama a delete sin introducir un ID da un error", async() => {
    const repository = new ClubRepository(mockDb)
    try{
        await repository.delete()
    } catch(e){
        expect(e).toBeInstanceOf(UndefinedError)
    }
})
test("llama a delete correctamente", async () => {
    const repository = new ClubRepository(mockDb)
    const newTeam = {
        nombre: "Estudiantes",
        abreviatura: "ELP",
        estadio: "Jorge Luis Hirschi",
        direccion: "1 y 57",
        anoFundacion: "1905",
        telefono: "123-456-789",
        website: "estudiantesdelaplata.com",
        pais: "Argentina",
        fotoEscudo: "/uploads/test123"
    }

    const savedTeam = await repository.saveNewTeam(formToEntity(newTeam))

    expect(savedTeam.numeroId).toBe("1")

    const deleteTeam = await repository.delete("1")

    expect(deleteTeam).toBe(true)
})
test("getAll llama a readDatabase", async() => {
    const repository = new ClubRepository(mockDb)
    repository.readDatabase = jest.fn().mockImplementationOnce(() => Promise.resolve())

    repository.getAll()
    expect(repository.readDatabase).toHaveBeenCalledTimes(1)
})
test("readDatabase devuelve false si la database esta vacia", async() => {
    const repository = new ClubRepository(mockDb)

    const results = await repository.readDatabase()

    expect(results).toBe(false)
})
test("getAll devuelve un equipo", async() => {
    const repository = new ClubRepository(mockDb)

    const newTeam = {
        nombre: "Estudiantes",
        abreviatura: "ELP",
        estadio: "Jorge Luis Hirschi",
        direccion: "1 y 57",
        anoFundacion: "1905",
        telefono: "123-456-789",
        website: "estudiantesdelaplata.com",
        pais: "Argentina",
        fotoEscudo: "/uploads/test123"
    }

    const savedTeam = await repository.saveNewTeam(formToEntity(newTeam))

    const results = await repository.getAll()

    expect(results).toEqual([savedTeam])
})