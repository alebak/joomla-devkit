# jkit - Kit de Desarrollo para Joomla

**[English](README.md)** | **[Español](README.es.md)**

Herramienta CLI moderna para el desarrollo de extensiones de Joomla con Vite y Dev Containers.

## Características

- **TypeScript Primero**: Escrito en TypeScript con seguridad de tipos completa (también soporta JavaScript)
- **Multilenguaje**: Soporte completo de internacionalización (Inglés y Español)
- **Sistema de Build Moderno**: Impulsado por Vite para un desarrollo ultrarrápido
- **Dev Container Listo**: Configuración automática de Docker con Joomla, MySQL, phpMyAdmin y Mailpit
- **Soporte Multi-Extensión**: Crea componentes, módulos, plugins, plantillas y librerías
- **Hot Module Replacement**: Actualizaciones instantáneas durante el desarrollo
- **Listo para Producción**: Builds optimizados con minificación y tree-shaking
- **Distribución Fácil**: Empaquetado con un solo comando para instalación en Joomla

## Instalación

```bash
npm install -g jkit
```

## Inicio Rápido

### 1. Crear un nuevo proyecto

```bash
jkit init mi-extension
cd mi-extension
```

### 2. Abrir en VS Code con Dev Container

```bash
code .
# Hacer clic en "Reabrir en contenedor" cuando se solicite
```

### 3. Crear tu primera extensión

```bash
# Crear un componente
jkit create component com_hola

# Crear un módulo
jkit create module mod_ultimos

# Crear un plugin
jkit create plugin system miplugin

# Crear una plantilla
jkit create template miplantilla

# Crear una librería
jkit create library milibreria
```

### 4. Iniciar desarrollo

```bash
jkit dev
```

### 5. Construir y empaquetar

```bash
jkit build
jkit package
```

## Comandos

### `jkit init [nombre]`

Inicializar un nuevo proyecto de extensión de Joomla con Dev Container.

```bash
jkit init mi-proyecto
jkit init mi-proyecto --joomla-version 4.4
jkit init mi-proyecto --no-devcontainer
```

**Opciones:**
- `-j, --joomla-version <version>`: Versión de Joomla (predeterminado: "5.0")
- `--no-devcontainer`: Omitir configuración de Dev Container

### `jkit create <tipo> <nombre>`

Crear una nueva extensión de Joomla.

**Tipos:** `component`, `module`, `plugin`, `template`, `library`

```bash
jkit create component com_micomponente
jkit create module mod_mimodulo --author "Juan Pérez"
jkit create plugin system miplugin --license MIT
```

**Opciones:**
- `-a, --author <autor>`: Autor de la extensión
- `-e, --email <email>`: Email del autor
- `-l, --license <licencia>`: Licencia (predeterminado: "GPL-2.0-or-later")

### `jkit dev`

Iniciar servidor de desarrollo con modo watch y Hot Module Replacement.

```bash
jkit dev
jkit dev --port 3000
```

**Opciones:**
- `-p, --port <puerto>`: Puerto del servidor de desarrollo (predeterminado: 5173)

### `jkit build`

Construir extensión para producción con optimizaciones.

```bash
jkit build
jkit build --extension com_micomponente
```

**Opciones:**
- `-e, --extension <nombre>`: Construir extensión específica

### `jkit package`

Crear paquete de distribución (.zip) listo para instalación en Joomla.

```bash
jkit package
jkit package --extension com_micomponente
jkit package --output ./releases
```

**Opciones:**
- `-e, --extension <nombre>`: Empaquetar extensión específica
- `-o, --output <ruta>`: Directorio de salida (predeterminado: "./dist")

## Servicios Dev Container

Cuando inicializas un proyecto con Dev Container, obtienes:

- **Joomla**: http://localhost:8080
- **phpMyAdmin**: http://localhost:8081
- **Mailpit UI**: http://localhost:8025 (pruebas de email)
- **MySQL**: localhost:3306
  - Base de datos: `joomla`
  - Usuario: `joomla`
  - Contraseña: `joomla`
  - Contraseña root: `root`

## Estructura del Proyecto

```
mi-proyecto/
├── .devcontainer/
│   ├── devcontainer.json
│   └── docker-compose.yml
├── extensions/
│   ├── com_micomponente/
│   ├── mod_mimodulo/
│   └── plg_system_miplugin/
├── src/
│   ├── assets/
│   └── shared/
├── dist/
├── jkit.config.js
└── package.json
```

## Configuración

Edita `jkit.config.js` en la raíz de tu proyecto:

```javascript
export default {
  joomlaVersion: '5.0',
  author: 'Tu Nombre',
  authorEmail: '[email protected]',
  license: 'GPL-2.0-or-later',

  extensions: {
    'com_micomponente': {
      // Configuración específica de la extensión
    }
  },

  vite: {
    // Configuración personalizada de Vite
  }
};
```

## Flujo de Desarrollo

1. **Inicializar proyecto**: `jkit init mi-extension`
2. **Abrir en Dev Container**: Configuración automática de Joomla
3. **Crear extensiones**: `jkit create component com_hola`
4. **Desarrollar con HMR**: `jkit dev`
5. **Construir optimizado**: `jkit build`
6. **Empaquetar para distribución**: `jkit package`
7. **Instalar en Joomla**: Subir el archivo .zip

## Comparación con joomla-gulp

| Característica | joomla-gulp | jkit |
|----------------|-------------|------|
| Lenguaje | JavaScript | TypeScript |
| Sistema de Build | Gulp | Vite |
| Velocidad | Moderada | Muy Rápida |
| HMR | No | Sí |
| Dev Container | No | Sí |
| Configuración Docker | Manual | Automática |
| CLI | No | Sí |
| Scaffolding de Extensiones | Manual | Automático |
| Seguridad de Tipos | No | Sí |
| JavaScript Moderno | Limitado | ES6+ Completo |

## Requisitos

- Node.js >= 18
- Docker (para Dev Container)
- VS Code (recomendado para Dev Container)

## Contribuir

¡Las contribuciones son bienvenidas! Por favor, lee [CONTRIBUTING.es.md](CONTRIBUTING.es.md) para detalles sobre el código de conducta y el proceso para enviar pull requests.

## Roadmap

Consulta [ROADMAP.md](ROADMAP.md) para el roadmap detallado del proyecto y características planeadas.

## Licencia

GPL-2.0-or-later - Ver archivo [LICENSE](LICENSE) para más detalles.

## Autor

Creado por alebak
