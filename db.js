import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync("app_gps.db");

export const inicializarBanco = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS configuracao (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      latitude REAL,
      longitude REAL
    );
  `);
};

export const inserirDestino = (latitude, longitude) => {
  db.runSync('INSERT INTO configuracao (latitude, longitude) VALUES (?, ?)', latitude, longitude);
};

export const listarDestinos = () => {
  return db.getAllSync('SELECT * FROM configuracao');
};

export const atualizarDestino = (id, latitude, longitude) => {
  db.runSync('UPDATE configuracao SET latitude = ?, longitude = ? WHERE id = ?', latitude, longitude, id);
};

export const deletarDestino = (id) => {
  db.runSync('DELETE FROM configuracao WHERE id = ?', id);
};
