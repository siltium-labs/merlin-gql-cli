export const ArrayUtils = {
    /**
     * Allows to convert strings to TitleCase with white spaces Format EG: "the house" becomes "The House"
     */
    flatten: <T>(arr: Array<Array<T>>): Array<T> => {
        return arr.reduce((p, n) => p.concat(n), []);
    },
    randomFrom: <T>(arr: Array<T>): T => {
        return arr[Math.floor(Math.random() * arr.length)];
    }
};


