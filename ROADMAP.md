# 🗺️ jkit Roadmap

**Last Updated**: 2025-01-17
**Current Version**: 0.1.0
**Status**: 🚧 In Active Development

---

## 📊 Project Completion Status

| Component | Status | Progress |
|-----------|--------|----------|
| Core Infrastructure | ✅ Complete | 100% |
| TypeScript Setup | ✅ Complete | 100% |
| Internationalization | ✅ Complete | 100% |
| Documentation | ✅ Complete | 100% |
| Extension Templates | ✅ Complete | 100% |
| CLI Command: `init` | ✅ Complete | 100% |
| CLI Command: `create` | ⚠️ Pending | 0% |
| CLI Command: `dev` | ⚠️ Pending | 0% |
| CLI Command: `build` | ⚠️ Pending | 0% |
| CLI Command: `package` | ⚠️ Pending | 0% |
| Template Utilities | ⚠️ Pending | 0% |
| Vite Integration | ⚠️ Pending | 0% |
| Testing Framework | ⚠️ Pending | 0% |

**Overall Progress**: ~40% Complete

---

## 🔴 High Priority (v0.2.0)

### 1. Implement `create` Command ⚠️

**Goal**: Allow users to generate Joomla extensions using templates

**File**: `src/cli/create.ts`

**Tasks**:
- [ ] Complete implementation of `createCommand()` function
- [ ] Add interactive prompts for extension details
- [ ] Collect user input (name, author, namespace, etc.)
- [ ] Validate extension names and paths
- [ ] Call template processor with user data
- [ ] Generate extension files in proper directory structure
- [ ] Display success message with next steps

**Acceptance Criteria**:
```bash
jkit create component hello
# Should create: extensions/component/com_hello/
# With all files from template processed
```

