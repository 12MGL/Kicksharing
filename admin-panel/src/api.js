import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; //берём из бэкенда

export const getStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    console.log("Ответ от сервера:", response.data); //дебажноэ
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке статистики:", error);
    return [];
  }
};
