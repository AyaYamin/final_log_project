# Final Log Project

A Production-Ready Log Management Backend System built with TypeScript, Fastify, PostgreSQL, Drizzle ORM, Docker, Vitest, k6, and GitHub Actions.

---

# 1. Project Overview

This project implements a scalable backend service for collecting, storing, querying, and managing application logs.

The system provides APIs for:

- Ingesting large batches of logs
- Querying logs using dynamic filters
- Cursor-based pagination
- Log aggregation and statistics
- Automatic deletion of expired logs
- Database optimization using indexes
- Automated testing
- Load testing
- Continuous Integration pipeline
- Docker-based deployment

The project follows production backend practices including:

- Modular architecture
- Separation of concerns
- Repository pattern
- Environment-based configuration
- Error handling middleware
- Database migrations
- Containerized deployment

---

# 2. Technologies Used

## Backend

| Technology | Purpose |
|---|---|
| TypeScript | Main programming language |
| Fastify | High-performance HTTP framework |
| Node.js | Runtime environment |
| Drizzle ORM | Database ORM and migrations |
| PostgreSQL | Persistent data storage |
| Zod | Request validation |
| Pino | Application logging |

---

## Development and Testing

| Technology | Purpose |
|---|---|
| Vitest | Unit and integration testing |
| k6 | Load testing |
| Docker | Containerization |
| Docker Compose | Multi-container deployment |
| GitHub Actions | CI pipeline |

---

# 3. System Architecture

The application follows a layered backend architecture.
```text

                 Client
                   |
                   |
                   v
            Fastify Server
                   |
    --------------------------------
    |                              |
    v                              v
Routes                       Middleware
    |
    v
Controller Layer
    |
    v
 Service Layer
    |
    v
Repository Layer
    |
    v
 Drizzle ORM
    |
    v
PostgreSQL Database
   


Background Process:

Retention Worker
        |
        v
 Log Service
        |
        v
Repository Layer
        |
        v
PostgreSQL Database
   ```
---

# 4. Application Layers

## Routes Layer

Responsible for:
- Defining API endpoints
- Receiving HTTP requests
- Connecting requests to controllers

Example:
- POST /logs
- GET /logs
- GET /logs/aggregate

---

## Controller Layer

Responsible for:
- Handling HTTP requests
- Extracting request data
- Returning HTTP responses

The controller does not contain business logic.

Flow:
```text
Request
↓
Controller
↓
Service
```
---

## Service Layer

Responsible for:
- Business rules
- Validation flow
- Processing log operations

Examples:
- Accepting valid logs
- Running aggregation logic
- Triggering retention deletion

---

## Repository Layer

Responsible for:
- Database communication
- SQL queries
- Data persistence

The repository uses Drizzle ORM.

Examples:
- Insert logs
- Find logs
- Aggregate data
- Delete expired logs

---

# 5. Database Design

The system uses PostgreSQL.
Main table:logs
The table stores application log records.

---

## Logs Table Schema

```text
logs

id
timestamp
level
service
message
attributes
created_at
```

---

# 6. Logs Table Fields

id
- Type:UUID
- Purpose:Unique identifier for every log
- Primary key
    Generated automatically: .defaultRandom()

---

timestamp

- Type:timestamp with timezone
- Purpose: Stores when the original event happened.
- Example: 2026-08-07 10:30:00 UTC
- Used for:
   Filtering by date
   Pagination
   Retention deletion

---

level

- Type:text
- Represents log severity.
- Supported values:
   debug
   info
   warn
   error
- Example:
{
 "level":"error"
}

---

service

- Type:text
- Represents the application component generating the log.
- Examples:
    auth
    payment
    checkout

---

message

- Type:text
- Contains the log description.
- Example: "Payment failed"

---

  attributes

- Type:JSONB
- Stores additional dynamic metadata.
- Example:
{
 "userId":123,
 "browser":"Chrome",
 "success":false
}

- JSONB allows flexible log structures without changing the database schema.

---

 createdAt

- Type:timestamp
- Automatically stores insertion time.
- Example:2026-08-07 17:00:00

---

# 7. Database Index Optimization

