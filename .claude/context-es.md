# Contexto del Proyecto jkit

**Última actualización**: 2025-01-17

## 📋 Resumen del Proyecto

**jkit** es una herramienta CLI moderna para el desarrollo de extensiones de Joomla, escrita completamente en TypeScript. Funciona como una alternativa moderna a joomla-gulp, utilizando Vite para un desarrollo ultrarrápido con Hot Module Replacement (HMR).

### Objetivos Principales

1. **Scaffolding Automático**: Generar extensiones de Joomla (componentes, módulos, plugins, templates, librerías) con un solo comando
2. **Dev Container Integrado**: Configuración automática de Docker con Joomla, MySQL, phpMyAdmin y Mailpit
3. **Build Moderno**: Usar Vite para compilación rápida de TypeScript, JavaScript, SCSS/CSS
4. **Multilenguaje**: CLI completamente traducido en inglés y español
5. **Empaquetado Fácil**: Crear archivos .zip listos para instalar en Joomla

## 🎯 Estado Actual del Proyecto

### ✅ Completado (100%)

#### 1. Infraestructura Base
- [x] Estructura de proyecto TypeScript
- [x] Configuración de tsconfig.json (strict mode)
- [x] ESLint + Prettier configurados
- [x] Husky + commitlint para commits convencionales
- [x] semantic-release para releases automáticos
- [x] GitHub Actions workflows (release, commitlint)
- [x] Dev Container para desarrollo del CLI

#### 2. Sistema de Internacionalización (i18n)
- [x] i18next integrado
- [x] Detección automática de idioma del sistema
- [x] Traducciones completas en inglés (en/)
- [x] Traducciones completas en español (es/)
- [x] CLI 100% traducido en ambos idiomas
- [x] Archivos de traducción: common.json, commands.json

#### 3. Documentación
- [x] README.md completo (inglés)
- [x] README.es.md completo (español)
- [x] CONTRIBUTING.md (inglés)
- [x] CONTRIBUTING.es.md (español)
- [x] LICENSE (MIT)
- [x] Enlaces de selección de idioma

#### 4. TypeScript Tipos e Interfaces
- [x] src/types/config.ts - Interfaces de configuración
  - ExtensionType, JoomlaVersion
  - ExtensionConfig, JkitConfig
  - InitProjectOptions, CreateExtensionOptions
- [x] src/types/manifest.ts - Interfaces de manifiestos Joomla
  - ComponentManifest, ModuleManifest, PluginManifest
  - TemplateManifest, LibraryManifest
  - ManifestGeneratorOptions
- [x] src/types/index.ts - Exports centralizados
- [x] TSDoc completo en todas las interfaces

#### 5. Comandos CLI (Estructura Base)
- [x] `jkit init` - **FUNCIONAL** ✅
  - Crea nuevo proyecto con estructura completa
  - Genera Dev Container con docker-compose.yml
  - Configura Joomla + MySQL + phpMyAdmin + Mailpit
  - Crea package.json, jkit.config.js, README.md, .gitignore
  - Soporte para Joomla 3.10, 4.x, 5.x
  - Prompts interactivos traducidos

- [x] `jkit create` - **ESTRUCTURA CREADA** ⚠️
  - Estructura del comando lista
  - Validación de tipos de extensión
  - Mensajes traducidos
  - **FALTA**: Implementación de generación

- [x] `jkit dev` - **ESTRUCTURA CREADA** ⚠️
  - Estructura del comando lista
  - **FALTA**: Integración con Vite HMR

- [x] `jkit build` - **ESTRUCTURA CREADA** ⚠️
  - Estructura del comando lista
  - **FALTA**: Build con Vite para producción

- [x] `jkit package` - **ESTRUCTURA CREADA** ⚠️
  - Estructura del comando lista
  - **FALTA**: Generación de archivos .zip

#### 6. Templates de Extensiones (100% Completado) ✅

Todos los templates están completos y listos para usar:

##### Component (Componente)
- ✅ manifest.xml con namespace, DI, SQL
- ✅ admin/services/provider.php (Dependency Injection)
- ✅ admin/src/Extension/{{COMPONENT_CLASS}}Component.php
- ✅ admin/src/Controller/DisplayController.php
- ✅ admin/config.xml
- ✅ media/js/{{COMPONENT_NAME}}.ts (TypeScript)
- ✅ media/css/{{COMPONENT_NAME}}.scss (SCSS completo)
- ✅ README.md

