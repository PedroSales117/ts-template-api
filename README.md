<div id="header" align="center">
  <img src="https://avatars.githubusercontent.com/u/91754689?v=4" width="100" style="border-radius: 50%"/>
  <div id="badges">
  <a href="https://www.linkedin.com/in/pedro-henri-sales/">
    <img src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge"/>
  </a>
 </div>
</div>

# Configuração Inicial do Projeto TypeScript API

> ⚠️ **Importante:** Os `comandos` são executados em Terminal *Powershell* e os `commits` feitos em Terminal *Bash*.

Realize as etapas iniciais de configuração para um projeto TypeScript API, seguindo a série de mensagens de commit e comandos abaixo. Este guia não é obrigatorio, mas extremamente recomendado.


> *Este documento assume que você já realizou toda a criação e configuração obrigatoria do seu repositorio GIT.*


## Configurações

### Configuração Inicial do Projeto

**Mensagem de Commit:**
```
chore(initial): add package manager to project

- Add npm
- Create `.gitignore`
- Ignore `node_modules` folder
```

**Comandos:**
```powershell
npm init
$content = "node_modules"
$utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
[System.IO.File]::WriteAllText(".gitignore", $content, $utf8NoBomEncoding)
```

### Configuração do Linter de Mensagens de Commit e Hook de Pre-commit

**Mensagem de Commit:**
```
chore(commit-linter) add commit message linter and pre-commit hook

- Add `@commitlint/{config-conventional,cli}` to npm
- Create a commit linter configuration file
- Add husky to npm
- Set up husky and add pre-commit script
- Add prepare script for husky
```

**Comandos:**
```powershell
npm install -E -D husky @commitlint/{config-conventional,cli}
npx husky init
$content = "module.exports = {extends: ['@commitlint/config-conventional']}"
$utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
[System.IO.File]::WriteAllText("commitlint.config.js", $content, $utf8NoBomEncoding)
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

**Alterações em package.json:**
```json
"scripts": {
    "prepare": "husky install"
}
```

### Adição do TypeScript

**Mensagem de Commit:**
```
chore(node): add typescript

- Add node types to npm
- Add typescript to npm
- Create a configuration file for typescript
```

**Comandos:**
```powershell
npm install -E -D @types/node typescript
$content = '{"compilerOptions":{"target":"ES2021","module":"ES2020","moduleResolution":"node","esModuleInterop":true,"outDir":"./dist","strict":true,"rootDir":"./src","resolveJsonModule":true,"forceConsistentCasingInFileNames":true,"noImplicitReturns":true,"noUnusedLocals":true,"useUnknownInCatchVariables":false,"experimentalDecorators":true},"include":["src/**/*.ts"],"exclude":["node_modules"]}'
$utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
[System.IO.File]::WriteAllText("tsconfig.json", $content, $utf8NoBomEncoding)
```

### Configuração do Linter

**Mensagem de Commit:**
```
chore(linter): add linter

- Add eslint to npm
- Add eslint plugin for typescript code
- Add eslint parser for typescript code
- Create configuration for prettier
- Add eslint plugin for neverthrown
- Add eslint plugin for prettier
- Create a configuration file to eslint
```

**Comandos:**
```powershell
npm install -E -D eslint eslint-config-prettier eslint-plugin-neverthrow eslint-plugin-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
$content = '{"root":true,"parser":"@typescript-eslint/parser","parserOptions":{"ecmaVersion":"latest","sourceType":"module","project":"./tsconfig.json"},"plugins":["@typescript-eslint"],"extends":["prettier","eslint:recommended","plugin:prettier/recommended","plugin:@typescript-eslint/recommended","plugin:@typescript-eslint/recommended-requiring-type-checking","plugin:@typescript-eslint/strict"],"env":{"node":true,"jest":true,"es2021":true},"ignorePatterns":[".eslintrc.js","*.js"],"rules":{"@typescript-eslint/explicit-module-boundary-types":"off","@typescript-eslint/require-await":"off","@typescript-eslint/no-floating-promises":["error",{"ignoreVoid":true}],"@typescript-eslint/no-explicit-any":"warn","@typescript-eslint/explicit-function-return-type":["error",{"allowConciseArrowFunctionExpressionsStartingWithVoid":true}]}'
$utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
[System.IO.File]::WriteAllText(".eslintrc.json", $content, $utf8NoBomEncoding)
```

### Adição de Bundler para Código Pronto para Produção

**Mensagem de Commit:**
```
chore(bundler): add code bundler to generate production-ready code


- Add `digitak/esrun` to npm
- Add `esbuild` to npm
```

**Comandos:**
```shell
npm install -E -D @digitak/esrun esbuild
```

### Adição de Scripts NPM

**Mensagem de Commit:**
```
chore(npm): add scripts

- Add build script
- Add start development environment script
- Add start production environment script
```

**Alterações em package.json:**
```json
"scripts": {
    "start:dev": "esrun src/app.ts --target=node18 --sourcemap --splitting --outdir=dist --platform=node --packages=external --tsconfig=./tsconfig.json",
    "start": "node dist/app.js",
    "build": "esbuild src/app.ts --target=node18 --bundle --outdir=dist --platform=node --packages=external --tsconfig=./tsconfig.json"
}
```
```

Assegure-se de aplicar os comandos PowerShell conforme necessário e ajustar qualquer configuração conforme o seu ambiente de desenvolvimento.
