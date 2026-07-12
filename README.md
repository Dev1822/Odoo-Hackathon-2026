# EcoSphere ESG & Gamification Module Backend

This is the backend implementation for the Environmental, Shared Infrastructure, and Gamification modules of EcoSphere.

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

4. Run Database Migrations/Push:
   ```bash
   npx prisma db push --force-reset
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

## Shared Infrastructure — Coordinate Before Changing

The shared tables and services below are consumed by **Environmental, Social, Governance, and Gamification** features. Please align on signatures and conventions prior to modifying these files:

### 1. `ActivityLog` Event Types
Always log events via `activityLogService.log()`. Standardized `eventType` names are:
- `GOAL_COMPLETED` (Environmental)
- `CARBON_TRANSACTION_LOGGED` (Environmental)
- `CHALLENGE_APPROVED` (Gamification)
- `REWARD_REDEEMED` (Gamification)

### 2. `DepartmentScore` Column Ownership
Each module aggregates its own score category column:
- `environmentalScore` -> Owned by Environmental module (recalculated on Goal Completion/Emissions changes).
- `socialScore` -> Owned by Social module (recalculated on CSR/Training completion).
- `governanceScore` -> Owned by Governance module.
- `totalScore` -> Computed dynamically based on organizational ESG weights (Environmental 40%, Social 30%, Governance 30%).

---

## API Endpoints Reference

### Health check
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Returns `{ status: 'ok' }` to verify server is active |

### Emission Factors (Environmental)
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `POST` | `/api/environmental/emission-factors` | `MANAGER`, `ADMIN` | Create a new active emission factor conversion rate |
| `GET` | `/api/environmental/emission-factors` | Authenticated | List all emission factors with optional category filter |
| `GET` | `/api/environmental/emission-factors/:id` | Authenticated | Retrieve a specific emission factor by ID |
| `PUT` | `/api/environmental/emission-factors/:id` | `MANAGER`, `ADMIN` | Update emission factor (does not retroactively affect past transactions) |
| `PATCH` | `/api/environmental/emission-factors/:id/deactivate` | `ADMIN` | Soft-deactivate an emission factor (never hard-deleted) |

### Carbon Transactions (Environmental)
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `POST` | `/api/environmental/carbon-transactions` | `MANAGER`, `ADMIN` | Log a manual carbon transaction (server-side CO2e calculated) |
| `GET` | `/api/environmental/carbon-transactions` | Authenticated | List transactions with filters (Department, Source module, Date range) |
| `GET` | `/api/environmental/carbon-transactions/trend` | Authenticated | Aggregate organization or department emissions trend over N months |

### Environmental Goals (Environmental)
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `POST` | `/api/environmental/goals` | `MANAGER`, `ADMIN` | Set up a new environmental reduction goal |
| `GET` | `/api/environmental/goals` | Authenticated | List goals with search and status filters |
| `PUT` | `/api/environmental/goals/:id` | `MANAGER`, `ADMIN` | Update goal details (cannot directly edit current progress) |
| `DELETE` | `/api/environmental/goals/:id` | `ADMIN` | Hard delete an environmental goal |

### Activity Logs (Shared)
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `GET` | `/api/shared/activity-log` | Authenticated | Fetch recent cross-cutting activity logs |

### Department Scores (Shared)
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `GET` | `/api/shared/department-scores` | Authenticated | Retrieve all department total ESG rankings |
| `GET` | `/api/shared/department-scores/overall` | Authenticated | Fetch overall ESG score (employee-weighted average) |
| `GET` | `/api/shared/department-scores/:departmentId` | Authenticated | Retrieve detailed scores of a specific department |

### Executive Dashboard Overview (Shared)
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/overview` | Authenticated | Get cached executive overview widget datasets |

### Custom Reports (Shared)
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `GET` | `/api/reports/environmental` | `MANAGER`, `ADMIN` | Stream filtered environmental reports (Format: CSV, Excel, PDF) |

### Challenges (Gamification)
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `POST` | `/api/gamification/challenges` | `MANAGER`, `ADMIN` | Create a new challenge (initially `DRAFT`) |
| `GET` | `/api/gamification/challenges` | Authenticated | List filterable and paginated challenges |
| `GET` | `/api/gamification/challenges/:id` | Authenticated | Get challenge details |
| `PUT` | `/api/gamification/challenges/:id` | `MANAGER`, `ADMIN` | Update challenge (only if `DRAFT`) |
| `PATCH` | `/api/gamification/challenges/:id/status` | `MANAGER`, `ADMIN` | Transition status of challenge |
| `DELETE` | `/api/gamification/challenges/:id` | `ADMIN` | Delete challenge (only if `DRAFT` and 0 participants) |

### Participation (Gamification)
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `POST` | `/api/gamification/challenges/:id/join` | Authenticated | Join an active challenge |
| `PATCH` | `/api/gamification/participation/:id/progress` | Authenticated | Update participant progress (0-100%, owner only) |
| `POST` | `/api/gamification/participation/:id/proof` | Authenticated | Attach upload proof image/document |
| `PATCH` | `/api/gamification/participation/:id/approve` | `MANAGER`, `ADMIN` | Approve progress completion & award XP |
| `PATCH` | `/api/gamification/participation/:id/reject` | `MANAGER`, `ADMIN` | Reject completion approval request |
| `GET` | `/api/gamification/participation` | `MANAGER`, `ADMIN` | List all participations |

### Badges (Gamification)
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `POST` | `/api/gamification/badges` | `ADMIN` | Create a new badge |
| `GET` | `/api/gamification/badges` | Authenticated | List all badges |
| `GET` | `/api/gamification/employees/:id/badges` | Authenticated | Get badges awarded to an employee |

### Rewards Catalog (Gamification)
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `GET` | `/api/gamification/rewards` | Authenticated | List all available rewards |
| `POST` | `/api/gamification/rewards` | `ADMIN` | Create a new reward |
| `POST` | `/api/gamification/rewards/:id/redeem` | Authenticated | Redeem a reward using XP |

### Leaderboard (Gamification)
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `GET` | `/api/gamification/leaderboard` | Authenticated | Get cached leaderboard (employee/department scope) |

### Notifications (Gamification)
| Method | Endpoint | Required Role | Description |
|---|---|---|---|
| `GET` | `/api/gamification/notifications` | Authenticated | Retrieve paginated list of user notifications |
| `PATCH` | `/api/gamification/notifications/:id/read` | Authenticated | Mark notification as read (owner only) |