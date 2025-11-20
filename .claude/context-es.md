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
- [x] ROADMAP.md (inglés)
- [x] ROADMAP.es.md (español)
- [x] LICENSE (GPL-2.0-or-later)
- [x] Enlaces de selección de idioma
- [x] Documentación sin duplicaciones (referencias entre archivos)

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

#### 5. Comandos CLI
- [x] `jkit init` - **FUNCIONAL** ✅
  - Crea nuevo proyecto con estructura completa
  - Genera Dev Container con docker-compose.yml
  - Configura Joomla + MySQL + phpMyAdmin + Mailpit
  - Crea package.json, jkit.config.js, README.md, .gitignore
  - Soporte para Joomla 3.10, 4.x, 5.x
  - Prompts interactivos traducidos

- [x] `jkit create` - **FUNCIONAL** ✅
  - Generación completa de extensiones
  - Soporte para todos los tipos: component, module, plugin, template, library
  - Prompts interactivos para detalles de extensión
  - Procesamiento completo de templates con variables
  - Validación de nombres, emails, namespaces
  - Generación automática de namespace si no se proporciona
  - Selección de grupo para plugins
  - Selección de cliente para módulos y templates
  - Actualización automática de jkit.config.json
  - Renombrado dinámico de archivos y directorios
  - Mensajes de éxito con próximos pasos
  - Probado exitosamente con componentes

- [x] `jkit dev` - **FUNCIONAL** ✅
  - Servidor de desarrollo con Vite
  - Hot Module Replacement (HMR) integrado
  - Auto-detección de extensión única
  - Selección manual con --extension
  - Puerto configurable con --port
  - Generación dinámica de configuración Vite
  - Entry points automáticos por tipo de extensión
  - Compilación de TypeScript/SCSS en tiempo real
  - Source maps para desarrollo
  - Apagado gracioso (Ctrl+C)
  - Manejo completo de errores

- [x] `jkit build` - **FUNCIONAL** ✅
  - Build de producción con Vite
  - Minificación de JavaScript y CSS
  - Tree-shaking de código no utilizado
  - Source maps opcionales con --sourcemap
  - Build de extensión específica con --extension
  - Build de todas las extensiones sin opciones
  - Optimización de assets
  - Muestra tamaño de salida
  - Resumen con contadores de éxito/fallos
  - Manejo robusto de errores

- [x] `jkit package` - **FUNCIONAL** ✅
  - Creación de archivos .zip con estructura Joomla
  - Generación de checksums MD5 y SHA256
  - Guardado de checksums en archivo checksums.txt
  - Extracción de versión desde manifest XML
  - Exclusión de archivos de desarrollo (.ts, .scss, node_modules)
  - Directorio staging temporal para preparación
  - Empaquetado de extensión específica con --extension
  - Empaquetado de todas las extensiones sin opciones
  - Directorio de salida configurable con --output
  - Reporte de tamaño en formato legible
  - Resumen completo con contadores de éxito/fallos
  - Limpieza automática de directorios temporales
  - Manejo robusto de errores

#### 6. Utilidades Implementadas ✅
- [x] **src/utils/validation.ts** - Validación completa
  - validateExtensionName() - Valida nombres por tipo
  - validateEmail() - Valida direcciones de email
  - validateUrl() - Valida URLs
  - validatePluginGroup() - Valida grupos de plugins
  - validateVersion() - Valida semantic versioning
  - generateNamespace() - Genera namespace PHP válido
  - sanitizeClassName() - Sanitiza para nombres de clase
  - sanitizeFileName() - Sanitiza para nombres de archivo

- [x] **src/utils/variables.ts** - Generador de variables
  - generateComponentVariables() - Variables de componente
  - generateModuleVariables() - Variables de módulo
  - generatePluginVariables() - Variables de plugin
  - generateTemplateVariables() - Variables de template
  - generateLibraryVariables() - Variables de librería
  - generateVariables() - Generador universal por tipo
  - Generación automática de fecha, copyright, namespace

- [x] **src/utils/template.ts** - Procesador de templates
  - replaceVariables() - Reemplaza {{VAR}} en strings
  - processTemplateFile() - Procesa archivo individual
  - processTemplateDirectory() - Procesa directorios recursivamente
  - getTemplateDirectory() - Obtiene ruta de template
  - templateExists() - Verifica existencia de template
  - listAvailableTemplates() - Lista templates disponibles

