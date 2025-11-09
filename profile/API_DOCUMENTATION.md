# Profile Service API Documentation

## Base URL
`http://localhost:3000/api/profiles`

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### 1. Register User
**POST** `/auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "PATIENT",
  "phone": "+212600000000",
  "maladieChronique": "Diabète Type 2"
}
```

**Response:** `201 Created`
```json
{
  "profile": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "PATIENT",
    "phone": "+212600000000",
    "maladieChronique": "Diabète Type 2",
    "isActive": true,
    "createdAt": "2025-11-06T10:00:00.000Z",
    "updatedAt": "2025-11-06T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "profile": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Get Current Profile
**GET** `/me`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### 4. Update Current Profile
**PUT** `/me`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "firstName": "Jane",
  "phone": "+212611111111"
}
```

### 5. Change Password
**PUT** `/me/password`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### 6. List All Profiles (Admin Only)
**GET** `/`

**Headers:** `Authorization: Bearer <admin-token>`

**Query Parameters:**
- `role`: Filter by role (PATIENT, DOCTOR, ADMIN)
- `isActive`: Filter by active status (true/false)

**Example:** `/api/profiles?role=DOCTOR&isActive=true`

### 7. Get Profile by ID
**GET** `/:id`

**Headers:** `Authorization: Bearer <token>`

### 8. Update Profile (Admin Only)
**PUT** `/:id`

**Headers:** `Authorization: Bearer <admin-token>`

### 9. Delete Profile (Admin Only)
**DELETE** `/:id`

**Headers:** `Authorization: Bearer <admin-token>`

**Response:** `204 No Content`

### 10. Get Profiles by Role
**GET** `/role/:role`

**Headers:** `Authorization: Bearer <token>`

**Example:** `/api/profiles/role/DOCTOR`

### 11. Get Statistics (Admin Only)
**GET** `/statistics`

**Headers:** `Authorization: Bearer <admin-token>`

**Response:** `200 OK`
```json
{
  "total": 150,
  "patients": 120,
  "doctors": 25,
  "admins": 5,
  "active": 145
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email already exists"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Profile not found"
}
```

## Roles & Permissions

- **PATIENT**: Can view and update their own profile
- **DOCTOR**: Can view patients and their own profile
- **ADMIN**: Full access to all endpoints

## Testing with Postman

1. Register a new user
2. Copy the token from the response
3. Use the token in subsequent requests
4. Test different roles by creating users with different role values

## Environment Variables

Required environment variables:
- `MONGO_URL`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 3000)
*/