##### Module (Módulo)
- ✅ manifest.xml con parámetros configurables
- ✅ src/Helper/{{MODULE_CLASS}}Helper.php
- ✅ tmpl/default.php con WebAssetManager
- ✅ Soporte para site y administrator

##### Plugin
- ✅ manifest.xml con grupos
- ✅ src/Extension/{{PLUGIN_CLASS}}.php con SubscriberInterface
- ✅ Event-based architecture moderna

##### Template (Tema/Plantilla)
- ✅ index.php - Layout principal responsive
- ✅ component.php - Vista simplificada
- ✅ error.php - Página de error personalizada
- ✅ offline.php - Página de mantenimiento con login
- ✅ templateDetails.xml - 9 posiciones de módulos
- ✅ joomla.asset.json - Definiciones de assets
- ✅ scss/template.scss - 400+ líneas de SCSS profesional
- ✅ js/template.ts - TypeScript con funcionalidades completas

##### Library (Librería)
- ✅ manifest.xml con namespace
- ✅ src/{{LIBRARY_CLASS}}.php - Singleton pattern
- ✅ src/Helper/Helper.php - 8 métodos útiles
- ✅ README.md con documentación completa

**Total de templates**: 5 tipos de extensión, 25 archivos, 2,312 líneas de código

### ⚠️ En Progreso (0%)

Nada actualmente en progreso.

### ❌ Pendiente (Ver ROADMAP.md)

1. **Comando `create` - Implementación Completa**
2. **Utilidades de Procesamiento de Templates**
3. **Comando `dev` con Vite**
4. **Comando `build` para Producción**
5. **Comando `package` para Distribución**
6. **Sistema de Testing**

## 📁 Estructura del Proyecto

```
joomla-devkit/
├── .claude/                    # Documentación de contexto
│   └── context-es.md          # Este archivo
├── .devcontainer/             # Dev Container para desarrollo
│   └── devcontainer.json
├── .github/
│   └── workflows/             # GitHub Actions
│       ├── release.yml        # Release automático
│       └── commitlint.yml     # Validación de commits
├── .husky/                    # Git hooks
│   └── commit-msg            # Validación commitlint
├── bin/                       # [DEPRECATED - NO USAR]
├── src/
│   ├── bin/
│   │   └── jkit.ts           # CLI principal con i18n
│   ├── cli/                   # Comandos del CLI
│   │   ├── init.ts           # ✅ FUNCIONAL
│   │   ├── create.ts         # ⚠️ PENDIENTE implementación
│   │   ├── dev.ts            # ⚠️ PENDIENTE implementación
│   │   ├── build.ts          # ⚠️ PENDIENTE implementación
│   │   └── package.ts        # ⚠️ PENDIENTE implementación
│   ├── locales/               # Traducciones i18n
│   │   ├── en/               # Inglés
│   │   │   ├── common.json
│   │   │   └── commands.json
│   │   └── es/               # Español
│   │       ├── common.json
│   │       └── commands.json
│   ├── templates/             # Templates de extensiones
│   │   ├── devcontainer/      # Template para proyectos
│   │   │   ├── devcontainer.json
│   │   │   └── docker-compose.yml
│   │   └── extension/         # Templates de extensiones Joomla
│   │       ├── component/     # ✅ Completo
│   │       ├── module/        # ✅ Completo
│   │       ├── plugin/        # ✅ Completo
│   │       ├── template/      # ✅ Completo
│   │       └── library/       # ✅ Completo
│   ├── types/                 # TypeScript tipos
│   │   ├── config.ts          # Configuraciones
│   │   ├── manifest.ts        # Manifiestos Joomla
│   │   └── index.ts
│   └── utils/                 # Utilidades
│       └── i18n.ts            # Sistema i18n
├── dist/                      # Compilado TypeScript (gitignored)
├── tests/                     # Tests (PENDIENTE)
├── .commitlintrc.json         # Configuración commitlint
├── .editorconfig
├── .eslintrc.json             # ESLint para TypeScript
├── .gitignore
├── .prettierrc.json
├── .releaserc.json            # semantic-release
├── CONTRIBUTING.md            # Inglés
├── CONTRIBUTING.es.md         # Español
├── LICENSE                    # MIT
├── package.json
├── README.md                  # Inglés
├── README.es.md               # Español
├── ROADMAP.md                 # Hoja de ruta
└── tsconfig.json              # TypeScript configuración
```

