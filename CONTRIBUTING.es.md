# Contribuyendo a jkit

**[English](CONTRIBUTING.md)** | **[Español](CONTRIBUTING.es.md)**

¡Gracias por tu interés en contribuir a jkit! Este documento proporciona pautas e instrucciones para contribuir.

## Código de Conducta

- Sé respetuoso e inclusivo
- Da la bienvenida a los recién llegados y fomenta perspectivas diversas
- Enfócate en retroalimentación constructiva
- Colabora abiertamente

## Primeros Pasos

1. **Hacer fork del repositorio** en GitHub
2. **Clonar tu fork** localmente:
   ```bash
   git clone https://github.com/TU_USUARIO/joomla-devkit.git
   cd joomla-devkit
   ```
3. **Instalar dependencias**:
   ```bash
   npm install
   ```
4. **Crear una rama de característica**:
   ```bash
   git checkout -b feat/mi-nueva-caracteristica
   ```

## Configuración de Desarrollo

Este proyecto usa un Dev Container para desarrollo. Puedes usar cualquiera de las dos opciones:

### Opción 1: Dev Container (Recomendado)

1. Abrir el proyecto en VS Code
2. Hacer clic en "Reabrir en contenedor" cuando se solicite
3. Esperar a que el contenedor se construya
4. ¡Comenzar a desarrollar!

### Opción 2: Desarrollo Local

1. Instalar Node.js >= 18
2. Ejecutar `npm install`
3. Iniciar desarrollo: `npm run dev`

## Convención de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para todos los mensajes de commit.

### Formato

```
<tipo>(<ámbito>): <asunto>

[cuerpo opcional]

[pie opcional]
```

### Tipos

- **feat**: Una nueva característica (bump de versión minor)
- **fix**: Una corrección de bug (bump de versión patch)
- **docs**: Cambios solo en documentación
- **style**: Cambios de estilo de código (formato, punto y coma, etc.)
- **refactor**: Cambio de código que no corrige un bug ni agrega una característica
- **perf**: Mejoras de rendimiento
- **test**: Agregar o actualizar tests
- **build**: Cambios en sistema de build o dependencias
- **ci**: Cambios en configuración de CI/CD
- **chore**: Otros cambios que no modifican archivos src o test
- **revert**: Revierte un commit anterior

### Cambios Incompatibles (Breaking Changes)

Para cambios incompatibles, agrega `!` después del tipo o incluye `BREAKING CHANGE:` en el pie:

```bash
feat!: rediseñar interfaz CLI

BREAKING CHANGE: La estructura de comandos ha sido completamente rediseñada.
Los comandos antiguos ya no funcionarán.
```

### Ejemplos

```bash
# Nueva característica
feat(cli): agregar soporte para extensiones de librería

# Corrección de bug
fix(vite): resolver ruta de assets en build de producción

# Documentación
docs(readme): actualizar instrucciones de instalación

# Cambio incompatible
feat(init)!: cambiar versión predeterminada de Joomla a 5.0

BREAKING CHANGE: La versión predeterminada de Joomla es ahora 5.0 en lugar de 4.4
```

## Validación de Commits

Este proyecto usa **commitlint** con un git hook para validar mensajes de commit.

Si tu mensaje de commit no sigue la convención:
```bash
$ git commit -m "mal mensaje de commit"
⧗   input: mal mensaje de commit
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
```

Corrígelo usando el formato correcto:
```bash
git commit -m "feat: agregar nueva característica"
```

## Proceso de Pull Request

1. **Actualizar tu rama** con los últimos cambios de main:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Ejecutar tests y linting**:
   ```bash
   npm run lint
   npm test
   ```

3. **Hacer push de tus cambios**:
   ```bash
   git push origin feat/mi-nueva-caracteristica
   ```

4. **Crear un Pull Request** en GitHub:
   - Usar un título claro y descriptivo
   - Seguir la plantilla de PR (si está disponible)
   - Vincular issues relacionados
   - Describir qué cambió y por qué
   - Agregar capturas/ejemplos si aplica

