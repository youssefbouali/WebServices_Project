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
| **Planification**    | Java + Spring Boot      | SQLServer                           |
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

**Gestion des utilisateurs et rôles**

### Endpoints principaux

#### 1.1. Register a new profile

```http
POST /auth/register
Content-Type: application/json
```

Request JSON :

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

Response JSON :

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

#### 1.2. Login

```http
POST /auth/login
Content-Type: application/json
```

Request JSON :

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

Response JSON :

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

#### 1.3. Get current profile

```http
GET /profiles/me
Headers: Authorization: Bearer <token>
```

Response JSON :

```json
{
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
}
```

---

#### 1.4. Update current profile

```http
PUT /profiles/me
Headers: Authorization: Bearer <token>
Content-Type: application/json
```

Request JSON :

```json
{
  "firstName": "Johnny",
  "phone": "0698765432"
}
```

Response JSON :

```json
{
  "id": "64f7c2e1a1b2c3d4e5f6a7b8",
  "email": "john.doe@example.com",
  "firstName": "Johnny",
  "lastName": "Doe",
  "role": "PATIENT",
  "phone": "0698765432",
  "maladieChronique": "Diabetes",
  "isActive": true,
  "createdAt": "2025-11-06T23:00:00.000Z",
  "updatedAt": "2025-11-06T23:30:00.000Z"
}
```

---

#### 1.5. Change password

```http
PUT /profiles/me/password
Headers: Authorization: Bearer <token>
Content-Type: application/json
```

Request JSON :

