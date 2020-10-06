export const ConfigFileTemplate = (jwtSecret: string | undefined): string => {
  return `
  {
    "secretToken": "${jwtSecret}",
    "enablePlayground": true
  }
      `;
};
