/// <reference types="vite/client" />

// Declare markdown modules for blog content
declare module '*.md' {
  const content: any;
  export default content;
}

// Specific blog content modules
declare module './content/blog/business-central-security-compliance-framework.md' {
  export const securityComplianceContent: any;
}

declare module './content/blog/business-central-workflow-automation-guide.md' {
  export const workflowAutomationContent: any;
}

declare module './content/blog/business-central-al-extensions-advanced-patterns.md' {
  export const alExtensionsAdvancedContent: any;
}

declare module './content/blog/business-central-data-migration-zero-downtime-strategies.md' {
  export const dataMigrationZeroDowntimeContent: any;
}
