# HealthTrack – Plateforme de Suivi Médical Intelligent

## Description

HealthTrack est une application modulaire pour le **suivi médical des patients chroniques**, permettant de gérer :

* Profils utilisateurs (patients, médecins, administrateurs)
* Appareils médicaux connectés (IoT)
* Planification des rendez-vous
* Suivi et rappels des traitements

L’architecture est **multi-module**, chaque service exposant des API REST sécurisées pour l’interopérabilité.

---

## Stack Technique

| Composant            | Technologie / Framework | Base de données                     |
| -------------------- | ----------------------- | ----------------------------------- |
| **Device**           | Python + FastAPI        | InfluxDB (Time-series) / PostgreSQL |
| **Profile**          | Node.js + Express.js    | MongoDB                             |
| **Planification**    | Java + Spring Boot      | PostgreSQL                          |
| **SuiviTraitement**  | Java + Spring Boot      | PostgreSQL                          |
| **Conteneurisation** | Docker & Docker Compose | –                                   |

**Autres outils :** GitHub Actions (CI/CD), JWT pour authentification, HTTPS pour sécurité.

---

## Modules et API

### 1. Profile Module ([http://localhost:3000](http://localhost:3000))

**Gestion des utilisateurs et rôles**

#### Endpoints principaux

| Méthode  | Endpoint                | Description                    |
| -------- | ----------------------- | ------------------------------ |
| `POST`   | `/auth/register`        | Créer un profil                |
| `POST`   | `/auth/login`           | Authentifier un profil         |
| `GET`    | `/profiles/me`          | Récupérer son profil actuel    |
| `PUT`    | `/profiles/me`          | Mettre à jour son profil       |
| `PUT`    | `/profiles/me/password` | Changer le mot de passe        |
| `GET`    | `/profiles`             | Lister tous les profils        |
| `GET`    | `/profiles/role/{role}` | Lister profils par rôle        |
| `GET`    | `/profiles/{id}`        | Récupérer un profil par ID     |
| `PUT`    | `/profiles/{id}`        | Mettre à jour un profil par ID |
| `DELETE` | `/profiles/{id}`        | Supprimer un profil par ID     |
| `GET`    | `/profiles/statistics`  | Statistiques sur les profils   |

Exemple `POST /auth/register` :

```json
{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "PATIENT",
  "phone": "0612345678",
  "maladieChronique": "Diabetes",
  "passwordHash": "password123"
}
```

Réponse :

```json
{
  "profile": {
    "id": "64f7c2e1a1b2c3d4e5f6a7b8",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "PATIENT",
    "phone": "0612345678",
    "maladieChronique": "Diabetes",
    "isActive": true,
    "createdAt": "2025-11-06T23:00:00.000Z",
    "updatedAt": "2025-11-06T23:00:00.000Z"
  },
  "token": "jwt.token.here"
}
```

---

### 2. Device Module ([http://localhost:8000](http://localhost:8000))

**Collecte et supervision des appareils connectés**

#### Endpoints principaux

| Méthode  | Endpoint        | Description                          |
| -------- | --------------- | ------------------------------------ |
| `POST`   | `/devices`      | Ajouter un appareil                  |
| `GET`    | `/devices`      | Lister tous les appareils            |
| `GET`    | `/devices/{id}` | Détails d’un appareil                |
| `PUT`    | `/devices/{id}` | Mise à jour + enregistrement mesures |
| `DELETE` | `/devices/{id}` | Supprimer un appareil                |

#### Données IoT (InfluxDB)

* **Écrire une mesure** :

```
POST http://localhost:8086/api/v2/write?org=my-org&bucket=iot_data&precision=s
Headers: Authorization: Token my-token
Body: device_measurement,device_id=3 value=25.5
```

* **Lire mesures** :

```json
POST http://localhost:8086/api/v2/query?org=my-org
Headers: Authorization: Token my-token
Body: {
  "query": "from(bucket:\"iot_data\") |> range(start: -1h) |> filter(fn: (r) => r._measurement == \"device_measurement\")"
}
```

* **Supprimer mesures** :

```json
POST http://localhost:8086/api/v2/delete?org=my-org&bucket=iot_data
Headers: Authorization: Token my-token
Body: {
  "start": "1970-01-01T00:00:00Z",
  "stop": "2025-10-29T23:59:59Z",
  "predicate": "_measurement=\"device_measurement\" AND device_id='3'"
}
```

---

### 3. Planification Module ([http://localhost:8082](http://localhost:8082))

**Gestion des rendez-vous**

#### Endpoints principaux

| Méthode | Endpoint                                                            | Description                        |
| ------- | ------------------------------------------------------------------- | ---------------------------------- |
| `POST`  | `/api/appointments/schedule`                                        | Planifier un rendez-vous           |
| `GET`   | `/api/appointments/patient/{patientId}`                             | Liste des rendez-vous d’un patient |
| `PUT`   | `/api/appointments/cancel/{rdvId}`                                  | Annuler un rendez-vous             |
| `PUT`   | `/api/appointments/update/{rdvId}?nouvelleDate=YYYY-MM-DDTHH:MM:SS` | Modifier un rendez-vous            |

