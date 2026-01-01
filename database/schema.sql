DROP DATABASE IF EXISTS expomatch;
CREATE DATABASE expomatch;
USE expomatch;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    ruolo ENUM('organizzatore', 'venditore') NOT NULL,
    telefono VARCHAR(20),
    descrizione TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eventi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titolo VARCHAR(255) NOT NULL,
    descrizione TEXT NOT NULL,
    data_evento DATE NOT NULL,
    citta VARCHAR(100) NOT NULL,
    indirizzo VARCHAR(255) NOT NULL,
    prezzo DECIMAL(10, 2) NOT NULL,
    posti_totali INT NOT NULL,
    posti_disponibili INT NOT NULL,
    dimensione_stand VARCHAR(50),
    immagine VARCHAR(500),
    requisiti TEXT,
    organizzatore_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizzatore_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE candidature (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,
    venditore_id INT NOT NULL,
    stato ENUM('in_attesa', 'approvata', 'rifiutata') DEFAULT 'in_attesa',
    messaggio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evento_id) REFERENCES eventi(id) ON DELETE CASCADE,
    FOREIGN KEY (venditore_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_candidatura (evento_id, venditore_id)
);

CREATE INDEX idx_eventi_citta ON eventi(citta);
CREATE INDEX idx_eventi_data ON eventi(data_evento);
CREATE INDEX idx_candidature_stato ON candidature(stato);

INSERT INTO users (nome, email, password, ruolo) VALUES 
('Mario Rossi', 'mario@test.com', '$2b$10$8K1p/pJmrNlCdNnC3QJYOO.H7bKxLZrBGz6YXWCdW5EcA8.rOzFfK', 'organizzatore');

INSERT INTO users (nome, email, password, ruolo, descrizione) VALUES 
('Anna Bianchi', 'anna@test.com', '$2b$10$8K1p/pJmrNlCdNnC3QJYOO.H7bKxLZrBGz6YXWCdW5EcA8.rOzFfK', 'venditore', 'Artigiana di gioielli');

INSERT INTO eventi (titolo, descrizione, data_evento, citta, indirizzo, prezzo, posti_totali, posti_disponibili, dimensione_stand, immagine, requisiti, organizzatore_id) VALUES 
('Glam Market Milano', 'Mercatino vintage nel cuore dei Navigli', '2025-12-15', 'Milano', 'Via Navigli 45', 150.00, 30, 28, '1.5 x 1.5', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800', 'Portare propria prolunga, Tavolo fornito', 1);

INSERT INTO eventi (titolo, descrizione, data_evento, citta, indirizzo, prezzo, posti_totali, posti_disponibili, dimensione_stand, immagine, requisiti, organizzatore_id) VALUES 
('Fashion Market Roma', 'Moda e accessori artigianali', '2025-12-20', 'Roma', 'Piazza Navona 12', 200.00, 50, 45, '2 x 2', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', 'Stand con copertura', 1);

INSERT INTO eventi (titolo, descrizione, data_evento, citta, indirizzo, prezzo, posti_totali, posti_disponibili, dimensione_stand, immagine, requisiti, organizzatore_id) VALUES 
('Mercatino Natale Bologna', 'Prodotti artigianali e gastronomici', '2025-12-22', 'Bologna', 'Piazza Maggiore', 100.00, 80, 75, '1.5 x 1.5', 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=800', 'Decorazioni natalizie', 1);
