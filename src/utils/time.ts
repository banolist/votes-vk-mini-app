import dayjs from "dayjs";

export const timeNow = () => dayjs().format(TIME_INPUT_FORMAT);

export const TIME_INPUT_FORMAT = "YYYY-MM-DDTHH:mm";