The database contains indexes to improve query performance and reduce query execution time.

---

## Timestamp Index

Index: 
``` logs_timestamp_idx```

Purpose:

Improves:
- Date filtering
- Sorting by time
- Cursor pagination
- Example query:
```sql
WHERE timestamp > '2026-08-01'
```

##  Level Index

Index: ```logs_level_idx```

Purpose:
- Improves filtering by log severity.
- Example query:
      ```sql 
      WHERE level = 'error'
      ```

## Service Index

Index:
``` logs_service_idx```

Purpose:
- Improves filtering by application service.
- Example query:
 ```sql 
  WHERE service = 'auth'
  ```

## Composite Indexes 

# Service + Timestamp

Index: 
``` logs_service_timestamp_idx```

- Optimizes queries that combine service filtering with time ordering.
- Example:
```sql
WHERE service = 'auth'
ORDER BY timestamp
```

# Level + Timestamp

Index:
```logs_level_timestamp_idx```

- Purpose: Optimizes queries that filter by level and sort by timestamp.
- Example query:

```sql
WHERE level = 'error'
ORDER BY timestamp
```

---

## Database Optimization Summary

The indexing strategy improves:
- Query speed
- Filtering performance
- Sorting performance
- Cursor pagination performance
- Log retrieval performance
- Aggregation performance

---

# 8. Docker Deployment Architecture

## Docker Overview

This project uses Docker to provide a consistent and reproducible deployment environment.

Docker packages the application, runtime, dependencies, and configuration into containers.

The deployment contains two main services:
1. Application Container
2. PostgreSQL Database Container


## Docker Architecture

```text
                  Client
                    |
                    |
                    v

            Fastify Application
                Container

                    |
                    |
             Docker Network

                    |
                    |

            PostgreSQL Database
                Container
```

The containers communicate through the Docker Compose internal network.
The application connects to PostgreSQL using the service name:
```
db
```

Example connection string:
```env
DATABASE_URL=postgres://postgres:postgres@db:5432/logs
```

The hostname `db` is automatically resolved by Docker Compose.

---

# 9. Docker Compose Configuration

Docker Compose is used to manage multiple containers together.

The project defines two services:
- `app`
- `db`

---

# Application Service

The application service runs the Fastify backend.

Example:
```yaml
app:
  build: .
  ports:
    - "8080:8080"
```

## build

Builds the application Docker image using the project Dockerfile.

The Dockerfile:
- Installs dependencies
- Compiles TypeScript
- Creates the production image

## ports

Maps the container port to the host machine.

Example:
```
localhost:8080
```

forwards traffic to the Fastify server.

---

# PostgreSQL Database Service

The database service uses the official PostgreSQL Docker image.

Example:

```yaml
db:
  image: postgres:17
```

The database container creates:

```
Database:
logs

Username:postgres
Password:postgres
```

The backend connects to this database through:
```
postgres://postgres:postgres@db:5432/logs
```

---

# 10. Environment Variables

The application configuration is controlled using environment variables.

Example:

```yaml
environment:
  DATABASE_URL: postgres://postgres:postgres@db:5432/logs
  PORT: 8080
  LOG_RETENTION_DAYS: 30
  RETENTION_INTERVAL: 10000
  NODE_ENV: production
```

---

## DATABASE_URL

Database connection string used by:
- Drizzle ORM
- PostgreSQL client

Format:
```
postgres://username:password@host:port/database
```

---

## PORT

Defines the HTTP server port.

Example:
```
8080
```

Fastify listens on this port.

---

## LOG_RETENTION_DAYS

Controls automatic log deletion.

Example:
```
30
```

Meaning:
Logs older than 30 days are removed by the retention worker.

---

## RETENTION_INTERVAL

Controls how often the cleanup worker runs.

Example:
```
10000
```

Value is in milliseconds.

Therefore:
```
10000ms = 10 seconds
```

The worker periodically checks and deletes expired logs.

---

## NODE_ENV

Defines application environment.

Production mode:
- Disables development-only formatting
- Uses production logging behavior

---

# 11. Docker Health Checks
Health checks allow Docker to verify that services are running correctly.

