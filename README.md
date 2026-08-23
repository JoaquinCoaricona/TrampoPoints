# TrampoPoints

> An intelligent ride-pooling platform that turns individual commuter requests into optimized shared routes.

TrampoPoints is an end-to-end smart transit and ride-pooling ecosystem designed to bridge the gap between individual ride-hailing and fixed public transit. By aggregating decentralized commuter demands in real time, the platform groups compatible origin-destination pairs into unified routes, maximizing vehicle seat utilization while minimizing individual travel expenses, commute times, and carbon emissions.

---

## Key Features

### 1. Intelligent Route Corridor & Dynamic Clustering Algorithm
- **Spatial Corridor Projection**: Identifies passengers traveling along the same primary corridor, incorporating on-the-way pickups and intermediate drop-offs before the final destination.
- **Street-Level Routing (OSRM)**: Calculates turn-by-turn routes, accurate road distances, durations, and high-resolution encoded polylines.
- **Chronological Stop Sequencing**: Automatically orders stops so pickups precede drop-offs in the direction of travel.

### 2. Role-Based Applications

- **Passenger Portal**:
  - Request submission with dynamic local time detection and geocoding.
  - Interactive street-level map previews with search animations.
  - Live status tracking (`SEARCHING`, `MATCHED`, `CONFIRMED`) and request history.

- **Driver Dashboard**:
  - Operational controls to toggle real-time availability (`AVAILABLE`, `UNAVAILABLE`, `OUT_OF_SERVICE`).
  - Vehicle model selector and documentation tracker.
  - Itinerary viewer with passenger lists and on-demand trip release functionality.

- **Administrative Control Center**:
  - Real-time fleet overview with live available combi counters synchronized with PostgreSQL.
  - Interactive multi-colored map overlay displaying individual travel requests.
  - Manual and scheduled execution of the route clustering algorithm.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router, Lucide Icons, Leaflet, Vanilla CSS |
| **Backend** | Java 21, Spring Boot 3.2, Spring Data JPA, Hibernate |
| **Database** | PostgreSQL (Hosted on Supabase) |
| **Routing Engine** | Open Source Routing Machine (OSRM) REST API |
| **DevOps & Cloud** | Docker, Render (Backend Web Service), Vercel (Frontend SPA) |

---

## Project Structure

```text
TrampoPoints/
├── backend/
│   ├── src/main/java/com/trampopoints/
│   │   ├── controller/      # REST API Controllers (Trip, Driver, Auth)
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── model/           # JPA Entities (User, Driver, Vehicle, Trip, Stop, etc.)
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   └── service/         # Business Logic (TripService, MatchingService, DriverService)
│   ├── src/main/resources/
│   │   └── application.properties # PostgreSQL & Environment Configurations
│   ├── Dockerfile           # Multi-stage Docker build (Eclipse Temurin 21)
│   └── pom.xml              # Maven dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # UI Components (AdminPanel, LiveAdminMap, RequestConfirmation)
│   │   │   └── driver/      # Driver-specific Views (Dashboard, Vehicle, Docs)
│   │   ├── pages/           # Landing, Login, Register, MyRequests, Admin
│   │   └── services/        # API Client Modules (api.js, authService.js, driverService.js)
│   ├── public/              # Static assets and vehicle models
│   ├── vercel.json          # SPA rewrite rules for client-side routing
│   └── package.json         # NPM packages and Vite config
│
└── README.md
```

---

## Getting Started Locally

### Prerequisites
- **JDK 21** or later
- **Node.js 18+** and **npm**
- Access to a PostgreSQL instance (or Supabase connection string)

### 1. Backend Setup
```bash
cd backend

# Build and run with Maven Wrapper
./mvnw.cmd spring-boot:run   # On Windows
./mvnw spring-boot:run       # On Linux/macOS
```
The backend starts at `http://localhost:8080`.

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend starts at `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env` or Render Dashboard)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Server HTTP port | `8080` |
| `SPRING_DATASOURCE_URL` | PostgreSQL JDBC connection URL | Supabase Pooler URL |
| `SPRING_DATASOURCE_USERNAME` | Database username | `postgres...` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | Database password |
| `MATCHING_MAX_CORRIDOR_KM` | Max deviation distance for intermediate corridor stops | `3.5` |

### Frontend (`frontend/.env` or Vercel Dashboard)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the REST API | `http://localhost:8080/api` |

---

## Deployment

- **Backend (Render)**: Uses `backend/Dockerfile` configured as a Web Service.
- **Frontend (Vercel)**: Configured with `frontend/` as Root Directory and `vercel.json` for SPA URL rewrites.

---

## License

This project is licensed under the MIT License.
