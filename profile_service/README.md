# Profile Service

A TypeScript-based microservice for managing user profiles in the HealthTrack system. Built with TypeORM, MongoDB, and follows clean architecture principles.

## Features

- **User Profile Management**: Create, read, update, and delete user profiles
- **Role-Based Profiles**: Support for Patient, Doctor, and Admin roles
- **Email Validation**: Ensures unique email addresses with validation
- **Type Safety**: Built with TypeScript for compile-time type checking
- **Comprehensive Testing**: Unit and integration tests with Jest

## Tech Stack

- **Node.js** v20.19.4
- **TypeScript** 5.6.3
- **TypeORM** 0.3.20 - ORM for MongoDB
- **MongoDB** 5.9.2 - Database
- **Jest** 29.7.0 - Testing framework
- **class-validator** - Entity validation
- **class-transformer** - Object transformation

## Project Structure

```
profile_service/
├── src/
│   ├── entities/
│   │   └── Profile.ts              # Profile entity with validation
│   ├── services/
│   │   ├── ProfileService.ts       # Business logic
│   │   ├── ProfileService.unit.test.ts    # Unit tests
│   │   └── ProfileService.int.test.ts     # Integration tests
│   ├── data-source.ts              # TypeORM DataSource configuration
│   └── index.ts                    # Application entry point
├── jest.config.js                  # Jest configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies and scripts
```

## Installation

### Prerequisites

- Node.js v20 or higher
- MongoDB instance (local or remote)

### Setup

1. **Clone and navigate to the service:**
   ```bash
   cd profile_service
   ```

2. **Install dependencies:**
   ```powershell
   # Clear npm cache
   npm cache clean --force

   # Install production dependencies
   npm install typeorm@0.3.20 mongodb@5.9.2 reflect-metadata@0.1.13 class-validator@0.14.0 class-transformer@0.5.1 --save --legacy-peer-deps

   # Install dev dependencies
   npm install -D typescript@5.6.3 ts-node@10.9.2 jest@29.7.0 ts-jest@29.1.1 @types/jest@29.5.12 --legacy-peer-deps

   # Install mongodb-memory-server for testing (skip postinstall)
   npm install -D mongodb-memory-server@10.1.4 --legacy-peer-deps --ignore-scripts
   ```

3. **Download MongoDB binary for tests (first time only):**
   ```powershell
   npx mongodb-memory-server-download
   ```
   *Note: This downloads ~592MB and is cached for future test runs.*

4. **Configure environment variables:**
   Create a `.env` file in the root:
   ```env
   MONGO_URL=mongodb://localhost:27017/healthtrack
   PORT=3001
   ```

## Usage

### Development Mode

```bash
npm run start:dev
```

### Production Build

```bash
# Build TypeScript to JavaScript
npm run build

# Run production build
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm test -- ProfileService.unit.test.ts

# Run with verbose output
npm test -- --verbose

# Run with coverage
npm test -- --coverage
```

**Note:** Integration tests may timeout on first run while MongoDB binary downloads. After the initial download, tests run quickly.

## API Reference

### ProfileService

The main service class for profile operations.

#### Methods

##### `create(input: CreateProfileInput): Promise<Profile>`
Creates a new profile with validation.

**Parameters:**
- `email` (string, required): Unique email address
- `firstName` (string, required): User's first name
- `lastName` (string, required): User's last name
- `role` (ProfileRole, required): One of `PATIENT`, `DOCTOR`, or `ADMIN`
- `phone` (string, optional): Contact phone number

**Throws:** 
- Error if email already exists
- Validation error if data is invalid

**Example:**
```typescript
const profile = await profileService.create({
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: ProfileRole.Patient,
  phone: '+1234567890'
});
```

##### `getByEmail(email: string): Promise<Profile | null>`
Retrieves a profile by email address.

**Returns:** Profile object or null if not found

**Example:**
```typescript
const profile = await profileService.getByEmail('john.doe@example.com');
```

##### `listByRole(role?: ProfileRole): Promise<Profile[]>`
Lists all profiles, optionally filtered by role.

**Parameters:**
- `role` (ProfileRole, optional): Filter by specific role

**Returns:** Array of profiles

**Example:**
```typescript
// Get all doctors
const doctors = await profileService.listByRole(ProfileRole.Doctor);

// Get all profiles
const allProfiles = await profileService.listByRole();
```