- [x] **src/utils/files.ts** - Operaciones de archivos
  - ensureDir() - Crea directorio recursivamente
  - pathExists() - Verifica existencia de ruta
  - copyFileWithRename() - Copia con renombrado dinámico
  - copyDirectoryWithRename() - Copia directorio con renombrado
  - readJsonFile() - Lee y parsea JSON
  - writeJsonFile() - Escribe JSON formateado
  - getFileSize() / getDirectorySize() - Tamaños
  - formatBytes() - Formatea bytes a legible
  - listFiles() - Lista archivos recursivamente

- [x] **src/utils/vite-config.ts** - Configurador de Vite
  - generateViteConfig() - Genera configuración Vite para extensión
  - getEntryPoints() - Determina entry points por tipo
  - mergeViteConfig() - Fusiona configuraciones
  - generateViteConfigFile() - Escribe archivo de configuración
  - Soporte para desarrollo y producción
  - SCSS con variables de entorno
  - HMR con overlay de errores
  - Minificación y source maps

#### 7. Templates de Extensiones (100% Completado) ✅

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

1. **Sistema de Testing con Vitest**
2. **Templates adicionales y opciones avanzadas**
3. **Comandos adicionales** (watch, serve, lint, test, etc.)

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
│   │   ├── create.ts         # ✅ FUNCIONAL
│   │   ├── dev.ts            # ✅ FUNCIONAL
│   │   ├── build.ts          # ✅ FUNCIONAL
│   │   └── package.ts        # ✅ FUNCIONAL
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
│       ├── i18n.ts            # Sistema i18n
│       ├── validation.ts      # ✅ Validaciones
│       ├── variables.ts       # ✅ Generador de variables
│       ├── template.ts        # ✅ Procesador de templates
│       ├── files.ts           # ✅ Operaciones de archivos
│       └── vite-config.ts     # ✅ Configurador de Vite
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
├── LICENSE                    # GPL-2.0-or-later
├── package.json
├── README.md                  # Inglés
├── README.es.md               # Español
├── ROADMAP.md                 # Hoja de ruta (inglés)
├── ROADMAP.es.md              # Hoja de ruta (español)
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

### Build y Assets
- **Vite**: Build system para desarrollo y producción
- **archiver**: Creación de archivos ZIP
- **crypto**: Generación de checksums (MD5, SHA256)
- **fs-extra**: Operaciones avanzadas de archivos

### UI/UX
- **chalk**: Colores en terminal
- **inquirer**: Prompts interactivos
- **ora**: Spinners de carga

### Pendiente de Integración
- **Vitest**: Testing framework (planeado)

## 🎨 Sistema de Variables de Template

Todos los templates usan un sistema de placeholders que deben ser reemplazados:

### Variables Comunes (todos los tipos)
```
{{AUTHOR}}              - Nombre del autor
{{AUTHOR_EMAIL}}        - Email del autor
{{AUTHOR_URL}}          - URL del autor
{{COPYRIGHT}}           - Información de copyright
{{LICENSE}}             - Licencia (default: "GPL-2.0-or-later")
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

### ✅ Comandos Core Completados

Todos los comandos principales del CLI están completamente implementados y funcionales:
- ✅ `jkit init` - Inicialización de proyectos
- ✅ `jkit create` - Creación de extensiones
- ✅ `jkit dev` - Servidor de desarrollo con HMR
- ✅ `jkit build` - Build de producción
- ✅ `jkit package` - Empaquetado para distribución

### Prioridad Alta 🔴
1. **Testing Framework** ⚠️ PENDIENTE
   - Setup Vitest
   - Tests unitarios para utilidades (validation, template, files, etc.)
   - Tests de integración para comandos CLI
   - Tests E2E para flujo completo
   - Cobertura mínima >80%
   - CI/CD con GitHub Actions

### Prioridad Media 🟡
2. **Comandos Adicionales**
   - `jkit watch` - Watch mode continuo para desarrollo
   - `jkit serve` - Servidor local para testing
   - `jkit lint` - Linting de código de extensiones
   - `jkit test` - Ejecutar tests de extensiones

3. **Update Server**
   - Generación de XML para servidor de actualizaciones
   - Integración con package command
   - Versionado automático

### Prioridad Baja 🟢
4. **Mejoras y Optimizaciones**
   - Más templates de extensiones
   - Plantillas personalizadas por usuario
   - Configuración avanzada de Vite
   - Plugins y extensibilidad del CLI
   - Soporte para múltiples versiones de Joomla
   - Migración desde joomla-gulp

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
