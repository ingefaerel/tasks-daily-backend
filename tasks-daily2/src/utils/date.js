// src/utils/date.js
import { format, startOfMonth, eachDayOfInterval } from "date-fns";

export const formatDisplayDate = (date) => format(date, "MMMM dd, yyyy");

export const formatYMD = (date) => format(date, "yyyy-MM-dd");

export const getMonthDays = (currentDate) => {
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  return eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
};