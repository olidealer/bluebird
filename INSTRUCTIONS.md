
# Rental Property Tax - Setup and Deployment Guide

## Overview

This is a full-stack web application designed to help rental property owners manage their monthly taxes. It's built with a three-tier architecture (Frontend, Backend, Database) and orchestrated with Docker.

- **Frontend:** React, Vite, TypeScript, TailwindCSS
- **Backend:** Node.js, Express, TypeScript, Prisma
- **Database:** PostgreSQL

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup Instructions

Follow these steps to get the application running locally.

### 1. Clone the Project

If you haven't already, get the project files onto your local machine.

### 2. Create the Backend Environment File

The backend requires a set of environment variables to connect to the database and secure the application.

- Navigate to the `backend/` directory.
- You will find a file named `.env.example`. Make a copy of this file and name it `.env`.
- Open the new `.env` file and fill in the required values.

**Example `backend/.env`:**
```
# PostgreSQL Database Connection
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_super_secret_password
DATABASE_NAME=rental_tax_db
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_URL="postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?schema=public"

# Application
PORT=5000

# JWT
JWT_SECRET=a_very_strong_and_long_secret_key_for_jwt
```
**Important:**
- The `DATABASE_HOST` **must** be `db`, which is the service name defined in `docker-compose.yml`.
- Choose a strong, random string for `JWT_SECRET`.

### 3. Build and Run the Application with Docker

Once the `.env` file is configured, you can start the entire application stack with a single command.

- Open your terminal in the root directory of the project (where `docker-compose.yml` is located).
- Run the following command:

```bash
docker-compose up --build
```

- **`--build`**: This flag tells Docker Compose to build the images from the Dockerfiles before starting the containers. You should use this the first time you run the app or after making changes to `Dockerfile`, `package.json`, or other configuration files.
- For subsequent runs, you can just use `docker-compose up`.

### 4. Accessing the Application

After the containers are up and running, you can access the different parts of the system:

- **Frontend Application:** Open your web browser and navigate to [http://localhost:3000](http://localhost:3000)
- **Backend API:** The API is running on `http://localhost:5000`, but you typically won't access it directly. The frontend is configured to proxy API requests.

### Initial Login

The application automatically creates a demo user for you to test with.
- **Username:** `demo`
- **Password:** `demo`

### Stopping the Application

To stop all running containers, press `Ctrl + C` in the terminal where `docker-compose` is running.

To stop and remove the containers, you can run:
```bash
docker-compose down
```
If you want to remove the database volume as well (deleting all data), run:
```bash
docker-compose down -v
```
