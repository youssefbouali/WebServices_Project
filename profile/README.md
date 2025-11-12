# Profile Service

A TypeScript-based microservice for managing user profiles in the HealthTrack system. Built with TypeORM, MongoDB, and follows clean architecture principles.

## Features

* **User Profile Management**: Create, read, update, and delete user profiles
* **Role-Based Profiles**: Support for Patient, Doctor, and Admin roles
* **Email Validation**: Ensures unique email addresses with validation
* **Type Safety**: Built with TypeScript for compile-time type checking
* **Comprehensive Testing**: Unit and integration tests with Jest

## Tech Stack

* **Node.js** v20.19.4
* **TypeScript** 5.6.3
* **TypeORM** 0.3.20 - ORM for MongoDB
* **MongoDB** 5.9.2 - Database
* **Jest** 29.7.0 - Testing framework
* **class-validator** - Entity validation
* **class-transformer** - Object transformation

## Project Structure

```
profile_service/
├── src/
│   ├── entities/
│   │   └── Profile.ts              # Profile entity with validation
│   ├── controllers/
│   │   └── ProfileController.ts    # Handles HTTP requests
│   ├── services/
│   │   ├── ProfileService.ts       # Business logic
│   │   ├── ProfileService.unit.test.ts    # Unit tests
│   │   └── ProfileService.int.test.ts     # Integration tests
│   ├── data-source.ts              # TypeORM DataSource configuration
│   ├── middleware/
│   │   └── auth.middleware.ts      # JWT auth and role authorization
│   └── index.ts                    # Application entry point
├── jest.config.js                  # Jest configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies and scripts
```

## Installation

### Prerequisites

* Node.js v20 or higher
* MongoDB instance (local or remote)

### Setup

```bash
cd profile_service
```

**Install dependencies:**

```powershell
npm cache clean --force
npm install typeorm@0.3.20 mongodb@5.9.2 reflect-metadata@0.1.13 class-validator@0.14.0 class-transformer@0.5.1 --save --legacy-peer-deps
npm install -D typescript@5.6.3 ts-node@10.9.2 jest@29.7.0 ts-jest@29.1.1 @types/jest@29.5.12 --legacy-peer-deps
npm install -D mongodb-memory-server@10.1.4 --legacy-peer-deps --ignore-scripts
```

**Download MongoDB binary for tests (first time only):**

```powershell
npx mongodb-memory-server-download
```

**Configure environment variables:**

```env
MONGO_URL=mongodb://localhost:27017/healthtrack
PORT=3001
JWT_SECRET=your_jwt_secret_here
```

## Usage

### Development Mode

```bash
npm run start:dev
```

### Production Build

```bash
npm run build
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm test -- ProfileService.unit.test.ts

# Run only integration tests
npm test -- ProfileService.int.test.ts

# Run with verbose output
npm test -- --verbose

# Run with coverage
npm test -- --coverage
```

## API Endpoints

### Public Endpoints

| Method | URL              | Description                                     |
| ------ | ---------------- | ----------------------------------------------- |
| POST   | `/auth/register` | Register a new profile (Patient, Doctor, Admin) |
| POST   | `/auth/login`    | Authenticate and obtain JWT token               |

### Authenticated Endpoints (JWT required)

| Method | URL            | Description                                    |
| ------ | -------------- | ---------------------------------------------- |
| GET    | `/me`          | Get current logged-in user profile             |
| PUT    | `/me`          | Update current user profile info               |
| PUT    | `/me/password` | Change current user password                   |
| GET    | `/role/:role`  | List profiles by role (Patient, Doctor, Admin) |
| GET    | `/:id`         | Get a profile by ID                            |

### Admin-Only Endpoints (JWT + Admin role required)

| Method | URL           | Description                |
| ------ | ------------- | -------------------------- |
| GET    | `/`           | List all profiles          |
| GET    | `/statistics` | Get statistics on profiles |
| PUT    | `/:id`        | Update a profile by ID     |
| DELETE | `/:id`        | Delete a profile by ID     |

## Data Models

### Profile Entity

```typescript
{
  id: ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  role: ProfileRole;
  phone?: string;
}
```

### ProfileRole Enum

```typescript
enum ProfileRole {
  Patient = 'PATIENT',
  Doctor = 'DOCTOR',
  Admin = 'ADMIN'
}
```

## Best Practices

1. Validate all inputs (`class-validator`)
2. Use TypeScript types for compile-time safety
3. Handle errors gracefully
4. Write both unit and integration tests
5. Use environment variables for configuration
6. Keep business logic in services
7. Ensure unique indexes for email

## Future Enhancements

* Pagination for `listByRole`
* Profile search functionality
* Avatar/image support
* Soft delete functionality
* Audit logging
* GraphQL support
* Caching layer (Redis)
* Profile verification workflow
* Admin dashboard

## Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Use conventional commit messages
4. Update documentation for API changes

## License

Private - HealthTrack WebServices Project

## Support

Contact the development team for issues or questions.

**Last Updated:** November 7, 2025
**Version:** 1.0.0
**Node Version:** 20.19.4



<!-- .\test-profile-api.ps1 -->