## PostgreSQL Health Check

Example:
```yaml
healthcheck:
  test:
    [
      "CMD-SHELL",
      "pg_isready -U postgres"
    ]
```

Purpose:
Checks whether PostgreSQL is ready to accept connections.


---

## Application Health Check

Example:

```yaml
healthcheck:
  test:
    [
      "CMD",
      "wget",
      "--spider",
      "http://127.0.0.1:8080/health"
    ]
```

Purpose:
Checks whether Fastify is responding successfully.

---

# 12. Container Startup Order

The application depends on PostgreSQL.

Configuration:
```yaml
depends_on:
  db:
    condition: service_healthy
```

Startup sequence:

```
1. PostgreSQL container starts
2. PostgreSQL health check runs
3. Database becomes healthy
4. Fastify application starts
5. Database migrations run
6. API becomes available
```

This prevents the backend from starting before the database is ready.

---

# 13. Dockerfile and Multi-Stage Build

The project uses a multi-stage Dockerfile to create a smaller and cleaner production image.

The Dockerfile contains two stages:
1. Builder stage
2. Production stage

The main purpose of using multi-stage builds is to separate development/build dependencies from the final production environment.

---

## 13.1 Builder Stage

The builder stage uses:

```dockerfile
FROM node:22-alpine AS builder
```

This stage is responsible for installing all dependencies and compiling the TypeScript application.

The working directory is: 
```dockerfile
WORKDIR /app
```

All following commands are executed inside ```/app```.

---

## 13.2 Copying package files

The Dockerfile first copies the package files:
```dockerfile 
   COPY package*.json ./
```

This includes:
package.json
package-lock.json

The dependencies are then installed using:
```dockerfile 
RUN npm ci
```

npm ci is used instead of npm install because it provides a reproducible installation based on the lock file.

This is especially useful for Docker builds and CI environments.

--- 

## 13.3 Copying the Source Code

After installing dependencies, the complete project is copied:
```dockerfile 
COPY . .
``` 

This includes the TypeScript source code, configuration files, migrations, and other project files that are required during the build.

--- 

## 13.4 Building the TypeScript Application

The application is compiled using:
```dockerfile 
RUN npm run build
```

The build script executes TypeScript:
```json
"build": "tsc"
``` 

The TypeScript source code is therefore compiled into JavaScript files inside the dist directory.

The resulting structure is approximately:
```text
dist/
├── index.js
├── server.js
├── app.js
└── ...
```

The exact generated files depend on the TypeScript source structure.

---

# 14. Production Docker Stage

The second stage creates the production image.
```dockerfile 
FROM node:22-alpine AS production
```

The production image also uses Alpine Linux, which provides a relatively small Node.js base image.
---

## 14.1 Production Working Directory
```dockerfile 
WORKDIR /app
```

The application runs inside /app.
---

## 14.2 Installing Production Dependencies

The package files are copied again:
```dockerfile 
COPY package*.json ./
```

Then only production dependencies are installed:
```dockerfile 
RUN npm ci --omit=dev
```

Development dependencies are not included in the production dependency installation.

Examples of development-only tools include:
```text
Vitest
TypeScript
tsx
Drizzle Kit
ESLint
Prettier
```

This reduces unnecessary packages in the final runtime environment.
---

## 14.3 Copying the Compiled Application

The compiled application from the builder stage is copied:
```dockerfile 
COPY --from=builder /app/dist ./dist
```

This means the production container receives the compiled JavaScript application rather than needing to compile TypeScript again.
---

## 14.4 Copying Database Migrations

The database migrations are also copied:
```dockerfile 
COPY --from=builder /app/src/db/migrations ./src/db/migrations
```

These migrations are required when the application starts and executes the migration process.

The startup process therefore has access to the database migration files inside the production container.
---

# 15. Running the Container as a Non-Root User

The Dockerfile creates a dedicated application user:
```dockerfile 
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup
```

The application files are then assigned to this user:
```dockerfile 
RUN chown -R appuser:appgroup /app
```

Finally, Docker switches to the non-root user:
```dockerfile 
USER appuser
```

