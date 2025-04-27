# 📋 HabitZone - App de Gestión de Hábitos

Bienvenido a **HabitZone**, una aplicación web diseñada para ayudarte a **crear**, **gestionar** y **visualizar** tus hábitos diarios de forma sencilla, intuitiva y motivadora. 🚀  
Este proyecto ha sido desarrollado como parte del **Proyecto Intermodular** del ciclo **2º DAW** (Desarrollo de Aplicaciones Web).

---

## 🌟 Funcionalidades principales

- ✅ Registro e inicio de sesión seguro con **JWT**.
- 📋 Crear, editar y eliminar **hábitos diarios**.
- 🔥 Marcar hábitos como completados día a día.
- 📅 Visualizar el **historial de hábitos** semanal.
- 📊 Rachas de cumplimiento de hábitos.
- 📱 Diseño responsive y adaptado a móviles y ordenadores.

---

## 🛠️ Tecnologías utilizadas

### 🔵 Frontend
- [React](https://react.dev/) ⚛️
- [Bootstrap 5](https://getbootstrap.com/) 🎨
- [Axios](https://axios-http.com/) 📡
- [React Router DOM](https://reactrouter.com/) 🛤️
- [Vite](https://vitejs.dev/) ⚡

### 🟢 Backend
- [Node.js](https://nodejs.org/) 🟩
- [Express.js](https://expressjs.com/) 🚀
- [TypeScript](https://www.typescriptlang.org/) 📘
- [MySQL](https://www.mysql.com/) 🛢️

### ☁️ Servicios de Despliegue
- [Render](https://render.com/) (Frontend y Backend) 🌎
- [Railway](https://railway.app/) (Base de datos) 🛠️

---

## 🔐 Seguridad

- Contraseñas encriptadas con **bcrypt** 🔒.
- Autenticación segura mediante **JSON Web Tokens (JWT)** 🛡️.

---

## 🌐 Deploy de la Aplicación

- **Frontend:** [https://client-habitzone.onrender.com/](https://client-habitzone.onrender.com/)
- **Backend:** [https://backend-habitzone.onrender.com/](https://backend-habitzone.onrender.com/)

> ⚡ Ambos servicios son accesibles públicamente.

---

## 🖥️ Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/ivanmartinezsanchez/Habit-Zone.git
cd Habit-Zone
```

---

### 2. Configurar variables de entorno

Crea un archivo .env en el backend y frontend

Backend (habit-server/.env)

```bash
PORT=4000
DB_HOST=your-railway-mysql-host
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_DATABASE=your-database-name
JWT_SECRET=your-jwt-secret
```

Frontend (habit-client/habitzone-client/.env)

```bash
VITE_API_BASE_URL=https://backend-habitzone.onrender.com
```

### 3. Instalar dependencias
Backend

```bash
cd habit-server
npm install
npm run dev
```

Frontend

```bash
cd habit-client/habitzone-client
npm install
npm run dev
```

--- 

## 🚀 Estado del Proyecto

- ✅ Funcionalidades principales completadas.
- ✅ Despliegue en Render realizado.
- ✅ Documentación creada.
- 🔜 Mejoras futuras: notificaciones diarias, sistema de motivaciones y recompensas.

---

## 🙌 Autor

Iván Martínez Sánchez

Ciclo Formativo: 2º DAW

Curso: 2024-2025

---

### 🏆 ¡Gracias por visitar HabitZone!
¡Espero que disfrutes usando la app tanto como yo disfruté creándola! 🚀💻

