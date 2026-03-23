export const formatMoney = (value: number) => new Intl.NumberFormat("ru-RU").format(Number(value || 0)) + " ₸";
