export const TemplateUtils = {
    removeDuplicated: (elements: string[]): string[] => [...new Set(elements)]
}