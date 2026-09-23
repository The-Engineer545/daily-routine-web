<div align="center">

# 📋 Daily Routine

*Organiza tus hábitos diarios, mantén tu racha y evoluciona tu mascota virtual.*

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)

[**Ver Proyecto en Vivo**](https://daily-routine-3ce4b.web.app/)

</div>

---

## 🚀 Sobre el Proyecto

**Daily Routine** es una aplicación web interactiva diseñada para ayudarte a mantener y organizar tus hábitos diarios. Lo que la hace especial es su sistema de recompensas gamificado: a medida que completas tus rutinas y mantienes tus rachas, ¡tu mascota virtual (en 3D) evolucionará!

### ✨ Características Principales

- **Gestor de Hábitos:** Añade y marca tus tareas diarias con facilidad.
- **Mascota Virtual 3D:** Una experiencia interactiva donde tu constancia hace evolucionar a tu compañero.
- **Rachas y Estadísticas:** Monitorea tu progreso, visualiza tu actividad semanal y rompe tus propios récords.
- **Diseño Moderno:** Interfaz limpia, responsiva y amigable (Glassmorphism & Tailwind CSS).

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3 (Tailwind CSS vía CDN), JavaScript (ES6 Modules)
- **Gráficos 3D:** Three.js
- **Backend:** Node.js, Express.js (Servidor de archivos estáticos)
- **Almacenamiento:** LocalStorage (Cliente)

---

## 💻 Instalación y Uso Local

Para correr este proyecto en tu entorno local, sigue estos sencillos pasos:

### Prerrequisitos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 14 o superior).

### Pasos

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/daily-routine-web.git
   cd daily-routine-web
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor**
   ```bash
   npm start
   ```

4. **Abre la aplicación**
   Dirígete a [http://localhost:3000](http://localhost:3000) en tu navegador favorito.

---

## 📂 Estructura del Proyecto

```text
daily-routine-web/
├── public/                 # Archivos servidos al cliente
│   ├── js/                 # Lógica de la aplicación (Módulos JS)
│   │   ├── main.js         # Punto de entrada
│   │   ├── store.js        # Gestión de estado (LocalStorage)
│   │   ├── ui.js           # Renderizado de la interfaz
│   │   ├── tasks.js        # Lógica de tareas
│   │   ├── pet.js          # Lógica de la mascota y evolución
│   │   └── scene.js        # Configuración de Three.js
│   ├── index.html          # Vista principal (Tareas y Mascota)
│   ├── rutina.html         # Vista de Estadísticas
│   └── ajustes.html        # Vista de Configuración
├── server.js               # Servidor Express
└── package.json            # Configuración de Node y dependencias
```

---

## 👨‍💻 Autor

**Josué Obando**

¡Gracias por probar Daily Routine! Si te gusta el proyecto, no dudes en dejar una ⭐️ en el repositorio.
