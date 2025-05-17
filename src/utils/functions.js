export const dateTime = (date) => {
  return `${new Date(date)?.toLocaleDateString()} ${new Date(
    date
  )?.toLocaleTimeString()}`;
};
