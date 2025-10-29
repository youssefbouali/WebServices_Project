# HealthTrack – Plateforme de Suivi Médical Intelligent

## Description

HealthTrack est une application modulaire pour le **suivi médical des patients chroniques**.
Elle permet de gérer :

* Profils utilisateurs (patients, médecins, administrateurs)
* Appareils médicaux connectés (IoT)
* Planification des rendez-vous
* Suivi et rappels des traitements

L’architecture est **multi-module**, chaque service étant indépendant et exposant des API REST sécurisées pour l’interopérabilité.

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

### 1. Profile Module

* Gestion des utilisateurs et rôles
* Endpoints principaux :

  * `POST /profiles` – Créer un profil
  * `GET /profiles` – Lister les profils
  * `GET /profiles/{id}` – Récupérer un profil
  * `PUT /profiles/{id}` – Modifier un profil
  * `DELETE /profiles/{id}` – Supprimer un profil

### 2. Device Module

* Collecte et supervision des appareils connectés
* Intégration avec InfluxDB pour stockage des mesures
* Endpoints principaux :

  * `POST /devices` – Ajouter un appareil
  * `GET /devices` – Lister les appareils
  * `GET /devices/{id}` – Détails d’un appareil
  * `PUT /devices/{id}` – Mise à jour + enregistrement mesures
  * `DELETE /devices/{id}` – Supprimer un appareil
* CRUD direct sur les données InfluxDB via `write`, `query` et `delete`






Configurer les variables d’environnement dans `config.py` ou `.env` :

```python
DATABASE_URL=postgresql://device_user:device_pass@db:5432/device_db
INFLUX_URL=http://influxdb:8086
INFLUX_TOKEN=my-token
INFLUX_ORG=my-org
INFLUX_BUCKET=iot_data
```

Lancer les services via Docker Compose :

```bash
docker-compose up --build
```

* PostgreSQL : `localhost:5433`
* FastAPI : `http://localhost:8000`
* InfluxDB : `http://localhost:8086`

---

## Endpoints FastAPI

### CRUD Appareils (Devices)

| Méthode  | Endpoint               | Description                                            |
| -------- | ---------------------- | ------------------------------------------------------ |
| `POST`   | `/devices/`            | Créer un appareil                                      |
| `GET`    | `/devices/`            | Lister tous les appareils                              |
| `GET`    | `/devices/{device_id}` | Récupérer un appareil par ID                           |
| `PUT`    | `/devices/{device_id}` | Mettre à jour un appareil et envoyer valeur à InfluxDB |
| `DELETE` | `/devices/{device_id}` | Supprimer un appareil                                  |

### Données IoT

* Les mesures envoyées par les appareils sont automatiquement écrites dans InfluxDB via le endpoint `PUT /devices/{device_id}`.
* Exemple de champ écrit : `device_measurement,device_id=3 value=25.5`

---

## Exemple Postman

### Écrire une mesure IoT directement sur InfluxDB

**POST** : `http://localhost:8086/api/v2/write?org=my-org&bucket=iot_data&precision=s`
**Headers** :

```
Authorization: Token my-token
Content-Type: text/plain; charset=utf-8
```

**Body (raw text)** :

```
device_measurement,device_id=3 value=25.5
```

### Lire les mesures IoT

**POST** : `http://localhost:8086/api/v2/query?org=my-org`
**Headers** :

```
Authorization: Token my-token
Content-Type: application/json
```

**Body** :

```json
{
  "query": "from(bucket:\"iot_data\") |> range(start: -1h) |> filter(fn: (r) => r._measurement == \"device_measurement\")"
}
```


---

## Supprimer des données IoT dans InfluxDB


**POST** : `http://localhost:8086/api/v2/delete?org=my-org&bucket=iot_data`
**Headers** :

```
Authorization: Token my-token
Content-Type: application/json
```

**Body** :

```json
{
  "start": "1970-01-01T00:00:00Z",
  "stop": "2025-10-29T23:59:59Z",
  "predicate": "_measurement=\"device_measurement\" AND device_id='3'"
}
```

> Explication :
>
> * `start` et `stop` définissent la plage temporelle des données à supprimer.
> * `predicate` permet de filtrer les points exacts à supprimer, ici pour `device_id=3`.

---





### 3. Planification Module

* Gestion des rendez-vous
* Endpoints principaux :

  * `POST /appointments` – Créer un rendez-vous
  * `GET /appointments` – Lister tous les rendez-vous
  * `PUT /appointments/{id}` – Modifier un rendez-vous
  * `DELETE /appointments/{id}` – Supprimer un rendez-vous

### 4. SuiviTraitement Module

* Suivi des traitements médicaux et rappels
* Endpoints principaux :

  * `POST /treatments` – Ajouter un traitement
  * `GET /treatments` – Lister les traitements
  * `PUT /treatments/{id}` – Mettre à jour un traitement
  * `DELETE /treatments/{id}` – Supprimer un traitement

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

3. Lancer les services via Docker Compose :

```bash
docker-compose up --build
```

* Profile (Node.js) → `http://localhost:3000`
* MongoDB → `mongodb://localhost:27017`
* Device (FastAPI) → `http://localhost:8000`
* InfluxDB → `http://localhost:8086`
* Planification (Java Spring Boot) → `http://localhost:8080`
* SuiviTraitement (Java Spring Boot) → `http://localhost:8081`