## 🛠️ Tecnologías Utilizadas

### Core
- **Node.js**: >= 18.0.0
- **TypeScript**: 5.3.3 (strict mode)
- **Commander.js**: CLI framework
- **i18next**: Internacionalización

### Desarrollo
- **tsx**: Ejecución TypeScript directa
- **ESLint**: Linting con reglas TypeScript
- **Prettier**: Formateo de código
- **Husky**: Git hooks
- **commitlint**: Validación de commits convencionales

### Build y Release
- **tsc**: Compilador TypeScript
- **semantic-release**: Releases automáticos
- **@semantic-release/changelog**: Generación CHANGELOG
- **@semantic-release/git**: Commits de release

### UI/UX
- **chalk**: Colores en terminal
- **inquirer**: Prompts interactivos
- **ora**: Spinners de carga

### Planeado
- **Vite**: Build system (pendiente integración)
- **Vitest**: Testing framework (pendiente)

## 🎨 Sistema de Variables de Template

Todos los templates usan un sistema de placeholders que deben ser reemplazados:

### Variables Comunes (todos los tipos)
```
{{AUTHOR}}              - Nombre del autor
{{AUTHOR_EMAIL}}        - Email del autor
{{AUTHOR_URL}}          - URL del autor
{{COPYRIGHT}}           - Información de copyright
{{LICENSE}}             - Licencia (ej: "GPL-2.0-or-later", "MIT")
{{VERSION}}             - Versión (ej: "1.0.0")
{{DESCRIPTION}}         - Descripción de la extensión
{{CREATION_DATE}}       - Fecha de creación (ej: "January 2025")
{{NAMESPACE}}           - Namespace PHP (ej: "MyCompany\Component\Example")
{{PACKAGE_NAME}}        - Nombre del paquete
```

### Variables por Tipo de Extensión

#### Component
```
{{COM_NAME}}            - Nombre legible (ej: "COM_EXAMPLE")
{{COMPONENT_NAME}}      - Nombre técnico (ej: "com_example")
{{COMPONENT_CLASS}}     - Nombre de clase (ej: "Example")
{{COMPONENT_UPPER}}     - Mayúsculas (ej: "EXAMPLE")
{{DEFAULT_VIEW}}        - Vista predeterminada (ej: "items")
```

#### Module
```
{{MOD_NAME}}            - Nombre legible (ej: "MOD_EXAMPLE")
{{MODULE_NAME}}         - Nombre técnico (ej: "mod_example")
{{MODULE_CLASS}}        - Nombre de clase (ej: "Example")
{{MODULE_UPPER}}        - Mayúsculas (ej: "EXAMPLE")
{{CLIENT}}              - Cliente (ej: "site" o "administrator")
{{CLIENT_CLASS}}        - Cliente capitalizado (ej: "Site" o "Administrator")
```

#### Plugin
```
{{PLG_NAME}}            - Nombre legible (ej: "PLG_SYSTEM_EXAMPLE")
{{PLUGIN_NAME}}         - Nombre técnico (ej: "example")
{{PLUGIN_CLASS}}        - Nombre de clase (ej: "Example")
{{PLUGIN_UPPER}}        - Mayúsculas (ej: "EXAMPLE")
{{PLUGIN_GROUP}}        - Grupo (ej: "system", "content", "user")
{{PLUGIN_GROUP_CLASS}}  - Grupo capitalizado (ej: "System")
{{PLUGIN_GROUP_UPPER}}  - Grupo mayúsculas (ej: "SYSTEM")
```

#### Template
```
{{TEMPLATE_NAME}}       - Nombre técnico (ej: "mytemplate")
{{TEMPLATE_CLASS}}      - Nombre de clase (ej: "Mytemplate")
{{TEMPLATE_UPPER}}      - Mayúsculas (ej: "MYTEMPLATE")
{{CLIENT}}              - Cliente (ej: "site" o "administrator")
```

#### Library
```
{{LIB_NAME}}            - Nombre legible (ej: "My Library")
{{LIBRARY_NAME}}        - Nombre técnico (ej: "mylib")
{{LIBRARY_CLASS}}       - Nombre de clase (ej: "Mylib")
{{LIBRARY_UPPER}}       - Mayúsculas (ej: "MYLIB")
```

## 🔄 Versionado y Releases

