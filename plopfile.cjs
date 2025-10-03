module.exports = (plop) => {
  plop.setGenerator("component", {
    description: "Create a component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your component name?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "plop-templates/Component/Component.tsx.hbs",
      },
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.test.ts",
        templateFile: "plop-templates/Component/Component.test.ts.hbs",
      },
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.component.scss",
        templateFile: "plop-templates/Component/Component.component.scss.hbs",
      },
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/index.ts",
        templateFile: "plop-templates/Component/index.ts.hbs",
      },
      {
        type: "add",
        path: "src/components/index.ts",
        templateFile: "plop-templates/injectable-index.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "src/components/index.ts",
        pattern: `/* PLOP_INJECT_IMPORT */`,
        template: `import {{pascalCase name}} from "./{{pascalCase name}}"`,
      },
      {
        type: "append",
        path: "src/components/index.ts",
        pattern: `/* PLOP_INJECT_EXPORT */`,
        template: `\t{{pascalCase name}},`,
      },
    ],
  })
  plop.setGenerator("atom", {
    description: "Create a component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your component name?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/components/atoms/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "plop-templates/Component/Component.tsx.hbs",
      },
      {
        type: "add",
        path: "src/components/atoms/{{pascalCase name}}/{{pascalCase name}}.test.ts",
        templateFile: "plop-templates/Component/Component.test.ts.hbs",
      },
      {
        type: "add",
        path: "src/components/atoms/{{pascalCase name}}/{{pascalCase name}}.component.scss",
        templateFile: "plop-templates/Component/Component.component.scss.hbs",
      },
      {
        type: "add",
        path: "src/components/atoms/{{pascalCase name}}/index.ts",
        templateFile: "plop-templates/Component/index.ts.hbs",
      },
      {
        type: "add",
        path: "src/components/index.ts",
        templateFile: "plop-templates/injectable-index.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "src/components/index.ts",
        pattern: `/* PLOP_INJECT_IMPORT */`,
        template: `import {{pascalCase name}} from "./atoms/{{pascalCase name}}"`,
      },
      {
        type: "append",
        path: "src/components/index.ts",
        pattern: `/* PLOP_INJECT_EXPORT */`,
        template: `\t{{pascalCase name}},`,
      },
    ],
  })
  plop.setGenerator("molecule", {
    description: "Create a rich component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your component name?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/components/molecules/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "plop-templates/Component/Component.tsx.hbs",
      },
      {
        type: "add",
        path: "src/components/molecules/{{pascalCase name}}/{{pascalCase name}}.test.ts",
        templateFile: "plop-templates/Component/Component.test.ts.hbs",
      },
      {
        type: "add",
        path: "src/components/molecules/{{pascalCase name}}/{{pascalCase name}}.component.scss",
        templateFile: "plop-templates/Component/Component.component.scss.hbs",
      },
      {
        type: "add",
        path: "src/components/molecules/{{pascalCase name}}/index.ts",
        templateFile: "plop-templates/Component/index.ts.hbs",
      },
      {
        type: "add",
        path: "src/components/index.ts",
        templateFile: "plop-templates/injectable-index.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "src/components/index.ts",
        pattern: `/* PLOP_INJECT_IMPORT */`,
        template: `import {{pascalCase name}} from "./molecules/{{pascalCase name}}"`,
      },
      {
        type: "append",
        path: "src/components/index.ts",
        pattern: `/* PLOP_INJECT_EXPORT */`,
        template: `\t{{pascalCase name}},`,
      },
    ],
  })
  plop.setGenerator("page", {
    description: "Create a page",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your page name?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/pages/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "plop-templates/Page/Page.tsx.hbs",
      },
      {
        type: "add",
        path: "src/pages/{{pascalCase name}}/{{pascalCase name}}.test.ts",
        templateFile: "plop-templates/Page/Page.test.ts.hbs",
      },
      {
        type: "add",
        path: "src/pages/{{pascalCase name}}/{{pascalCase name}}.module.scss",
        templateFile: "plop-templates/Page/Page.module.scss.hbs",
      },
      {
        type: "add",
        path: "src/pages/{{pascalCase name}}/index.ts",
        templateFile: "plop-templates/Page/index.ts.hbs",
      },
      {
        type: "add",
        path: "src/pages/{{pascalCase name}}/{{pascalCase name}}.slice.ts",
        templateFile: "plop-templates/Page/Page.slice.ts.hbs",
      },
      {
        type: "add",
        path: "src/pages/index.ts",
        templateFile: "plop-templates/injectable-index.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "src/pages/index.ts",
        pattern: `/* PLOP_INJECT_IMPORT */`,
        template: `import {{pascalCase name}} from "./{{pascalCase name}}"`,
      },
      {
        type: "append",
        path: "src/pages/index.ts",
        pattern: `/* PLOP_INJECT_EXPORT */`,
        template: `\t{{pascalCase name}},`,
      },
    ],
  })
}
