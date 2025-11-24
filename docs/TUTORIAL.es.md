# 🚀 Tutorial Completo de jkit - Paso a Paso (Español)

Este tutorial te guiará a través de todas las funcionalidades de **jkit (Joomla Development Kit)**, desde la instalación hasta la creación de un proyecto completo de Joomla con múltiples extensiones.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18
- **npm** o **yarn**
- **Git**
- (Opcional) **Docker** y **VS Code** para Dev Container

Verifica tus versiones:

```bash
node --version  # Debe ser >= 18
npm --version
git --version
```

---

## Parte 1: Instalación de jkit

### Paso 1.1: Instalar jkit globalmente

```bash
# Desde el directorio del proyecto jkit
cd /workspaces/joomla-devkit
npm install
npm run build
npm link
```

### Paso 1.2: Verificar instalación

```bash
jkit --version
jkit --help
```

Deberías ver la versión 0.1.0 y la lista de comandos disponibles.

---

## Parte 2: Crear Tu Primer Proyecto

### Paso 2.1: Inicializar un nuevo proyecto

Vamos a crear un proyecto llamado "miblog" - un sistema de blog completo para Joomla.

```bash
# Navega a tu directorio de trabajo (por ejemplo /tmp)
cd /tmp

# Crea el proyecto
jkit init miblog

# Responde las preguntas:
# - Versión de Joomla: 5.0 (presiona Enter para usar default)
# - Nombre del autor: Tu Nombre
# - Email: tu@email.com
# - Saltar Dev Container: Y (para este tutorial)
```

### Paso 2.2: Explorar la estructura creada

```bash
cd miblog
tree -L 2

# Deberías ver:
# miblog/
# ├── src/                 # Aquí irán tus extensiones
# ├── dist/                # Paquetes compilados (.zip)
# ├── jkit.config.json     # Configuración del proyecto
# ├── package.json
# └── README.md
```

### Paso 2.3: Ver la configuración

```bash
cat jkit.config.json
```

---

## Parte 3: Crear Extensiones

Ahora vamos a crear un conjunto completo de extensiones para nuestro blog.

### Paso 3.1: Crear un Componente (com_blog)

El componente es el corazón de nuestro sistema de blog.

```bash
jkit create component com_blog

# Responde:
# - Descripción: "Componente de blog con artículos y categorías"
# - Namespace: (presiona Enter para usar auto-generado)
```

**Explorar lo creado:**

```bash
tree src/com_blog -L 2

# Verás:
# src/com_blog/
# ├── admin/               # Backend (administrador)
# │   ├── src/
# │   ├── tmpl/
# │   └── sql/
# ├── site/                # Frontend (sitio)
# │   ├── src/
# │   └── tmpl/
# ├── media/               # Assets (CSS, JS)
# │   ├── css/
# │   └── js/
# └── manifest.xml
```

### Paso 3.2: Crear un Módulo de Sitio (mod_ultimos_posts)

Un módulo para mostrar los últimos posts en el frontend.

```bash
jkit create module mod_ultimos_posts --client site

# Responde:
# - Descripción: "Mostrar últimos artículos del blog"
```

**Explorar:**

```bash
tree src/mod_ultimos_posts -L 2
cat src/mod_ultimos_posts/manifest.xml
```

Nota que el manifest tiene `client="site"`.

### Paso 3.3: Crear un Módulo de Administración (mod_estadisticas_blog)

Un módulo para el panel de administración.

```bash
jkit create module mod_estadisticas_blog --client administrator

# Responde:
# - Descripción: "Mostrar estadísticas del blog en el panel admin"
```

**Verificar:**

```bash
grep 'client=' src/mod_estadisticas_blog/manifest.xml
# Deberías ver: client="administrator"
```

### Paso 3.4: Crear Plugins

Vamos a crear dos plugins: uno del sistema y uno de contenido.

**Plugin de Sistema:**

```bash
jkit create plugin ayudante_blog --group system

# Responde:
# - Descripción: "Plugin del sistema para mejoras del blog"
```

**Plugin de Contenido:**

```bash
jkit create plugin compartir_social --group content

# Responde:
# - Descripción: "Añadir botones de compartir en redes sociales"
```