Exemple `POST /api/appointments/schedule` :

```json
{
  "patientId": 1,
  "doctorId": 2,
  "dateRdv": "2025-11-10T14:30:00"
}
```

---

### 4. SuiviTraitement Module ([http://localhost:8002](http://localhost:8002))

**Suivi des traitements médicaux et rappels**

#### Endpoints principaux

| Méthode  | Endpoint                         | Description                    |
| -------- | -------------------------------- | ------------------------------ |
| `POST`   | `/treatments`                    | Ajouter un traitement          |
| `GET`    | `/treatments`                    | Lister tous les traitements    |
| `GET`    | `/treatments?patientId={id}`     | Lister traitements par patient |
| `GET`    | `/treatments/active`             | Lister traitements actifs      |
| `PUT`    | `/treatments/{id}`               | Mettre à jour un traitement    |
| `DELETE` | `/treatments/{id}`               | Supprimer un traitement        |
| `POST`   | `/treatments/{id}/validate-dose` | Valider une dose               |
| `POST`   | `/treatments/{id}/send-reminder` | Envoyer un rappel              |
| `GET`    | `/treatments/stats`              | Statistiques des traitements   |

Exemple `POST /treatments` :

```json
{
  "patientId": 1,
  "medicament": "Paracetamol",
  "dosage": "500mg",
  "frequence": "Twice a day",
  "dateDebut": "2025-11-06T09:00:00",
  "dateFin": "2025-11-10T09:00:00",
  "instructions": "Take after meals"
}
```

---

## Installation & Setup

### Prérequis

* Docker & Docker Compose
* Python 3.10+
* Node.js 18+
* Java 17+
* Accès à InfluxDB et PostgreSQL

### Setup local

1. Cloner le repository :

```bash
git clone <repo_url>
cd HealthTrack
```

2. Créer le fichier `.env` avec les variables :

```bash
# Profile
MONGO_URI=mongodb://mongo:27017/healthtrack

# Device
INFLUX_URL=http://influxdb:8086
INFLUX_TOKEN=my-token
INFLUX_ORG=my-org
INFLUX_BUCKET=iot_data
POSTGRES_URL=postgresql://user:pass@db:5432/healthtrack

# Planification & SuiviTraitement
POSTGRES_URL=postgresql://user:pass@db:5432/healthtrack
```

3. Lancer les services :

```bash
docker-compose up --build
```

* Profile → `http://localhost:3000`
* Device → `http://localhost:8000`
* InfluxDB → `http://localhost:8086`
* Planification → `http://localhost:8082`
* SuiviTraitement → `http://localhost:8002`



```mermaid
classDiagram
    class Profile {
        - int id
        - string nom
        - string email
        - string role
        - string maladieChronique
        - string Password
        + createProfile(nom, email, role)
        + getProfile(id)
        + updateProfile(id, data)
        + deleteProfile(id)
        + authenticate(email, password)
    }

    class Device {
        - int deviceId
        - string typeCapteur
        - string statut
        - float derniereValeur
        - datetime derniereLecture
        + collectData(deviceId, valeur)
        + analyzeData(deviceId)
        + sendAlert(patientId, message)
        + registerDevice(patientId, typeCapteur)
    }

    class Planification {
        - int rdvId
        - int patientId
        - int doctorId
        - datetime dateRdv
        - string statut
        + scheduleAppointment(patientId, doctorId, dateRdv)
        + getAppointments(patientId)
        + cancelAppointment(rdvId)
        + updateAppointment(rdvId, nouvelleDate)
    }

    class SuiviTraitement {
        - int traitementId
        - int patientId
        - string medicament
        - datetime dateDebut
        - datetime dateFin
        - bool suiviCorrect
        + createTreatment(patientId, medicament, posologie, dateDebut, dateFin)
        + getTreatments(patientId)
        + validateDose(traitementId, datePrise)
        + sendReminder(patientId)
    }

    %% Relations avec verbes d'action + cardinalités
    Profile "1" --> "0..*" Device : associer / recevoir données
    Profile "1" --> "0..*" Planification : planifier / gérer rendez-vous
    Profile "1" --> "0..*" SuiviTraitement : superviser / organiser traitements

    %%Device "1" --> "1" Profile : identifier / patient
    Device "1" --> "0..*" Planification : envoyer / notifications
    Device "1" --> "0..*" SuiviTraitement : utiliser / informations de traitement

    %%Planification "1" --> "1" Profile : consulter / profil patient
    %%Planification "1" --> "0..*" Device : utiliser / données médicales
    %%Planification "1" --> "0..*" SuiviTraitement : ajuster / traitements

    %%SuiviTraitement "1" --> "1" Profile : référencer / patient
    %%SuiviTraitement "1" --> "0..*" Device : exploiter / constantes vitales
    SuiviTraitement "1" --> "0..*" Planification : coordonner / rendez-vous
