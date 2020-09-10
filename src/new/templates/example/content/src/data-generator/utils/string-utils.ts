export const StringUtils = {
    /**
     * Allows to convert strings to TitleCase with white spaces Format EG: "the house" becomes "The House"
     */
    toTitleCase: (str: string): string => {
        return str
            .split(" ")
            .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    },
    removeAccents: (str: string) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
};

