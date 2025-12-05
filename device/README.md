# Device Module API

## Description

Device Module est une API REST développée avec **FastAPI** pour gérer des appareils IoT. Elle permet :

* Gestion complète des appareils (`CRUD`) dans **PostgreSQL**.
* Enregistrement des données IoT envoyées par les appareils dans **InfluxDB**.
* Consultation et lecture des mesures IoT via l'API.
* Intégration facile avec un frontend ou un tableau de bord.

---

## Technologies

* **Backend** : Python, FastAPI
* **Base de données relationnelle** : PostgreSQL
* **Base de données time-series** : InfluxDB 2.x
* **Docker & Docker Compose** : pour déploiement et orchestration

---

## Installation

1. Cloner le repository :

```bash
git clone <repo_url>
cd device-module
```

2. Configurer les variables d'environnement dans `config.py` ou `.env` :

```python
DATABASE_URL=postgresql://device_user:device_pass@db:5432/device_db
INFLUX_URL=http://influxdb:8086
INFLUX_TOKEN=my-token
INFLUX_ORG=my-org
INFLUX_BUCKET=iot_data
```

3. Lancer les services via Docker Compose :

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

## Testing and Quality Assurance

### Installation des dépendances de test

```bash
# Install production dependencies
pip install -r requirements.txt

# Install development/testing dependencies
pip install -r requirements-dev.txt
```

### Tests unitaires avec Coverage.py

Le projet utilise **pytest** avec **coverage.py** pour les tests et l'analyse de couverture de code.

#### Exécuter les tests avec couverture

**Linux/Mac:**
```bash
./run_tests.sh
```

**Windows:**
```bash
run_tests.bat
```

**Ou manuellement:**
```bash
pytest --cov=app --cov-report=html --cov-report=term-missing
```

#### Voir le rapport de couverture

Après l'exécution des tests, ouvrez `htmlcov/index.html` dans votre navigateur pour voir le rapport détaillé de couverture.

```bash
# Le rapport HTML est généré dans htmlcov/
open htmlcov/index.html  # Mac
start htmlcov/index.html  # Windows
```

### Tests de charge avec Locust

**Locust** est utilisé pour les tests de performance et de charge de l'API.

#### Démarrer Locust

```bash
locust -f locustfile.py --host=http://localhost:8000
```

Ensuite, ouvrez votre navigateur à `http://localhost:8089` pour accéder à l'interface web de Locust.

#### Scénarios de test disponibles

* **DeviceAPIUser**: Simule des utilisateurs normaux effectuant des opérations CRUD
  * Création, lecture, mise à jour et suppression d'appareils
  * Distribution de tâches pondérée (lecture plus fréquente que création)
  
* **AdminUser**: Simule des administrateurs effectuant des opérations en masse
  * Listage de tous les appareils
  * Vérifications de santé de l'API

#### Exemple de commande Locust en mode headless

```bash
locust -f locustfile.py --host=http://localhost:8000 --users 10 --spawn-rate 2 --run-time 1m --headless
```

### Analyse de qualité du code avec Pylint

**Pylint** est configuré pour analyser la qualité du code Python.

#### Exécuter Pylint

**Linux/Mac:**
```bash
./run_lint.sh
```

**Windows:**
```bash
run_lint.bat
```

**Ou manuellement:**
```bash
pylint app/
```

#### Score minimum

Le projet est configuré avec un score minimum de **7.0/10**. La configuration Pylint est adaptée aux projets FastAPI (voir `.pylintrc`).

---

## Docker

* Le projet inclut `docker-compose.yml` pour orchestrer :

  * `device-app` (FastAPI)
  * `db` (PostgreSQL)
  * `influxdb` (InfluxDB 2.x)

* Les volumes pour persistance sont définis pour PostgreSQL et InfluxDB.

---