**Estimated Complexity**: Medium
**Dependencies**: Template utilities (task #2)

---

### 2. Create Template Processing Utilities ⚠️

**Goal**: Provide reusable utilities to process templates with variable replacement

**New Files to Create**:
- `src/utils/template.ts` - Template variable replacement
- `src/utils/files.ts` - File operations with renaming
- `src/utils/validation.ts` - Input validation
- `src/utils/manifest.ts` - XML manifest generation

**Tasks**:

#### 2.1. Template Processor (`src/utils/template.ts`)
```typescript
/**
 * Replace template variables in content
 * @param content - Template content with {{VAR}} placeholders
 * @param variables - Object with variable values
 * @returns Processed content
 */
export function replaceVariables(content: string, variables: Record<string, string>): string

/**
 * Process entire template file
 * @param templatePath - Path to template file
 * @param outputPath - Where to write processed file
 * @param variables - Variables to replace
 */
export async function processTemplateFile(
  templatePath: string,
  outputPath: string,
  variables: Record<string, string>
): Promise<void>

/**
 * Process template directory recursively
 */
export async function processTemplateDirectory(
  templateDir: string,
  outputDir: string,
  variables: Record<string, string>
): Promise<void>
```

#### 2.2. File Utilities (`src/utils/files.ts`)
```typescript
/**
 * Copy file with dynamic naming
 * @param source - Source file path
 * @param destination - Destination path with {{VAR}} placeholders
 * @param variables - Variables for path replacement
 */
export async function copyFileWithRename(
  source: string,
  destination: string,
  variables: Record<string, string>
): Promise<void>

/**
 * Copy directory recursively with renaming
 */
export async function copyDirectoryWithRename(
  sourceDir: string,
  destDir: string,
  variables: Record<string, string>
): Promise<void>

/**
 * Ensure directory exists
 */
export async function ensureDir(path: string): Promise<void>
```

#### 2.3. Validation Utilities (`src/utils/validation.ts`)
```typescript
/**
 * Validate extension name
 */
export function validateExtensionName(name: string, type: ExtensionType): boolean

/**
 * Validate namespace
 */
export function validateNamespace(namespace: string): boolean

/**
 * Validate email
 */
export function validateEmail(email: string): boolean

/**
 * Generate namespace from extension name
 */
export function generateNamespace(author: string, type: string, name: string): string
```

**Acceptance Criteria**:
- All utilities have comprehensive TypeScript types
- All utilities have TSDoc documentation
- Template processing replaces all `{{VAR}}` occurrences
- File paths are renamed correctly (e.g., `{{COMPONENT_NAME}}.ts` → `com_example.ts`)
- Directory structures are created properly

**Estimated Complexity**: Medium
**Dependencies**: None

---

### 3. Variable Name Generator Utility ⚠️

**Goal**: Auto-generate all template variables from a base name

**File**: `src/utils/variables.ts`

**Tasks**:
- [ ] Implement `generateComponentVariables(name: string, options: ExtensionOptions)`
- [ ] Implement `generateModuleVariables(name: string, options: ExtensionOptions)`
- [ ] Implement `generatePluginVariables(name: string, group: string, options: ExtensionOptions)`
- [ ] Implement `generateTemplateVariables(name: string, options: ExtensionOptions)`
- [ ] Implement `generateLibraryVariables(name: string, options: ExtensionOptions)`
- [ ] Implement common variables generator (author, copyright, license, etc.)

**Example Usage**:
```typescript
const vars = generateComponentVariables('hello', {
  author: 'John Doe',
  email: 'john@example.com',
  license: 'GPL-2.0-or-later'
});

// Returns:
{
  COMPONENT_NAME: 'com_hello',
  COMPONENT_CLASS: 'Hello',
  COMPONENT_UPPER: 'HELLO',
  COM_NAME: 'COM_HELLO',
  NAMESPACE: 'MyCompany\\Component\\Hello',
  AUTHOR: 'John Doe',
  // ... etc
}
```

**Estimated Complexity**: Low
**Dependencies**: None

---

## 🟡 Medium Priority (v0.3.0)

### 4. Implement `dev` Command ⚠️

**Goal**: Start development server with Vite HMR

**File**: `src/cli/dev.ts`

**Tasks**:
- [ ] Detect project type (check for `jkit.config.js`)
- [ ] Read jkit configuration
- [ ] Generate Vite configuration dynamically
- [ ] Start Vite dev server with HMR
- [ ] Watch for file changes
- [ ] Live reload browser on changes
- [ ] Support for TypeScript/SCSS compilation
- [ ] Proxy to local Joomla installation if configured

**Vite Config Generation**:
```typescript
interface ViteConfigOptions {
  extensionType: ExtensionType;
  extensionName: string;
  sourcePath: string;
  joomlaPath?: string;
}

async function generateViteConfig(options: ViteConfigOptions): Promise<void>
```

**Acceptance Criteria**:
```bash
cd my-joomla-project/extensions/component/com_hello
jkit dev
# Starts Vite dev server on http://localhost:5173
# Hot reloads on file changes
```

**Estimated Complexity**: High
**Dependencies**: Vite package installation

---

### 5. Implement `build` Command ⚠️

**Goal**: Build extension assets for production

**File**: `src/cli/build.ts`

**Tasks**:
- [ ] Detect all extensions in project
- [ ] For each extension:
  - [ ] Compile TypeScript to JavaScript
  - [ ] Compile SCSS to CSS
  - [ ] Minify JavaScript
  - [ ] Minify CSS
  - [ ] Generate source maps
  - [ ] Copy compiled assets to `media/` directory
- [ ] Display build summary (file sizes, time)
- [ ] Support for single extension build: `jkit build com_hello`

**Acceptance Criteria**:
```bash
jkit build
# Compiles all extensions
# Output: media/com_hello/js/hello.min.js
#         media/com_hello/css/hello.min.css

jkit build com_hello
# Compiles only com_hello
```

**Estimated Complexity**: Medium-High
**Dependencies**: Vite, terser, cssnano

---

### 6. Implement `package` Command ⚠️

**Goal**: Create installable .zip files for Joomla

**File**: `src/cli/package.ts`

**Tasks**:
- [ ] Validate extension manifest.xml
- [ ] Build assets first (call build command)
- [ ] Create proper directory structure for Joomla
- [ ] Include all required files:
  - [ ] PHP files
  - [ ] XML manifest
  - [ ] Compiled assets (JS/CSS)
  - [ ] Language files
  - [ ] SQL files
  - [ ] README
- [ ] Exclude development files (.ts, .scss, node_modules)
- [ ] Create .zip file with proper naming: `com_example_1.0.0.zip`
- [ ] Generate checksum (MD5/SHA256)
- [ ] Optionally generate update server XML

**Acceptance Criteria**:
```bash
jkit package
# Creates: dist/com_hello_1.0.0.zip
# Ready to install in Joomla

jkit package com_hello
# Packages only com_hello
```

**Estimated Complexity**: Medium
**Dependencies**: archiver, xml2js

---

## 🟢 Low Priority (v0.4.0+)

### 7. Testing Framework Setup ⚠️

**Goal**: Set up comprehensive testing with Vitest

**Tasks**:
- [ ] Install Vitest and testing utilities
- [ ] Configure `vitest.config.ts`
- [ ] Set up test directory structure
- [ ] Create test helpers and fixtures
- [ ] Write unit tests for utilities
  - [ ] Template processor tests
  - [ ] File operation tests
  - [ ] Variable generator tests
  - [ ] Validation tests
- [ ] Write integration tests for CLI commands
  - [ ] `init` command tests
  - [ ] `create` command tests
  - [ ] `build` command tests
  - [ ] `package` command tests
- [ ] Set up coverage reporting
- [ ] Add tests to CI/CD pipeline

**Test Coverage Goal**: >80%

**Estimated Complexity**: Medium
**Dependencies**: Vitest, @vitest/ui

---

### 8. Additional Extension Templates ⚠️

**Goal**: Add more specialized templates

**Potential Templates**:
- [ ] Component with frontend editing
- [ ] Component with categories
- [ ] Component with tags support
- [ ] Module with cache support
- [ ] Plugin variations (authentication, user, finder, etc.)
- [ ] Custom field plugin
- [ ] CLI plugin (Joomla console)
- [ ] WebServices plugin (Joomla API)

**Estimated Complexity**: Medium per template

---

### 9. Advanced Features ⚠️

**Tasks**:
- [ ] Custom template support (user-defined templates)
- [ ] Extension update command: `jkit update`
- [ ] Joomla version migration tools
- [ ] Code generator for MVC parts:
  - `jkit generate:controller`
  - `jkit generate:model`
  - `jkit generate:view`
- [ ] Database migration generator
- [ ] Translation file generator
- [ ] Extension scaffolding from existing code

---

## 🔄 Continuous Improvements

### Documentation
- [ ] Video tutorials
- [ ] More examples
- [ ] Best practices guide
- [ ] Migration guide from other tools
- [ ] API documentation with TypeDoc

### Developer Experience
- [ ] Better error messages
- [ ] Progress indicators (spinners, progress bars)
- [ ] Colorful, informative output
- [ ] Interactive configuration wizard
- [ ] Auto-update checker

### Performance
- [ ] Parallel builds for multiple extensions
- [ ] Incremental compilation
- [ ] Build caching
- [ ] Faster template processing

---

## 📅 Version Milestones

### v0.2.0 - Template Generation (Target: Q1 2025)
- ✅ Complete extension templates
- ⚠️ Implement `create` command
- ⚠️ Template processing utilities
- ⚠️ Variable generators

### v0.3.0 - Development & Build (Target: Q2 2025)
- ⚠️ Vite integration
- ⚠️ `dev` command with HMR
- ⚠️ `build` command for production
- ⚠️ `package` command for distribution

### v0.4.0 - Testing & Polish (Target: Q2 2025)
- ⚠️ Testing framework
- ⚠️ Comprehensive test coverage
- ⚠️ Documentation improvements
- ⚠️ Performance optimizations

### v1.0.0 - Stable Release (Target: Q3 2025)
- All core features complete
- Production ready
- Comprehensive documentation
- Active community

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this roadmap.

**Priorities can change based on**:
- Community feedback
- Critical bugs
- New Joomla releases
- Technology updates

---

## 📝 Notes

- This roadmap is a living document
- Dates are estimates and subject to change
- Features may be added or removed based on feedback
- Version numbers follow [Semantic Versioning](https://semver.org/)

---

**Last Updated**: 2025-01-17
**Maintained by**: alebak
**Repository**: https://github.com/alebak/joomla-devkit