5. **Esperar revisión**:
   - Atender cualquier comentario de los revisores
   - Mantener commits limpios y atómicos
   - Actualizar tu PR según sea necesario

## Estándares de Código

### TypeScript

- Usar características de ES6+
- Seguir la configuración de ESLint
- Usar Prettier para formato
- Escribir nombres descriptivos para variables y funciones
- Agregar comentarios JSDoc para APIs públicas

### Estructura de Archivos

```
src/
├── cli/           # Implementaciones de comandos CLI
├── templates/     # Templates de extensiones y proyectos
├── builders/      # Lógica de build para extensiones
└── utils/         # Funciones utilitarias
```

### Testing

- Agregar tests para nuevas características
- Asegurar que todos los tests pasen antes de enviar PR
- Apuntar a buena cobertura de tests

## Versionado Semántico

Este proyecto sigue [Versionado Semántico](https://semver.org/):

- **MAJOR** (X.0.0): Cambios incompatibles
- **MINOR** (0.X.0): Nuevas características (compatibles hacia atrás)
- **PATCH** (0.0.X): Correcciones de bugs (compatibles hacia atrás)

Los bumps de versión se **determinan automáticamente** por mensajes de commit:
- `feat:` → Bump de versión Minor
- `fix:` → Bump de versión Patch
- `feat!:` o `BREAKING CHANGE:` → Bump de versión Major

## Proceso de Release

Los releases son **totalmente automáticos** usando semantic-release:

1. Los commits se pushean a la rama `main`
2. GitHub Actions ejecuta semantic-release
3. Semantic-release analiza los commits
4. Se determina la nueva versión
5. Se genera CHANGELOG.md
6. Se crea el tag de Git
7. Se publica el release de GitHub
8. El paquete se publica en npm (si está configurado)

¡No necesitas versionar o crear releases manualmente!

## Idiomas y Traducciones

jkit soporta múltiples idiomas. Al contribuir:

### Agregar Nuevas Traducciones

1. Crear archivos de traducción en `src/locales/[código-idioma]/`:
   ```
   src/locales/
   ├── en/
   │   ├── common.json
   │   └── commands.json
   ├── es/
   │   ├── common.json
   │   └── commands.json
   └── fr/  (nuevo)
       ├── common.json
       └── commands.json
   ```

2. Actualizar `src/utils/i18n.ts` para incluir el nuevo idioma

3. Traducir documentación:
   - Crear `README.[código-idioma].md`
   - Crear `CONTRIBUTING.[código-idioma].md`

### Actualizar Traducciones Existentes

- Mantener consistencia en terminología
- Usar lenguaje formal pero accesible
- Asegurar que los placeholders (`{{variable}}`) se mantengan intactos

## Documentación

### Comentarios TSDoc

Usar TSDoc para documentar APIs públicas:

```typescript
/**
 * Inicializa un nuevo proyecto de extensión de Joomla.
 *
 * @param name - Nombre del proyecto
 * @param options - Opciones de configuración
 * @returns Promesa que se resuelve cuando el proyecto es creado
 *
 * @example
 * ```typescript
 * await initCommand('mi-proyecto', { joomlaVersion: '5.0' });
 * ```
 */
export async function initCommand(
  name: string | undefined,
  options: InitOptions
): Promise<void> {
  // implementación
}
```

### Actualizar README

Cuando agregues nuevas características:
- Actualizar `README.md` (inglés)
- Actualizar `README.es.md` (español)
- Agregar ejemplos de uso
- Actualizar el roadmap si aplica

## ¿Preguntas?

- Abrir un issue para bugs o solicitudes de características
- Iniciar una discusión para preguntas o ideas
- Revisar issues existentes antes de crear nuevos

## Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la Licencia GPL-2.0-or-later.

---

¡Gracias por contribuir a jkit! 🚀