```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

Response JSON :

```json
{
  "message": "Password updated successfully"
}
```

---

#### 1.6. List all profiles

```http
GET /profiles?role=PATIENT&isActive=true
```

Response JSON :

```json
[
  {
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
  }
]
```

---

#### 1.7. List profiles by role

```http
GET /profiles/role/DOCTOR
```

Response JSON :

```json
[
  {
    "id": "64f7c2e1a1b2c3d4e5f6a7c9",
    "email": "dr.smith@example.com",
    "firstName": "Alice",
    "lastName": "Smith",
    "role": "DOCTOR",
    "phone": "0654321098",
    "maladieChronique": null,
    "isActive": true,
    "createdAt": "2025-11-05T12:00:00.000Z",
    "updatedAt": "2025-11-05T12:00:00.000Z"
  }
]
```

---

#### 1.8. Get profile by ID

```http
GET /profiles/{id}
```

Response JSON :

```json
{
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
}
```

---

#### 1.9. Update profile by ID

```http
PUT /profiles/{id}
Content-Type: application/json
```

Request JSON :

```json
{
  "firstName": "Jonathan",
  "isActive": false
}
```

Response JSON :

```json
{
  "id": "64f7c2e1a1b2c3d4e5f6a7b8",
  "email": "john.doe@example.com",
  "firstName": "Jonathan",
  "lastName": "Doe",
  "role": "PATIENT",
  "phone": "0612345678",
  "maladieChronique": "Diabetes",
  "isActive": false,
  "createdAt": "2025-11-06T23:00:00.000Z",
  "updatedAt": "2025-11-06T23:45:00.000Z"
}
```

---

#### 1.10. Delete profile by ID

```http
DELETE /profiles/{id}
```

Response : **204 No Content**

---

#### 1.11. Profile statistics

```http
GET /profiles/statistics
```

Response JSON :

```json
{
  "totalProfiles": 42,
  "activeProfiles": 37,
  "rolesCount": {
    "PATIENT": 25,
    "DOCTOR": 12,
    "ADMIN": 5
  }
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


**Gestion des appareils médicaux connectés (IoT)**

### 2.1. Get all devices

```http
GET /devices
```

Query Parameters (optionnels) :

* `skip` (int) – nombre de résultats à ignorer
* `limit` (int) – nombre maximal de résultats

Response JSON :

```json
[
  {
    "id": 1,
    "name": "Temperature Sensor",
    "type": "sensor",
    "status": "active",
    "last_value": 23.5,
    "last_reading": "2025-11-06T23:55:00.123456"
  },
  {
    "id": 2,
    "name": "Humidity Sensor",
    "type": "sensor",
    "status": "inactive",
    "last_value": 50.2,
    "last_reading": "2025-11-06T22:30:10.123456"
  }
]
```

---

### 2.2. Get a device by ID

```http
GET /devices/{device_id}
```

Response JSON :

```json
{
  "id": 1,
  "name": "Temperature Sensor",
  "type": "sensor",
  "status": "active",
  "last_value": 23.5,
  "last_reading": "2025-11-06T23:55:00.123456"
}
```

If not found:

```json
{
  "detail": "Device not found"
}
```

---

### 2.3. Create a new device

```http
POST /devices
Content-Type: application/json
```

Request JSON :

```json
{
  "name": "Pressure Sensor",
  "type": "sensor"
}
```

Response JSON :

```json
{
  "id": 3,
  "name": "Pressure Sensor",
  "type": "sensor",
  "status": "inactive",
  "last_value": 0.0,
  "last_reading": "2025-11-06T23:57:00.123456"
}
```

---

### 2.4. Update a device

```http
PUT /devices/{device_id}
Content-Type: application/json
```

Request JSON (seulement les champs à mettre à jour) :

```json
{
  "status": "active",
  "last_value": 75.3
}
```

Response JSON :

```json
{
  "id": 3,
  "name": "Pressure Sensor",
  "type": "sensor",
  "status": "active",
  "last_value": 75.3,
  "last_reading": "2025-11-06T23:58:00.123456"
}
```

If device not found:

```json
{
  "detail": "Device not found"
}
```

---

### 2.5. Delete a device

```http
DELETE /devices/{device_id}
```

Response JSON (deleted device info) :

```json
{
  "id": 3,
  "name": "Pressure Sensor",
  "type": "sensor",
  "status": "active",
  "last_value": 75.3,
  "last_reading": "2025-11-06T23:58:00.123456"
}
```

If device not found:

```json
{
  "detail": "Device not found"
}
```

---

### 2.6. IoT Data (InfluxDB)

**Écrire une mesure :**

```http
POST http://localhost:8086/api/v2/write?org=my-org&bucket=iot_data&precision=s
Headers:
Authorization: Token my-token
Content-Type: text/plain; charset=utf-8
```

Body (raw text) :

```
device_measurement,device_id=3 value=25.5
```

---

**Lire les mesures :**

```http
POST http://localhost:8086/api/v2/query?org=my-org
Headers:
Authorization: Token my-token
Content-Type: application/json
```

Request JSON :

```json
{
  "query": "from(bucket:\"iot_data\") |> range(start: -1h) |> filter(fn: (r) => r._measurement == \"device_measurement\")"
}
```

---

**Supprimer des données :**

```http
POST http://localhost:8086/api/v2/delete?org=my-org&bucket=iot_data
Headers:
Authorization: Token my-token
Content-Type: application/json
```

Request JSON :

```json
{
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

### 3.1. Schedule a new appointment

```http
POST /api/appointments/schedule
Content-Type: application/json
```

Request JSON :

```json
{
  "patientId": 1,
  "doctorId": 2,
  "dateRdv": "2025-11-10T14:30:00"
}
```

Response JSON :

```json
{
  "rdvId": 101,
  "patientId": 1,
  "doctorId": 2,
  "dateRdv": "2025-11-10T14:30:00",
  "statut": "confirmé"
}
```

---

### 3.2. Get all appointments for a patient

```http
GET /api/appointments/patient/{patientId}
```

Response JSON :

```json
[
  {
    "rdvId": 101,
    "patientId": 1,
    "doctorId": 2,
    "dateRdv": "2025-11-10T14:30:00",
    "statut": "confirmé"
  },
  {
    "rdvId": 102,
    "patientId": 1,
    "doctorId": 3,
    "dateRdv": "2025-11-15T10:00:00",
    "statut": "confirmé"
  }
]
```

---

### 3.3. Cancel an appointment

```http
PUT /api/appointments/cancel/{rdvId}
```

Response : HTTP 200 OK

---

### 3.4. Update an appointment

```http
PUT /api/appointments/update/{rdvId}?nouvelleDate=2025-11-12T16:00:00
```

Response JSON :

```json
{
  "rdvId": 101,
  "patientId": 1,
  "doctorId": 2,
  "dateRdv": "2025-11-12T16:00:00",
  "statut": "confirmé"
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

### 4.1. Create Treatment

```http
POST /treatments
Content-Type: application/json
```

Request JSON :

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

Response JSON :

```json
{
  "id": 1,
  "patientId": 1,
  "medicament": "Paracetamol",
  "dosage": "500mg",
  "frequence": "Twice a day",
  "dateDebut": "2025-11-06T09:00:00",
  "dateFin": "2025-11-10T09:00:00",
  "instructions": "Take after meals",
  "suiviCorrect": true,
  "statut": "ACTIF",
  "createdAt": "2025-11-06T23:00:00",
  "updatedAt": "2025-11-06T23:00:00"
}
```

---

### 4.2. Get All Treatments

```http
GET /treatments
```

Response JSON : tableau de traitements (format identique à 4.1)

---

### 4.3. Get Treatments by Patient

```http
GET /treatments?patientId=1
```

Response JSON : filtré par patientId (format identique à 4.1)

---

### 4.4. Get Active Treatments

```http
GET /treatments/active
```

Response JSON : uniquement traitements avec `"statut": "ACTIF"`

---

### 4.5. Update Treatment

```http
PUT /treatments/{id}
Content-Type: application/json
```

Request JSON :

```json
{
  "medicament": "Ibuprofen",
  "dosage": "200mg",
  "frequence": "Three times a day",
  "dateDebut": "2025-11-06T09:00:00",
  "dateFin": "2025-11-12T09:00:00",
  "instructions": "Take after meals",
  "suiviCorrect": false
}
```

Response JSON : objet traitement mis à jour

---

### 4.6. Delete Treatment

```http
DELETE /treatments/{id}
```

Response : 204 No Content

---

### 4.7. Validate Dose

```http
POST /treatments/{id}/validate-dose
Content-Type: application/json
```

Request JSON :

```json
{
  "datePrise": "2025-11-06T10:00:00"
}
```

Response : 200 OK

---

### 4.8. Send Reminder

```http
POST /treatments/{id}/send-reminder
```

Response : 200 OK

---

### 4.9. Get Statistics

```http
GET /treatments/stats
```

Response JSON :

```json
{
  "activeTreatments": 5,
  "treatmentsWithProblems": 2
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

# Planification
SPRING_DATASOURCE_URL: jdbc:sqlserver://db:1433;databaseName=master;encrypt=true;trustServerCertificate=true;

# SuiviTraitement
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
