# ExpoMatch Backend

API REST pour la plateforme ExpoMatch.

## Installation

```bash
cd backend
npm install
```

## Configuration

1. Créer le fichier `.env` :
```bash
cp .env.example .env
```

2. Configurer les variables dans `.env` :
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=expomatch
JWT_SECRET=votre_cle_secrete
```

## Base de données

Exécuter le script SQL pour créer la base de données :
```bash
mysql -u root -p < ../database/schema.sql
```

## Démarrage

```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:3000`

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil (protégé)

### Événements
- `GET /api/eventi` - Liste des événements
- `GET /api/eventi/:id` - Détail d'un événement
- `POST /api/eventi` - Créer (organizzatore)
- `PUT /api/eventi/:id` - Modifier (organizzatore)
- `DELETE /api/eventi/:id` - Supprimer (organizzatore)

### Candidatures
- `POST /api/candidature` - Postuler (venditore)
- `GET /api/candidature/mie` - Mes candidatures (venditore)
- `GET /api/candidature/evento/:id` - Candidatures d'un événement (organizzatore)
- `PUT /api/candidature/:id` - Approuver/Refuser (organizzatore)
- `DELETE /api/candidature/:id` - Retirer candidature (venditore)

