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

## 🛠️ Tecnologie

| Livello | Tecnologia |
|---------|------------|
| Frontend | Vue.js 3, Bootstrap 5, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Autenticazione | JWT (JSON Web Token) |

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

Questo progetto è stato realizzato nell'ambito di un corso universitario.

**Autore:** [Il Tuo Nome]
**Data:** 2025