### Versionado Semántico
- **MAJOR (X.0.0)**: Cambios incompatibles (breaking changes)
- **MINOR (0.X.0)**: Nuevas características (backwards compatible)
- **PATCH (0.0.X)**: Correcciones de bugs

### Commits Convencionales
```
feat:     Nueva característica (minor bump)
fix:      Corrección de bug (patch bump)
docs:     Solo documentación
style:    Cambios de formato
refactor: Refactorización sin cambios de comportamiento
perf:     Mejoras de rendimiento
test:     Agregar o actualizar tests
build:    Cambios en sistema de build o dependencias
ci:       Cambios en CI/CD
chore:    Otros cambios
feat!:    Breaking change (major bump)
```

### Release Automático
1. Commits se pushean a `main`
2. GitHub Actions ejecuta semantic-release
3. Se analiza el historial de commits
4. Se determina la nueva versión automáticamente
5. Se genera CHANGELOG.md
6. Se crea tag de Git y GitHub Release
7. Se publica a npm (si está configurado)

## 🚀 Cómo Empezar a Desarrollar

### 1. Clonar y Setup

```bash
# Clonar el repositorio
git clone https://github.com/alebak/joomla-devkit.git
cd joomla-devkit

# Instalar dependencias
npm install

# (Opcional) Abrir en Dev Container con VS Code
code .
# Clic en "Reopen in Container"
```

### 2. Comandos de Desarrollo

```bash
# Ejecutar el CLI en modo desarrollo (sin compilar)
npm run dev -- init test-project

# Compilar TypeScript
npm run build

# Compilar y watch
npm run build:watch

# Linting
npm run lint
npm run lint:fix

# Formatear código
npm run format

# Testing (cuando esté implementado)
npm test
```

### 3. Probar Localmente

```bash
# Hacer el CLI disponible globalmente (link local)
npm link

# Ahora puedes usar jkit globalmente
jkit init my-test-project
cd my-test-project
```

### 4. Hacer Commits

```bash
# Siempre usar commits convencionales
git add .
git commit -m "feat: add new feature"
# o
git commit -m "fix: resolve bug in init command"
```

El hook de commitlint validará automáticamente.

## 📝 Tareas Prioritarias

Ver archivo **ROADMAP.md** para la lista completa y detallada.

### Prioridad Alta 🔴
1. **Implementar comando `create`**
   - Procesar templates
   - Reemplazar variables
   - Copiar archivos con nombres dinámicos
   - Generar estructura de directorios

2. **Crear utilidades de template**
   - Helper para reemplazar placeholders
   - Copiar recursivo con renombrado
   - Validaciones

### Prioridad Media 🟡
3. **Implementar comando `dev`**
   - Integrar Vite
   - HMR para assets
   - Watch mode

4. **Implementar comando `build`**
   - Compilar TypeScript/JavaScript
   - Compilar SCSS/CSS
   - Minificación

5. **Implementar comando `package`**
   - Crear estructura de archivos para Joomla
   - Generar .zip
   - Validar manifiestos

### Prioridad Baja 🟢
6. **Testing**
   - Setup Vitest
   - Tests unitarios
   - Tests de integración

7. **Mejoras**
   - Más templates
   - Más opciones de configuración
   - Comandos adicionales

## 🐛 Problemas Conocidos

Ninguno actualmente.

## 💡 Notas Importantes para Claude Code

1. **NO usar el directorio `bin/` antiguo**: El entry point correcto es `src/bin/jkit.ts`

2. **Compilación antes de publicar**: Siempre ejecutar `npm run build` antes de probar el CLI compilado

3. **Templates listos**: Todos los templates en `src/templates/extension/` están 100% completos y listos para usar

4. **i18n configurado**: Al agregar nuevos mensajes, actualizar tanto `en/` como `es/` en `src/locales/`

5. **Tipos TypeScript**: Usar las interfaces en `src/types/` para type safety completo

6. **Commits**: El proyecto usa commits convencionales estrictos - todos los commits deben seguir el formato

7. **Branches**: Desarrollar en branches `feat/*` o `fix/*` y hacer PR a `main` para triggers de release

## 📚 Referencias

- [Joomla 5 Documentation](https://docs.joomla.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

## 👥 Contacto

- **Repositorio**: https://github.com/alebak/joomla-devkit
- **Issues**: https://github.com/alebak/joomla-devkit/issues
- **Autor**: alebak

---

**Última actualización**: 2025-01-17
**Versión actual**: 0.1.0
**Estado**: En desarrollo activo 🚧
