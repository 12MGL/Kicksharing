export const formatDate = (isoString) => {
    if (!isoString) return "Неизвестно";
    const date = new Date(isoString);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).replace(",", ""); //убираем лишнюю запятую
  };
  