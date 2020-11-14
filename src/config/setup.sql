DROP TABLE IF EXISTS Clubs;
CREATE TABLE Clubs(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    abreviatura TEXT NOT NULL,
    estadio TEXT NOT NULL,
    direccion TEXT NOT NULL,
    anoFundacion TEXT NOT NULL,
    telefono TEXT NOT NULL,
    website TEXT NOT NULL,
    pais TEXT NOT NULL,
    fotoEscudo TEXT NOT NULL,
    created_at DATE DEFAULT (datetime('now', 'localtime')) NOT NULL,
    updated_at DATE DEFAULT (datetime('now', 'localtime')) NOT NULL
)