**Verificar plugins:**

```bash
ls -la src/plg_*

# Deberías ver:
# src/plg_content_compartir_social/
# src/plg_system_ayudante_blog/
```

### Paso 3.5: Crear una Plantilla (tpl_tema_blog)

```bash
jkit create template tema_blog --client site

# Responde:
# - Descripción: "Plantilla personalizada para el blog"
```

**Explorar la plantilla:**

```bash
tree src/tpl_tema_blog -L 1

# Verás archivos como:
# - index.php
# - templateDetails.xml
# - component.php
# - error.php
# - offline.php
# - joomla.asset.json
# - scss/, js/, etc.
```

### Paso 3.6: Crear una Biblioteca (lib_utilidades_blog)

```bash
jkit create library utilidades_blog

# Responde:
# - Descripción: "Utilidades compartidas para componentes del blog"
```

**Verificar:**

```bash
cat src/lib_utilidades_blog/manifest.xml | grep libraryname
# Deberías ver: <libraryname>utilidades_blog</libraryname>
```

### Paso 3.7: Crear un Paquete (pkg_miblog)

El paquete agrupa todas las extensiones en un único instalador.

```bash
jkit create package pkg_miblog

# Responde:
# - Descripción: "Paquete completo de blog con todas las extensiones"
```

**Explorar el paquete:**

```bash
cat src/pkg_miblog/manifest.xml
cat src/pkg_miblog/script.php
cat src/pkg_miblog/README.md
```

---

## Parte 4: Ver Tu Proyecto Completo

### Paso 4.1: Listar todas las extensiones

```bash
tree src/ -L 1

# Deberías ver:
# src/
# ├── com_blog/
# ├── mod_ultimos_posts/
# ├── mod_estadisticas_blog/
# ├── plg_system_ayudante_blog/
# ├── plg_content_compartir_social/
# ├── tpl_tema_blog/
# ├── lib_utilidades_blog/
# └── pkg_miblog/
```

### Paso 4.2: Ver la configuración actualizada

```bash
cat jkit.config.json

# Verás todas las extensiones registradas con su metadata
```

---

## Parte 5: Configurar el Paquete

### Paso 5.1: Editar el manifest del paquete

Vamos a agregar las extensiones al paquete para que se instalen juntas.

```bash
# Abre el manifest en tu editor favorito
nano src/pkg_miblog/manifest.xml
# O usa: code src/pkg_miblog/manifest.xml
```

**Reemplaza la sección `<files folder="packages">` con:**

```xml
<files folder="packages">
    <!-- Componente -->
    <file type="component" id="com_blog">com_blog.zip</file>

    <!-- Módulos -->
    <file type="module" id="mod_ultimos_posts" client="site">mod_ultimos_posts.zip</file>
    <file type="module" id="mod_estadisticas_blog" client="administrator">mod_estadisticas_blog.zip</file>

    <!-- Plugins -->
    <file type="plugin" id="ayudante_blog" group="system">plg_system_ayudante_blog.zip</file>
    <file type="plugin" id="compartir_social" group="content">plg_content_compartir_social.zip</file>

    <!-- Plantilla -->
    <file type="template" id="tema_blog" client="site">tpl_tema_blog.zip</file>

    <!-- Biblioteca -->
    <file type="library" id="utilidades_blog">lib_utilidades_blog.zip</file>
</files>
```

**Guardar y cerrar** (Ctrl+X, Y, Enter en nano).

---

## Parte 6: Desarrollo y Compilación

### Paso 6.1: Modo desarrollo (opcional)

Si quieres trabajar con Hot Module Replacement:

```bash
# Para una extensión específica
jkit dev com_blog

# O para todo el proyecto
jkit dev

# Presiona Ctrl+C para detener
```

### Paso 6.2: Compilar extensiones

```bash
# Compilar todas las extensiones
jkit build

# O compilar una específica
jkit build com_blog
```

**Ver resultados:**

```bash
ls -lh dist/

# Deberías ver archivos .zip para cada extensión
```

---

## Parte 7: Crear Paquetes de Distribución

### Paso 7.1: Empaquetar todas las extensiones