##### `updateEmail(id: string, newEmail: string): Promise<Profile>`
Updates a profile's email address.

**Parameters:**
- `id` (string): Profile ObjectId as string
- `newEmail` (string): New email address (must be valid)

**Throws:** 
- Error if profile not found
- Validation error if email is invalid

**Example:**
```typescript
const updated = await profileService.updateEmail('507f1f77bcf86cd799439011', 'new.email@example.com');
```

##### `remove(id: string): Promise<void>`
Deletes a profile by ID.

**Parameters:**
- `id` (string): Profile ObjectId as string

**Example:**
```typescript
await profileService.remove('507f1f77bcf86cd799439011');
```

## Data Models

### Profile Entity

```typescript
{
  id: ObjectId;           // MongoDB ObjectId
  email: string;          // Unique, validated email
  firstName: string;      // Required
  lastName: string;       // Required
  role: ProfileRole;      // PATIENT | DOCTOR | ADMIN
  phone?: string;         // Optional
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

## Testing Strategy

### Unit Tests
- Mock repository to test business logic in isolation
- Fast execution (~32 seconds)
- Located in `ProfileService.unit.test.ts`

### Integration Tests
- Use `mongodb-memory-server` for real MongoDB instance
- Test actual database operations
- Located in `ProfileService.int.test.ts`
- First run requires MongoDB binary download (~592MB)

## Configuration

### TypeORM DataSource

```typescript
{
  type: 'mongodb',
  url: process.env.MONGO_URL ?? 'mongodb://localhost:27017/healthtrack',
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,  // Dev only - use migrations in production
  logging: false,
  entities: [Profile]
}
```

### Jest Configuration

```javascript
{
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js', 'json']
}
```

## Troubleshooting

### MongoDB Memory Server Issues

If you encounter "Exceeded timeout" errors during tests:

1. **Increase timeout in test file:**
   ```typescript
   jest.setTimeout(120000); // 2 minutes
   ```

2. **Pre-download MongoDB binary:**
   ```powershell
   npx mongodb-memory-server-download
   ```

3. **Disable postinstall (Windows):**
   ```powershell
   setx MONGOMS_DISABLE_POSTINSTALL 1
   ```

### Node Modules Cleanup

If you encounter permission errors:

```powershell
# Stop Node processes
taskkill /F /IM node.exe

# Remove node_modules
Remove-Item -Recurse -Force node_modules

# Reinstall
npm install --legacy-peer-deps
```

### TypeORM Connection Issues

Ensure MongoDB is running:

```bash
# Check if MongoDB is running
mongo --eval "db.adminCommand('ping')"

# Or start MongoDB
mongod --dbpath /path/to/data
```

## Dependencies

### Production
- `typeorm@0.3.20` - TypeORM framework
- `mongodb@5.9.2` - MongoDB driver
- `reflect-metadata@0.1.13` - Metadata reflection API
- `class-validator@0.14.0` - Decorator-based validation
- `class-transformer@0.5.1` - Object transformation

### Development
- `typescript@5.6.3` - TypeScript compiler
- `ts-node@10.9.2` - TypeScript execution engine
- `jest@29.7.0` - Testing framework
- `ts-jest@29.1.1` - Jest TypeScript preprocessor
- `@types/jest@29.5.12` - Jest type definitions
- `mongodb-memory-server@10.1.4` - In-memory MongoDB for testing

## Best Practices

1. **Always validate input** using class-validator decorators
2. **Use TypeScript types** for compile-time safety
3. **Handle errors gracefully** in service methods
4. **Write both unit and integration tests**
5. **Use environment variables** for configuration
6. **Keep business logic in services**, not entities
7. **Use unique indexes** for email fields

## Future Enhancements

- [ ] Add pagination to `listByRole` method
- [ ] Implement profile search functionality
- [ ] Add profile avatar/image support
- [ ] Implement soft delete functionality
- [ ] Add audit logging for profile changes
- [ ] Create REST API endpoints
- [ ] Add GraphQL support
- [ ] Implement caching layer (Redis)
- [ ] Add profile verification workflow
- [ ] Create admin dashboard

## Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Use conventional commit messages
4. Update documentation for API changes

## License

Private - HealthTrack WebServices Project

## Support

For issues or questions, contact the development team.

---

**Last Updated:** October 29, 2025  
**Version:** 1.0.0  
**Node Version:** 20.19.4