# 🩺 Suivi Patients - API de Suivi de Traitements Médicaux

Ce projet est une API REST développée avec **Spring Boot 3**, permettant de gérer le **suivi des traitements médicaux des patients** : création, mise à jour, suppression, validation de doses et statistiques.

---

## Fonctionnalités principales

- Création et gestion des traitements
- Récupération par patient ou statut
- Envoi de rappels
- Validation de doses
- Statistiques globales sur les traitements actifs et problématiques

---

## Architecture du projet

```bash
src/
 ├── main/
 │   ├── java/com/example/suivipatients/
 │   │   ├── controllers/      # Contrôleurs REST
 │   │   ├── models/           # Entités JPA
 │   │   ├── repositories/     # DAO Spring Data JPA
 │   │   ├── services/         # Logique métier
 │   │   └── dto/              # Objets de transfert (Request/Response)
 │   └── resources/
 │       ├── application.yml   # Configuration Spring Boot
 │       └── static/           # Ressources statiques éventuelles
 └── test/                     # Tests unitaires et d’intégration

```

Prérequis

Java 17+

Maven 3.8+

Docker + Docker Compose

Postman pour tester l’API


Configuration de la base de données

La base est PostgreSQL.
Par défaut :

Host : localhost

Port : 3307

Database : suivi_traitement

## Tests des endpoints (via Postman)

# Créer un traitement

POST http://localhost:8002/treatments

{
  "patientId": 1,
  "medicament": "Doliprane",
  "dosage": "300mg",
  "frequence": "2 fois par jour",
  "dateDebut": "2025-10-30T08:00:00",
  "dateFin": "2025-11-05T08:00:00",
  "instructions": "À prendre après les repas"
}

# Lister tous les traitements

GET http://localhost:8002/treatments

# Lister les traitements d’un patient

GET http://localhost:8002/treatments?patientId=1

# Lister les traitements actifs

GET http://localhost:8002/treatments/active

# Mettre à jour un traitement

PUT http://localhost:8002/treatments/1

{
  "medicament": "Ibuprofène",
  "dosage": "400mg",
  "frequence": "3 fois par jour",
  "dateDebut": "2025-10-30T08:00:00",
  "dateFin": "2025-11-10T08:00:00",
  "instructions": "À prendre avec un verre d’eau",
  "suiviCorrect": true
}

# Supprimer un traitement

DELETE http://localhost:8002/treatments/1

# Valider une dose

POST http://localhost:8002/treatments/1/validate-dose

{
  "datePrise": "2025-10-30T12:00:00"
}

# Envoyer un rappel

POST http://localhost:8002/treatments/1/send-reminder

# Obtenir les statistiques

GET http://localhost:8002/treatments/stats