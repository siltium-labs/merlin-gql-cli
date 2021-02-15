export const ConfigFileTemplate = (jwtSecret: string | undefined): string => {
  return `
  {
    ${jwtSecret ? '"secretToken": "' + jwtSecret + '",' : ''}
    "enablePlayground": true
  }
      `;
};
