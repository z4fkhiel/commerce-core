# 🛍️ commerce-core — E-commerce Fullstack Containerizado

> Aplicación de tienda en línea con arquitectura de tres capas completamente orquestada con Docker Compose. Backend en Java 21 + Spring Boot, frontend en React 18 + Vite, base de datos PostgreSQL.

---

## 🚀 Levantar en un comando

```bash
git clone https://github.com/z4fkhiel/curso-web.git
cd curso-web/TIENDA_DOCKER_EDITABLE
docker compose up --build
```

| Servicio | URL |
|----------|-----|
| Frontend (React) | http://localhost:5173 |
| Backend (API REST) | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

---

## 📌 ¿Qué es este proyecto?

Tienda virtual funcional con autenticación, catálogo de productos y carrito de compras persistente. El objetivo principal es demostrar una arquitectura fullstack real con separación de responsabilidades clara y despliegue reproducible en cualquier máquina con Docker.

---

## 🏗️ Arquitectura

```
TIENDA_DOCKER_EDITABLE/
├── docker-compose.yml          # Orquestación de los 3 servicios
├── backend/
│   ├── Dockerfile              # Build Maven + runtime Java 21
│   ├── pom.xml                 # Spring Boot 3.1.5, JPA, PostgreSQL driver
│   └── src/main/java/com/shop/api/
│       ├── ApiApplication.java # Punto de entrada + seed de productos
│       ├── controller/
│       │   └── AppController.java  # Endpoints REST
│       ├── model/
│       │   ├── User.java       # Entidad usuario con carrito (ManyToMany)
│       │   └── Product.java    # Entidad producto
│       └── repo/
│           ├── UserRepo.java   # JPA Repository
│           └── ProductRepo.java
└── frontend/
    ├── Dockerfile
    ├── vite.config.js          # Dev server con hot reload en contenedor
    └── src/
        ├── main.jsx
        └── App.jsx             # Auth + Dashboard + Carrito en React
```

---

## 🛠️ Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 4 |
| Backend | Java 21 + Spring Boot 3.1.5 |
| ORM | Spring Data JPA + Hibernate |
| Base de datos | PostgreSQL 15 |
| Containerización | Docker + Docker Compose |
| Build tool | Maven 3.9 |

---

## 🔌 API REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Login con email y contraseña |
| GET | `/api/products` | Listado de productos |
| GET | `/api/users/{id}` | Perfil y carrito del usuario |
| POST | `/api/users/{uid}/buy/{pid}` | Agregar producto al carrito |

---

## ✨ Funcionalidades

- **Autenticación** — registro e inicio de sesión con validación de email único
- **Catálogo de productos** — seed automático al primer arranque si la tabla está vacía
- **Carrito persistente** — relación `ManyToMany` entre usuarios y productos, guardada en PostgreSQL
- **Hot reload en desarrollo** — el volumen `./frontend/src:/app/src` permite editar React sin reconstruir el contenedor
- **Separación de entornos** — variables de conexión configurables por entorno en `docker-compose.yml`

---

## ⚙️ Proceso de modernización documentado

El proyecto incluye en `.github/modernize/` un plan de upgrade completo de **Java 17 → Java 21** ejecutado y verificado:

| Paso | Acción | Resultado |
|------|--------|-----------|
| 1 | Verificación de entorno (JDK 21 + Maven 3.9.11) | ✅ Completado |
| 2 | Baseline con Java 17 | ⏭️ Omitido (JDK 17 no disponible en host) |
| 3 | Upgrade `java.version` en pom.xml + imagen Docker | ✅ Compilación exitosa |
| 4 | Scan CVE de dependencias + upgrade driver PostgreSQL a 42.7.11 | ✅ Sin CVEs en dependencias directas |
| 5 | Validación final con `mvn clean test` en Java 21 | ✅ Tests en verde |

Cada paso tiene su commit trazable en la rama `appmod/java-upgrade-20260606060948`.

---

## 💡 Decisiones técnicas destacadas

- **Docker Compose multi-servicio** — `depends_on` garantiza que el backend no arranque antes que la base de datos, y el frontend no antes que el backend
- **Seed automático** — `CommandLineRunner` en `ApiApplication` inserta productos al primer arranque sin scripts SQL externos
- **JPA con DDL automático** — `SPRING_JPA_HIBERNATE_DDL_AUTO: update` gestiona el esquema sin migraciones manuales en desarrollo
- **Volumen de desarrollo** — el frontend monta `./frontend/src` como volumen para edición en caliente sin rebuild del contenedor

---

## 📈 Mejoras planificadas

- [ ] Hash de contraseñas con BCrypt (actualmente en texto claro)
- [ ] Validación de stock antes de agregar al carrito
- [ ] Endpoint de checkout con resumen de compra
- [ ] Tests de integración para los endpoints REST
- [ ] Configuración de variables sensibles con Docker Secrets o `.env`

---

## 👤 Autor

**z4fkhiel** — [GitHub](https://github.com/z4fkhiel)  
Desarrollador con enfoque en backend Java/Python y arquitecturas containerizadas.
