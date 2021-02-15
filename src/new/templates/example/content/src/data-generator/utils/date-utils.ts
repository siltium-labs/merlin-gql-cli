import dayjs from "dayjs";

export const DateUtils = {
  randomBetween: (from: Date, to: Date) => {
    const fromTime = from.getTime();
    const toTime = to.getTime();
    return new Date(fromTime + Math.random() * (toTime - fromTime));
  },
  fromString: (str: string, format: string) => {
    return dayjs(str, format).toDate();
  },
  format: (date: Date, format: string) => {
    return dayjs(date).format(format);
  },
};
