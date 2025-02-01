import axios from "axios";

const API_URL = "http://localhost:3000";

export const searchScooter = async (query) => {
  try {
    const response = await fetch(`${API_URL}/scooters/search?query=${query}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Ошибка при поиске самоката:", error);
    return null;
  }
};

export const getScooterDetails = async (id) => {
    try {
      const response = await fetch(`${API_URL}/scooters/${id}/details`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Ошибка при загрузке самоката:", error);
      return null;
    }
  };

  export const startRepair = async (id) => {
    try {
      const response = await fetch(`${API_URL}/repairs/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scooter_id: id }),
      });
      return response.ok;
    } catch (error) {
      console.error("Ошибка при начале ремонта:", error);
      return false;
    }
  };

  export const updateRepair = async (scooterId, repairData) => {
    try {
      const response = await fetch(`http://localhost:3000/repairs/${scooterId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(repairData),
      });
  
      return await response.json();
    } catch (error) {
      console.error("Ошибка при обновлении данных о ремонте:", error);
      return { success: false };
    }
  };

  export const addRepair = async (repairData) => {
    console.log("Перед отправкой запроса в бэкенд:", repairData);  //дебажноэ
    try {
      const response = await axios.post("http://localhost:3000/repairs", repairData);
      console.log("Ответ от сервера:", response.data); //дебажноэ
      return response.data.success;
    } catch (error) {
      console.error("Ошибка при добавлении ремонта:", error.response?.data || error.message);
      return false;
    }
  };

  export const getScooters = async () => {
    try {
      const response = await fetch(`${API_URL}/scooters`);
      if (!response.ok) throw new Error("Ошибка загрузки списка самокатов");
      return await response.json();
    } catch (error) {
      console.error("Ошибка при загрузке списка самокатов:", error);
      return [];
    }
  };