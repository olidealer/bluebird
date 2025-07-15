
# Rental Property Tax - Manual de Operación y Despliegue

## 1. Visión General de la Arquitectura

Esta aplicación es un sistema full-stack diseñado para ayudar a los anfitriones a gestionar sus declaraciones de impuestos. Se compone de tres servicios principales orquestados por Docker.

- **Frontend**: Una Single Page Application (SPA) construida con **React** y **TypeScript**. Se encarga de toda la interfaz de usuario. En producción, se sirve a través de un servidor web ligero **Nginx**.
- **Backend**: Una API RESTful construida con **Node.js**, **Express** y **TypeScript**. Maneja la lógica de negocio, autenticación, interacciones con la base de datos y sirve la configuración de la UI.
- **Base de Datos**: Un servicio **PostgreSQL**, que es la fuente de verdad para todos los datos de la aplicación (usuarios, facturas, ingresos, etc.).

**ORM**: Utilizamos **Prisma** como Object-Relational Mapper para facilitar y asegurar las interacciones entre el backend y la base de datos PostgreSQL.

## 2. Configuración del Entorno de Desarrollo

Para ejecutar la aplicación localmente, necesitas tener **Docker** y **Docker Compose** instalados.

### Paso 1: Clonar el Repositorio

Si estuviera en GitHub, clonarías el proyecto. Por ahora, solo necesitas tener todos los archivos en una misma estructura de carpetas.

### Paso 2: Configurar Variables de Entorno

En la carpeta `backend/`, renombra el archivo `.env.example` a `.env` y rellena las variables. Para desarrollo local con Docker, los valores por defecto deberían funcionar.

```env
# backend/.env

# DATABASE
# Esta es la URL de conexión para la base de datos PostgreSQL.
# El formato es: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://user:password@db:5432/rentaltaxdb"

# AUTH
# Clave secreta para firmar los JSON Web Tokens (JWT).
# Cámbiala por una cadena larga y aleatoria en producción.
JWT_SECRET="tu-clave-secreta-muy-segura-y-larga"

# SERVER
# Puerto en el que correrá el servidor backend.
PORT=5000
```

### Paso 3: Levantar los Servicios

Abre una terminal en la raíz del proyecto (donde se encuentra `docker-compose.yml`) y ejecuta:

```bash
docker-compose up --build
```

- `--build`: Fuerza la reconstrucción de las imágenes de Docker. Úsalo la primera vez o si has hecho cambios en los `Dockerfile` o dependencias.
- `-d`: (Opcional) Para ejecutar los contenedores en segundo plano (detached mode).

Una vez que los contenedores estén en ejecución:
- El **Frontend** estará accesible en `http://localhost:3000`.
- El **Backend** estará escuchando en `http://localhost:5000`.

### Acceso y Credenciales

- **Usuario de prueba**: `demo`
- **Contraseña**: `demo`

## 3. Guía de Uso de la Aplicación

### Funcionalidades Principales

- **Dashboard**: Vista general de los meses del año fiscal. Permite navegar entre años.
- **Vista Mensual**: Detalle de un mes específico para registrar ingresos, cargar facturas XML de gastos y ver un resumen de impuestos.
- **Generación de PDF**: Crea un PDF con el resumen de la declaración sugerida para el mes.
- **Historial de PDFs**: Guarda un registro de todos los PDFs generados para su fácil acceso y descarga.
- **Perfil de Usuario**: Permite al usuario cambiar su información personal y contraseña.
- **Internacionalización**: La interfaz puede cambiarse entre Español e Inglés.
- **Personalización de UI**: El logo y colores primarios se obtienen del backend, permitiendo una personalización centralizada (ver sección de API).

## 4. Documentación de la API del Backend

La API está disponible bajo el prefijo `/api`.

### Autenticación
- `POST /api/auth/register`: Registra un nuevo usuario.
- `POST /api/auth/login`: Autentica un usuario y devuelve un JWT.

### Usuario (Requiere autenticación)
- `GET /api/user/profile`: Obtiene los datos del perfil del usuario actual.
- `PUT /api/user/profile`: Actualiza los datos del perfil (nombre, email).
- `PUT /api/user/change-password`: Cambia la contraseña del usuario.

### Datos Fiscales (Requiere autenticación)
- `GET /api/taxes/:year/:month`: Obtiene todos los ingresos y gastos para un mes y año dados.
- `POST /api/taxes/:yearMonth/income`: Añade un nuevo registro de ingreso.
- `DELETE /api/taxes/income/:id`: Elimina un registro de ingreso.
- `POST /api/taxes/:yearMonth/expenses`: Sube uno o más archivos XML de gastos. Utiliza `multipart/form-data`.
- `DELETE /api/taxes/expenses/:id`: Elimina un gasto.

### PDFs (Requiere autenticación)
- `GET /api/pdfs`: Obtiene la lista de PDFs generados por el usuario.
- `POST /api/pdfs`: Registra un nuevo PDF generado.

### Configuración
- `GET /api/settings/appearance`: Obtiene la configuración de apariencia de la UI (logo, colores). No requiere autenticación.
- `PUT /api/settings/appearance`: (Ruta de Admin) Actualiza la configuración de apariencia.

## 5. Despliegue en Producción

1.  **Servidor**: Prepara un servidor (VPS, EC2, etc.) con Docker y Docker Compose instalados.
2.  **Dominio**: Apunta tu dominio al a IP pública de tu servidor.
3.  **Variables de Entorno**: Crea el archivo `backend/.env` en el servidor con valores de producción. **Es crucial que cambies `JWT_SECRET` por un valor seguro y único.**
4.  **HTTPS (Recomendado)**: Configura un proxy inverso como Nginx o Traefik para gestionar los certificados SSL/TLS (Let's Encrypt) y dirigir el tráfico al contenedor del frontend.
5.  **Ejecutar**: Sube los archivos al servidor y ejecuta `docker-compose up -d --build`.

## 6. Mantenimiento y Escalabilidad

- **Base de Datos**: El uso de Prisma facilita las migraciones. Si cambias el `schema.prisma`, puedes generar y aplicar migraciones con los comandos de Prisma CLI.
- **Backup de Datos**: Implementa una estrategia de backup para el volumen de la base de datos de Docker (`rental-tax-db-data`).
- **Nuevos Módulos**: La arquitectura está diseñada para ser modular. Puedes añadir nuevas rutas en el backend (`backend/src/routes`) y nuevas páginas/componentes en el frontend (`frontend/src/pages`) de forma independiente.
