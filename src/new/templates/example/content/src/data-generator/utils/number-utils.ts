export const NumberUtils = {
    randomBetween: (min: number, max: number): number =>
        Math.floor(Math.random() * (max - min) + min),
    roundTo: (n: number, digits: number = 0) => {
        var multiplicator = Math.pow(10, digits);
        n = parseFloat((n * multiplicator).toFixed(11));
        var test = Math.round(n) / multiplicator;
        return +test.toFixed(digits);
    }
};
