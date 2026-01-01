# 🎪 ExpoMatch

**Plateforme B2B pour foires et marchés en Italie**

ExpoMatch connecte les **organizzatori** (organisateurs d'événements) et les **venditori** (vendeurs/artisans) pour faciliter la participation aux foires, marchés et événements.

---

## 📁 Structure du Projet

```
expoPro/
├── frontend/          # Application Vue.js (client)
├── backend/           # API REST Node.js/Express (serveur)
├── database/          # Scripts SQL
└── README.md          # Ce fichier
```

---

## 🚀 Installation et Démarrage

### Prérequis

- **Node.js** (v18+)
- **MySQL** (v8+)
- **npm** ou **yarn**

---

### 1️⃣ Base de données MySQL

```bash
# Se connecter à MySQL
mysql -u root -p

# Exécuter le script de création
source /chemin/vers/expoPro/database/schema.sql
```

Ou copier-coller le contenu de `database/schema.sql` dans MySQL Workbench.

---

### 2️⃣ Backend (API)

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Modifier .env avec vos paramètres MySQL
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=votre_mot_de_passe
# DB_NAME=expomatch

# Démarrer le serveur (mode développement)
npm run dev
```

Le backend sera accessible sur **http://localhost:3000**

---

### 3️⃣ Frontend (Vue.js)

```bash
# Ouvrir un nouveau terminal
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur **http://localhost:5173**

---

## 🔑 Comptes de Test

Créez des comptes via l'interface ou directement en base :

**Organizzatore:**
- Email: `mario@test.com`
- Password: `password123`

**Venditore:**
- Email: `anna@test.com`
- Password: `password123`

---

## 📱 Fonctionnalités

### Public (sans login)
- ✅ Voir la liste des événements
- ✅ Rechercher par ville
- ✅ Voir le détail d'un événement

### Organizzatore
- ✅ Créer un événement
- ✅ Modifier/Supprimer ses événements
- ✅ Voir les candidatures
- ✅ Approuver/Refuser les candidatures

### Venditore
- ✅ Postuler à un événement
- ✅ Voir ses candidatures
- ✅ Retirer une candidature

---

## 🛠️ Technologies

| Couche | Technologie |
|--------|-------------|
| Frontend | Vue.js 3, Bootstrap 5, Axios |
| Backend | Node.js, Express.js |
| Base de données | MySQL |
| Authentification | JWT (JSON Web Token) |

---

## 📚 API Endpoints

### Authentification
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/auth/profile` | Profil utilisateur |

### Événements
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/eventi` | Liste des événements |
| GET | `/api/eventi/:id` | Détail événement |
| POST | `/api/eventi` | Créer événement |
| PUT | `/api/eventi/:id` | Modifier événement |
| DELETE | `/api/eventi/:id` | Supprimer événement |

### Candidatures
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/candidature` | Postuler |
| GET | `/api/candidature/mie` | Mes candidatures |
| GET | `/api/candidature/evento/:id` | Candidatures d'un événement |
| PUT | `/api/candidature/:id` | Approuver/Refuser |
| DELETE | `/api/candidature/:id` | Retirer candidature |

---

## 📝 Projet Universitaire

Ce projet a été réalisé dans le cadre d'un cours universitaire.

**Auteur:** [Votre Nom]
**Date:** 2025