```bash
jkit package

# Esto creará archivos .zip en dist/ para cada extensión
```

### Paso 7.2: Verificar paquetes creados

```bash
ls -lh dist/*.zip

# Deberías ver:
# com_blog.zip
# mod_ultimos_posts.zip
# mod_estadisticas_blog.zip
# plg_system_ayudante_blog.zip
# plg_content_compartir_social.zip
# tpl_tema_blog.zip
# lib_utilidades_blog.zip
# pkg_miblog.zip  ← Este contiene todos los demás
```

---

## Parte 8: Instalación en Joomla

### Paso 8.1: Preparar para instalar

```bash
# Verifica que tienes el paquete principal
ls -lh dist/pkg_miblog.zip
```

### Paso 8.2: Instalar en Joomla (pasos)

1. Accede al administrador de tu sitio Joomla
2. Ve a **Sistema → Instalar → Extensiones**
3. Sube el archivo `dist/pkg_miblog.zip`
4. Joomla instalará automáticamente todas las extensiones incluidas
5. Verifica en **Sistema → Extensiones** que todo se instaló correctamente

---

## Parte 9: Trabajar con Archivos de Extensión

### Paso 9.1: Editar un componente

```bash
# Ver estructura del componente
tree src/com_blog/admin/src -L 2

# Editar un controlador (ejemplo)
nano src/com_blog/admin/src/Controller/DisplayController.php
```

### Paso 9.2: Añadir estilos a un módulo

```bash
# Crear un archivo CSS
echo "/* Estilos del Módulo de Últimos Posts */
.mod-ultimos-posts {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.mod-ultimos-posts h3 {
    margin-bottom: 10px;
    color: #333;
}
" > src/mod_ultimos_posts/media/css/module.css
```

### Paso 9.3: Añadir JavaScript a la plantilla

```bash
# Editar el archivo JS principal
echo "// JavaScript del Tema del Blog
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tema del Blog Cargado');

    // Ejemplo: Smooth scroll
    document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
" > src/tpl_tema_blog/js/template.js
```

### Paso 9.4: Recompilar después de cambios

```bash
# Recompilar todo
jkit build

# O recompilar solo lo que cambiaste
jkit build mod_ultimos_posts
jkit build tpl_tema_blog
```

---

## Parte 10: Comandos Útiles

### Resumen de comandos jkit

```bash
# Ayuda general
jkit --help

# Ayuda de un comando específico
jkit create --help
jkit dev --help

# Crear proyecto nuevo
jkit init <nombre> [opciones]

# Crear extensión
jkit create <tipo> <nombre> [opciones]
# Tipos: component, module, plugin, template, library, package

# Desarrollo con HMR
jkit dev [nombre-extension]

# Compilar
jkit build [nombre-extension]

# Empaquetar
jkit package [nombre-extension]

# Versión
jkit --version
```

### Opciones comunes

```bash
# Modo no interactivo (útil para CI/CD)
jkit init miblog \
  --author "Juan Pérez" \
  --email "juan@ejemplo.com" \
  --no-devcontainer

jkit create component com_prueba \
  --author "Juan Pérez" \
  --email "juan@ejemplo.com" \
  --description "Componente de prueba" \
  --license "GPL-2.0-or-later"

# Opciones de extensiones
--client site|administrator  # Para módulos y plantillas
--group <grupo>              # Para plugins (system, content, etc.)
--namespace <namespace>      # Namespace PHP personalizado
```

---

## Parte 11: Consejos y Mejores Prácticas

### 11.1: Estructura de directorios

✅ **Hacer:**
- Mantén cada extensión en su propio directorio en `src/`
- Usa nombres descriptivos (com_blog, no com_b)
- Sigue las convenciones de Joomla para prefijos

❌ **Evitar:**
- No edites archivos en `dist/` (se sobrescriben al compilar)
- No mezcles código de diferentes extensiones

### 11.2: Desarrollo iterativo

```bash
# Flujo de trabajo recomendado:
1. jkit create <tipo> <nombre>  # Crear extensión
2. Editar archivos en src/<nombre>/
3. jkit build <nombre>           # Compilar
4. jkit package <nombre>         # Empaquetar
5. Instalar en Joomla de prueba
6. Repetir desde paso 2
```

