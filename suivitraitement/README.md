README – Suivi Patients API
Description

Suivi Patients est une application Spring Boot permettant la gestion et le suivi des traitements médicaux des patients.
Elle offre une API REST complète pour créer, consulter, modifier et supprimer des traitements, ainsi que suivre les doses et envoyer des rappels.

Stack Technique

Java 17

Spring Boot 3.5.x

Spring Web

Spring Data JPA

Validation Jakarta

PostgreSQL 17

Docker & Docker Compose

Lombok

Maven

📂 Structure du projet
Suivi-Patients/
│
├── src/main/java/com/example/suivipatients/
│   ├── controllers/         → API REST
│   ├── models/              → Entités JPA
│   ├── repositories/        → DAO / JPA Repositories
│   ├── services/            → Logique métier
│   └── dto/                 → Objets de transfert de données
│
├── src/main/resources/
│   ├── application.properties
│   └── static / templates   (si besoin pour une future UI)
│
├── Dockerfile
├── docker-compose.yml
└── README.md

🐳 Déploiement avec Docker
1️⃣ Prérequis

Assurez-vous d’avoir installé :

Docker

Docker Compose

Maven

2️⃣ Construction et lancement

Dans le répertoire du projet :

docker-compose up --build


Cela va :

Lancer un conteneur PostgreSQL (port 5433 localement)

Lancer le conteneur Spring Boot sur le port 8002

3️⃣ Variables d’environnement

Dans docker-compose.yml, tu peux configurer :

Variable	Valeur par défaut	Description
SPRING_DATASOURCE_URL	jdbc:postgresql://postgres:5432/suivipatients	URL JDBC de la base
SPRING_DATASOURCE_USERNAME	postgres	Utilisateur PostgreSQL
SPRING_DATASOURCE_PASSWORD	postgres	Mot de passe PostgreSQL
SPRING_JPA_HIBERNATE_DDL_AUTO	update	Auto création/mise à jour du schéma
SERVER_PORT	8002	Port HTTP de l’application
🧩 Exemple de configuration application.properties
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5433/suivipatients}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:postgres}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:postgres}

spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:update}
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

server.port=${SERVER_PORT:8002}

🚀 API REST Endpoints
📌 Base URL
http://localhost:8002/treatments

1️⃣ Créer un traitement

POST /treatments

Body JSON :

{
"patientId": 1,
"medicament": "Paracétamol",
"dosage": "500mg",
"frequence": "3 fois par jour",
"dateDebut": "2025-10-29T08:00:00",
"dateFin": "2025-11-05T08:00:00",
"instructions": "Prendre après le repas"
}


Réponse : 201 Created

2️⃣ Lister tous les traitements

GET /treatments

Réponse :

[
{
"id": 1,
"patientId": 1,
"medicament": "Paracétamol",
"dosage": "500mg",
"frequence": "3 fois par jour"
}
]

3️⃣ Lister les traitements d’un patient

GET /treatments?patientId=1

4️⃣ Lister les traitements actifs

GET /treatments/active

5️⃣ Mettre à jour un traitement

PUT /treatments/{id}

Body JSON :

{
"medicament": "Ibuprofène",
"dosage": "400mg",
"frequence": "2 fois par jour",
"dateDebut": "2025-10-30T08:00:00",
"dateFin": "2025-11-10T08:00:00",
"instructions": "Prendre avec de l’eau",
"suiviCorrect": true
}

6️⃣ Supprimer un traitement

DELETE /treatments/{id}
Réponse : 204 No Content

7️⃣ Valider une dose prise

POST /treatments/{id}/validate-dose

Body JSON :

{
"datePrise": "2025-10-30T09:00:00"
}

8️⃣ Envoyer un rappel de dose

POST /treatments/{id}/send-reminder

9️⃣ Statistiques générales

GET /treatments/stats

Réponse :

{
"activeTreatments": 5,
"treatmentsWithProblems": 2
}

🧪 Tests avec Postman

Tu peux tester l’API avec Postman
.

👉 Tous les endpoints sont publics (aucune authentification requise).
Vérifie que ton serveur tourne bien sur http://localhost:8002.

🛠️ Build manuel (hors Docker)
mvn clean package -DskipTests
java -jar target/suivipatients-0.0.1-SNAPSHOT.jar

🧑‍💻 Auteur

HAMZA ERRADI
Projet : Suivi Patients – Gestion des traitements médicaux
Technologies : Spring Boot / PostgreSQL / Docker