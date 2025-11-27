## Points d'accès API

| Méthode | Endpoint | Description | Corps de la requête | 
|--------|----------|-------------|---------------------|
| `POST` | `/api/appointments/schedule` | **Planifier un nouveau rendez-vous médical** | ```json { "patientId": 1, "doctorId": 2, "dateRdv": "2025-11-05 10:30" } ``` |
| `GET`  | `/api/appointments/patient/{patientId}` | **Récupérer tous les rendez-vous d’un patient** | *(aucun)* |
| `PUT`  | `/api/appointments/cancel/{rdvId}` | **Annuler un rendez-vous existant** | *(aucun)* |
| `PUT`  | `/api/appointments/update/{rdvId}?nouvelleDate=YYYY-MM-DD HH:mm` | **Modifier la date et l’heure d’un rendez-vous** | *(aucun)* |

## Configuration / Environment

Set allowed CORS origins via the environment variable `CORS_ALLOWED_ORIGINS` (comma-separated). Example in `.env`:

```
CORS_ALLOWED_ORIGINS=http://localhost:5000,http://localhost:3000,http://frontend_service:8080
```