### 11.3: Control de versiones

```bash
# Inicializar git si no lo has hecho
git init
git add .
git commit -m "Commit inicial: proyecto miblog"

# .gitignore recomendado (ya incluido)
node_modules/
dist/
.devcontainer/
```

### 11.4: Namespaces

Los namespaces se generan automáticamente siguiendo la convención:

```php
// Componente
Autor\Component\Blog\Administrator\...
Autor\Component\Blog\Site\...

// Módulo
Autor\Module\UltimosPosts\...

// Plugin
Autor\Plugin\System\AyudanteBlog\...

// Plantilla
Autor\Template\TemaBlog\...

// Biblioteca
Autor\Library\UtilidadesBlog\...
```

---

## Parte 12: Solución de Problemas

### Problema: "Command not found: jkit"

```bash
# Solución: Reinstalar y vincular
cd /workspaces/joomla-devkit
npm run build
npm link
```

### Problema: "Template not found"

```bash
# Solución: Asegúrate de estar en el directorio del proyecto
pwd  # Debe mostrar tu proyecto, ej: /tmp/miblog
ls jkit.config.json  # Debe existir
```

### Problema: "Extension already exists"

```bash
# Solución: Elimina la extensión existente o usa otro nombre
rm -rf src/com_nombre
# O edita jkit.config.json y elimina la entrada
```

### Problema: Build falla

```bash
# Verifica que tienes todas las dependencias
npm install

# Limpia y reconstruye
rm -rf dist/*
jkit build
```

---

## Parte 13: Proyecto de Ejemplo Completo

Aquí está un resumen del proyecto que acabamos de crear:

```
📦 miblog - Sistema de Blog Completo
├─ 🔷 com_blog                       - Componente principal
├─ 📦 mod_ultimos_posts              - Módulo: últimos posts (sitio)
├─ 📦 mod_estadisticas_blog          - Módulo: estadísticas (admin)
├─ 🔌 plg_system_ayudante_blog       - Plugin sistema
├─ 🔌 plg_content_compartir_social   - Plugin contenido
├─ 🎨 tpl_tema_blog                  - Plantilla del blog
├─ 📚 lib_utilidades_blog            - Biblioteca compartida
└─ 📦 pkg_miblog                     - Paquete todo-en-uno
```

**Instalación:** Un solo archivo ZIP instala todo.

---

## Parte 14: Siguientes Pasos

### Aprender más

1. **Documentación oficial de Joomla (español):**
   - https://docs.joomla.org/
   - Busca la sección de desarrollo de extensiones

2. **Explorar plantillas generadas:**
   - Revisa los archivos en `src/templates/extension/` de jkit
   - Estudia la estructura de cada tipo de extensión

3. **Personalizar configuración:**
   - Edita `jkit.config.json` para defaults del proyecto
   - Añade configuraciones de Vite personalizadas

### Contribuir a jkit

```bash
# Fork y clone el repositorio
git clone https://github.com/alebak/joomla-devkit
cd joomla-devkit

# Crea una rama para tu feature
git checkout -b feature/mi-mejora

# Haz tus cambios y pruebas
npm test

# Commit y push
git commit -m "feat: mi mejora"
git push origin feature/mi-mejora

# Crea un Pull Request en GitHub
```

---

## 🎉 ¡Felicitaciones!

Has completado el tutorial completo de **jkit**. Ahora sabes cómo:

✅ Inicializar proyectos de Joomla
✅ Crear los 6 tipos de extensiones
✅ Configurar paquetes multi-extensión
✅ Compilar y empaquetar para distribución
✅ Trabajar con el flujo de desarrollo

---

## 📚 Recursos Adicionales

- **Documentación:** `README.md` en el repositorio
- **Hoja de ruta:** `ROADMAP.md` para features planeadas
- **Problemas conocidos:** `docs/TESTING_KNOWN_ISSUES.md`
- **Contribuir:** `CONTRIBUTING.md`

---

**Última actualización:** 2025-11-24
**Versión de jkit:** 0.1.0
**Autor:** alebak
**Licencia:** GPL-2.0-or-later
