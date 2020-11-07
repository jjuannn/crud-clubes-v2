DROP TABLE IF EXISTS clubes;
CREATE TABLE clubes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    abreviatura TEXT NOT NULL,
    estadio TEXT NOT NULL,
    direccion TEXT NOT NULL,
    ano_fundacion TEXT NOT NULL,
    telefono TEXT NOT NULL,
    website TEXT NOT NULL,
    pais TEXT NOT NULL,
    foto_escudo TEXT NOT NULL,
    created_at DATE DEFAULT (datetime('now', 'localtime')) NOT NULL,
    updated_at DATE DEFAULT (datetime('now', 'localtime')) NOT NULL
)

