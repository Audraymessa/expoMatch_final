# 🎪 ExpoMatch

**Piattaforma B2B per fiere e mercati in Italia**

ExpoMatch collega gli **organizzatori** (organizzatori di eventi) e i **venditori** (venditori/artigiani) per facilitare la partecipazione a fiere, mercati ed eventi.

---

## 📁 Struttura del Progetto

```
expoPro/
├── frontend/          # Applicazione Vue.js (client)
├── backend/           # API REST Node.js/Express (server)
├── database/          # Script SQL
└── README.md          # Questo file
```

---

## 🚀 Installazione e Avvio

### Prerequisiti

- **Node.js** (v18+)
- **MySQL** (v8+)
- **npm** o **yarn**

---

### 1️⃣ Database MySQL

```bash
# Connettersi a MySQL
mysql -u root -p

# Eseguire lo script di creazione
source /percorso/verso/expoPro/database/schema.sql
```

Oppure copiare e incollare il contenuto di `database/schema.sql` in MySQL Workbench.

---

### 2️⃣ Backend (API)

```bash
# Andare nella cartella backend
cd backend

# Installare le dipendenze
npm install

# Creare il file .env
cp .env.example .env

# Modificare .env con i tuoi parametri MySQL
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=la_tua_password
# DB_NAME=expomatch

# Avviare il server (modalità sviluppo)
npm run dev
```

Il backend sarà accessibile su **http://localhost:3000**

---

### 3️⃣ Frontend (Vue.js)

```bash
# Aprire un nuovo terminale
# Andare nella cartella frontend
cd frontend

# Installare le dipendenze
npm install

# Avviare il server di sviluppo
npm run dev
```

Il frontend sarà accessibile su **http://localhost:5173**

---

## 🔑 Account di Test

Creare account tramite l'interfaccia o direttamente nel database:

**Organizzatore:**
- Email: `mario@test.com`
- Password: `password123`

**Venditore:**
- Email: `anna@test.com`
- Password: `password123`

---

## 📱 Funzionalità

### Pubblico (senza login)
- ✅ Visualizzare l'elenco degli eventi
- ✅ Cercare per città
- ✅ Visualizzare i dettagli di un evento

### Organizzatore
- ✅ Creare un evento
- ✅ Modificare/Eliminare i propri eventi
- ✅ Visualizzare le candidature
- ✅ Approvare/Rifiutare le candidature

### Venditore
- ✅ Candidarsi a un evento
- ✅ Visualizzare le proprie candidature
- ✅ Ritirare una candidatura

---

## 🛠️ Stack Tecnologico

### 📝 Linguaggi di Programmazione
- **JavaScript** (ES6+) - Linguaggio principale per frontend e backend
- **SQL** - Linguaggio per query e gestione database
- **HTML** - Markup per struttura pagine web
- **CSS** - Stili e design responsive

---

### 🎯 Framework

#### Frontend
- **Vue.js 3** (^3.4.0) - Framework JavaScript progressivo per UI
- **Vue Router 4** (^4.2.5) - Framework di routing per SPA
- **Bootstrap 5** (^5.3.2) - Framework CSS per UI responsive

#### Backend
- **Express.js** (^4.18.2) - Framework web per Node.js
- **Node.js** (v18+) - Runtime JavaScript lato server

---

📚 Librerie e Tecnologie*

#### Frontend
- **Axios** (^1.6.0) - Libreria HTTP client per chiamate API
- **Bootstrap Icons** (^1.11.0) - Libreria di icone

#### Backend
- **MySQL2** (^3.6.0) - Driver MySQL con supporto Promise/async
- **JWT** (jsonwebtoken ^9.0.2) - Libreria per autenticazione basata su token
- **bcrypt** (^5.1.1) - Libreria per hashing sicuro delle password
- **CORS** (^2.8.5) - Middleware per gestione Cross-Origin Resource Sharing
- **dotenv** (^16.3.1) - Libreria per gestione variabili d'ambiente
- **Multer** (^2.0.2) - Middleware per gestione upload file

#### Database
- **MySQL*###  (v8+) - Sistema di gestione database relazionale

---

### 🔧 Strumenti di Sviluppo
- **Vite** (^5.0.0) - Build tool e dev server veloce per Vue.js
- **Nodemon** (^3.0.1) - Auto-reload server in modalità sviluppo
- **npm** - Package manager per Node.js
- **Git** - Sistema di controllo versione
- **GitHub** - Piattaforma di hosting repository

---

## 📚 Endpoint API

### Autenticazione
| Metodo | Route | Descrizione |
|--------|-------|-------------|
| POST | `/api/auth/register` | Registrazione |
| POST | `/api/auth/login` | Accesso |
| GET | `/api/auth/profile` | Profilo utente |

### Eventi
| Metodo | Route | Descrizione |
|--------|-------|-------------|
| GET | `/api/eventi` | Elenco eventi |
| GET | `/api/eventi/:id` | Dettaglio evento |
| POST | `/api/eventi` | Creare evento |
| PUT | `/api/eventi/:id` | Modificare evento |
| DELETE | `/api/eventi/:id` | Eliminare evento |

### Candidature
| Metodo | Route | Descrizione |
|--------|-------|-------------|
| POST | `/api/candidature` | Candidarsi |
| GET | `/api/candidature/mie` | Le mie candidature |
| GET | `/api/candidature/evento/:id` | Candidature di un evento |
| PUT | `/api/candidature/:id` | Approvare/Rifiutare |
| DELETE | `/api/candidature/:id` | Ritirare candidatura |

---

## 📝 Progetto Universitario

Questo progetto è stato realizzato nell'ambito del corso di ingegneria dei sistemi web 
Da : Audray messa e Leonardo Leonelli