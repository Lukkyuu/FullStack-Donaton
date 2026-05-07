# Plan de Branching (Estrategia de Control de Versiones)

Para garantizar un desarrollo ordenado, seguro y colaborativo durante todo el semestre, el proyecto adopta la estrategia de branching basada en **GitFlow**. Esta estrategia nos permite trabajar en paralelo en diferentes microservicios sin afectar el código de producción.

## Ramas Principales

### 1. Rama `main` (Producción)
*   **Propósito:** Es la rama estable del proyecto. Refleja exactamente lo que está desplegado en AWS y en funcionamiento.
*   **Reglas:** Nunca se sube código directamente a `main` (commits directos prohibidos). Solo recibe código a través de Pull Requests (PR) desde la rama `release` o `hotfix`.

### 2. Rama `develop` (Desarrollo)
*   **Propósito:** Es la rama principal de integración. Contiene los últimos cambios de desarrollo listos para ser probados.
*   **Reglas:** Los desarrolladores fusionan aquí sus nuevas características (`features`). Es la rama que se despliega en el entorno de "QA" o "Pruebas".

## Ramas de Soporte

### 3. Ramas `feature/*` (Nuevas Características)
*   **Nomenclatura:** `feature/ms-nombre-funcionalidad` (Ej. `feature/auth-jwt-roles`, `feature/donacion-rabbitmq`).
*   **Origen:** Creadas a partir de `develop`.
*   **Destino:** Se fusionan de vuelta hacia `develop` una vez que la funcionalidad está terminada y probada localmente.
*   **Propósito:** Aislar el desarrollo de nuevas características. Varios estudiantes pueden trabajar en distintas features simultáneamente.

### 4. Ramas `bugfix/*` o `hotfix/*` (Correcciones)
*   **Nomenclatura:** `hotfix/error-crítico` (Si es en producción) o `bugfix/error-menor` (Si es en desarrollo).
*   **Origen:** `hotfix` nace de `main`. `bugfix` nace de `develop`.
*   **Destino:** `hotfix` se fusiona tanto a `main` como a `develop` para que el error no vuelva a ocurrir.
*   **Propósito:** Solucionar errores urgentes de manera aislada sin detener el desarrollo de nuevas funcionalidades.

## Flujo de Trabajo (Workflow) del Semestre

1. **Inicia el Sprint/Semana:** El profesor asigna una nueva historia de usuario (ej. Crear el microservicio de Logística).
2. **Creación de Rama:** El desarrollador hace `git checkout -b feature/ms-logistica` basándose en `develop`.
3. **Desarrollo:** Realiza los commits diarios (`git commit -m "feat: agrega controlador logistica"`).
4. **Pull Request (PR):** Al terminar, se abre un PR hacia `develop` en GitHub.
5. **Revisión de Código:** Otro compañero revisa el código. Si es aprobado, se hace el "Merge".
6. **Entrega/Release:** Al final del mes o parcial, se fusiona `develop` hacia `main` y se despliega en AWS.
