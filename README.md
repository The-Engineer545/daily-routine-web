# Daily Routine Web

Aplicación web para gestión de hábitos y rutinas diarias con sistema de progreso gamificado mediante una mascota 3D interactiva.

🔗 **Demo en vivo:** [https://daily-routine-3ce4b.web.app](https://daily-routine-3ce4b.web.app)

---

## 📌 Descripción

El objetivo de este proyecto es construir una aplicación web ligera, reactiva y atractiva visualmente sin depender de frameworks pesados (como React o Vue). Se enfoca en el uso de **JavaScript Vanilla modular (ES Modules)**, manipulación directa del DOM, accesibilidad web y la integración de gráficos 3D en tiempo real con **Three.js**.

La aplicación fomenta la constancia diaria: al completar tus tareas del día aumentas tu racha, lo que desencadena evoluciones y animaciones interactivas en el modelo 3D.

---

## ✨ Características

- **Gestión de tareas:** Creación, edición, completado y eliminación de hábitos diarios con validación y sanitización contra XSS.
- **Mascota 3D interactiva (Three.js):** Renderizado con WebGL, iluminación dinámica, efectos de partículas, post-procesamiento (Bloom) y respuesta al cursor del usuario.
- **Sistema de rachas y niveles:** Cálculo automático de días consecutivos completados y etapas evolutivas.
- **Historial y estadísticas:** Gráfico semanal que visualiza el cumplimiento de los últimos 7 días.
- **Persistencia local:** Almacenamiento seguro en el cliente mediante `localStorage`.
- **Accesibilidad y diseño:** Construido con Tailwind CSS, interfaz adaptable a móviles y atributos ARIA para soporte de lectores de pantalla.

---

## 🛠️ Tecnologías

| Área | Herramientas / Tecnologías |
| :--- | :--- |
| **Frontend** | HTML5 semántico, Tailwind CSS, JavaScript (ES6+ Modules) |
| **Gráficos 3D** | Three.js (WebGL, Postprocessing) |
| **Backend / Entorno** | Node.js, Express.js |
| **Despliegue** | Firebase Hosting (SSL, CDN global) |
| **Control de versiones** | Git & GitHub |

---

## 🚀 Instalación y ejecución local

Si deseas clonar y probar el proyecto en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/The-Engineer545/daily-routine-web.git
cd daily-routine-web
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor local
```bash
npm start
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación funcionando.

---

## 📂 Arquitectura del proyecto

```text
Daily Routine Web/
├── public/                  # Archivos estáticos servidos al cliente
│   ├── js/                  # Lógica modular
│   │   ├── main.js          # Punto de entrada y orquestación de eventos
│   │   ├── store.js         # Estado centralizado y persistencia en LocalStorage
│   │   ├── ui.js            # Manipulación del DOM y sanitización XSS
│   │   ├── tasks.js         # Operaciones CRUD de tareas
│   │   ├── pet.js           # Lógica de estados y etapas de la mascota
│   │   └── scene.js         # Motor 3D con Three.js, luces y partículas
│   ├── index.html           # Vista principal (Hábitos y Mascota 3D)
│   ├── rutina.html          # Vista de estadísticas y gráfico semanal
│   └── ajustes.html         # Configuración de perfil y preferencias
├── server.js                # Servidor Express con cabeceras de seguridad
├── firebase.json            # Configuración de Firebase Hosting
└── package.json             # Dependencias y scripts de ejecución
```

---

## 👤 Desarrollador

**Josue Obando R**  
- GitHub: [@The-Engineer545](https://github.com/The-Engineer545)
