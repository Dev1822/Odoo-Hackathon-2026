# EcoSphere Gamification Module Backend

This is the backend implementation for the Gamification module of EcoSphere.

## Getting Started

### Prerequisites
- Node.js (v16+)
- MySQL database instance

### Setup
1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the Environment Variables:
   Create a `.env` file in the `backend/` directory by copying the structure of `.env.example` and filling in your credentials.

4. Run Database Migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Seed the Database:
   ```bash
   npm run prisma:seed
   ```

6. Start Development Server:
   ```bash
   npm run dev
   ```

7. Run Tests:
   ```bash
   npm test
   ```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server listening port | `5000` |
| `NODE_ENV` | Environment name | `development` |
| `DATABASE_URL` | MySQL connection string for Prisma | `mysql://root:password@localhost:3306/EcoSphere` |
| `JWT_SECRET` | Secret key for JWT signing | `secret` |
| `JWT_EXPIRY` | Token expiration time | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary name for uploads | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `your-api-key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your-api-secret` |
| `CORS_ORIGIN` | Allowed origin(s) | `*` |
| `RATE_LIMIT_MAX` | Request limit per IP per 15 minutes | `100` |

---

## API Endpoints Reference

### Health check
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Returns `{ status: 'ok' }` to verify server is active |

### Challenges
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `POST` | `/api/gamification/challenges` | `MANAGER`, `ADMIN` | Create a new challenge (initially `DRAFT`) |
| `GET` | `/api/gamification/challenges` | Authenticated | List filterable and paginated challenges |
| `GET` | `/api/gamification/challenges/:id` | Authenticated | Get challenge details |
| `PUT` | `/api/gamification/challenges/:id` | `MANAGER`, `ADMIN` | Update challenge (only if `DRAFT`) |
| `PATCH` | `/api/gamification/challenges/:id/status` | `MANAGER`, `ADMIN` | Transition status of challenge (valid transitions only) |
| `DELETE` | `/api/gamification/challenges/:id` | `ADMIN` | Delete challenge (only if `DRAFT` and 0 participants) |

### Participation
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `POST` | `/api/gamification/challenges/:id/join` | Authenticated | Join an active challenge |
| `PATCH` | `/api/gamification/participation/:id/progress` | Authenticated | Update participant progress (0-100%, owner only) |
| `POST` | `/api/gamification/participation/:id/proof` | Authenticated | Attach upload proof image/document |
| `PATCH` | `/api/gamification/participation/:id/approve` | `MANAGER`, `ADMIN` | Approve progress completion & award XP |
| `PATCH` | `/api/gamification/participation/:id/reject` | `MANAGER`, `ADMIN` | Reject completion approval request |
| `GET` | `/api/gamification/participation` | `MANAGER`, `ADMIN` | List all participations |

### Badges
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `POST` | `/api/gamification/badges` | `ADMIN` | Create a new badge |
| `GET` | `/api/gamification/badges` | Authenticated | List all badges |
| `GET` | `/api/gamification/employees/:id/badges` | Authenticated | Get badges awarded to an employee |

### Rewards Catalog
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `GET` | `/api/gamification/rewards` | Authenticated | List all available rewards |
| `POST` | `/api/gamification/rewards` | `ADMIN` | Create a new reward |
| `POST` | `/api/gamification/rewards/:id/redeem` | Authenticated | Redeem a reward using XP (Rate-limited) |

### Leaderboard
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `GET` | `/api/gamification/leaderboard` | Authenticated | Get cached leaderboard (employee/department scope) |

### Notifications
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `GET` | `/api/gamification/notifications` | Authenticated | Retrieve paginated list of user notifications |
| `PATCH` | `/api/gamification/notifications/:id/read` | Authenticated | Mark notification as read (owner only) |