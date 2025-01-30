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

// функция для обновления данных о ремонтах - для редактирования их из админки
export const updateRepair = async (id, updatedData) => {
  try {
    const response = await fetch(`http://localhost:3000/repairs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    return response.ok;
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    return false;
  }
};