Running the application as a non-root user is an important production security practice.

It reduces the privileges available to the application process inside the container.
---

# 16. Exposing the Application Port

The Dockerfile declares:
```dockerfile 
EXPOSE 8080
```

This documents that the Fastify application listens on port 8080.

Docker Compose maps this container port to the host:
```yaml
ports:
  - "8080:8080"
```

Therefore, the API can be accessed from the host using:
```text
http://localhost:8080
```
---

# 17. Container Startup Command

The production container starts the application using:
```dockerfile 
CMD ["npm", "start"]
```

The corresponding package.json script is:
```json 
"start": "node dist/index.js"
```

Therefore, the production startup flow is:
```text
Docker Container Starts
        |
        v
npm start
        |
        v
node dist/index.js
        |
        v
Application Bootstrap
```

The application then checks the database, runs migrations, initializes Fastify, starts the retention worker, and starts listening for HTTP requests.
---

# 18. Docker Multi-Stage Build Summary

The complete Docker build process can be summarized as:
```text
                    Docker Build
                         |
                         v
                 Builder Stage
                         |
              npm ci + TypeScript
                         |
                         v
                    npm run build
                         |
                         v
                       dist/
                         |
                         v
                Production Stage
                         |
              npm ci --omit=dev
                         |
                         v
                 Copy compiled app
                         |
                         v
                 Copy migrations
                         |
                         v
                Non-root appuser
                         |
                         v
                  Production Image
```

The main advantages are:
- Separate build and runtime environments
- Production dependencies only
- Compiled JavaScript in the final image
- Smaller runtime environment
- Non-root application execution
- Reproducible dependency installation
- Database migrations included in the production image

---

# 19. Application Bootstrap Process

The application entry point initializes all required components before accepting requests.

The bootstrap process performs the following operations:
- Check database connectivity
- Run database migrations
- Build the Fastify application
- Start the retention worker
- Mark the application as ready
- Register graceful database shutdown
- Start the HTTP server

The overall flow is:
```text
Application Start
       |
       v
Check Database
       |
       v
Run Migrations
       |
       v
Build Fastify App
       |
       v
Start Retention Worker
       |
       v
Set Application Ready
       |
       v
Start HTTP Server
       |
       v
Accept Requests
```

This startup sequence ensures that the application does not begin serving normal traffic before its database dependency has been checked and migrations have been applied.

---

# 20. Final Verification

## 20.1 TypeScript Build

```bash
npm run build
```

Expected:
```text
Build completed successfully
```

## 20.2 Database

Start the containers:
```bash
docker compose up --build -d
```

Check:
```bash
docker compose ps
``` 

Both the application and PostgreSQL should be running.


# 20.3 API Verification

Check the application:
```bash
curl http://localhost:8080/health
```

Then test the main endpoints:
```bash
POST /logs
GET  /logs
GET  /logs/aggregate
20.4 Automated Tests
```

Run:
```bash
npm test
```

All Vitest tests should pass.


## 20.5 Load Testing

Run your k6 test:
```bash
k6 run tests/load/logs.js
```

Record the important results such as:
```text
Requests per second
Average response time
p95 response time
Error rate
Number of iterations
20.6 Docker Verification
```

Check:
```bash
docker compose ps
docker images
docker compose logs app
```

Confirm that the application starts correctly and connects to PostgreSQL.

## 20.7 Graceful Shutdown

Stop the application:
```bash
docker compose down
```

Confirm that the application shuts down without database/resource errors.

---

# 21. Final Project Summary

Then finish the README with a short summary of what the project demonstrates:
The Final Log Project is a production-oriented log management backend
built with TypeScript, Fastify, PostgreSQL, Drizzle ORM, Docker,
Vitest, k6, and GitHub Actions.

The system supports:
- Batch log ingestion
- Validation and rejection handling
- Dynamic log querying
- Cursor-based pagination
- Log aggregation
- Repository-based data access
- Automatic log retention
- Error handling and middleware
- Performance optimizations
- Dockerized deployment
- Automated testing
- Load testing
- CI/CD automation
- Graceful application startup and shutdown

---



