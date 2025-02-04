import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000"; //делаем динамический ip, чтобы при подключении с внешних устройств, нас пускало на бэкенд

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
      const response = await fetch(`${API_URL}/repairs/${scooterId}`, {
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
      const response = await axios.post(`${API_URL}/repairs`, repairData);
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

  export const getRepairHistory = async (repairmanId) => {
    try {
      const response = await fetch(`${API_URL}/repairmen/${repairmanId}/repairs`);
      if (!response.ok) throw new Error("Ошибка загрузки истории ремонтов");
      return await response.json();
    } catch (error) {
      console.error("Ошибка при загрузке истории ремонтов:", error);
      return [];
    }
  };

export const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.repairman));
        return { success: true, repairman: data.repairman };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Ошибка при авторизации:", error);
      return { success: false, message: "Ошибка сервера" };
    }
  };
  

  export const changePassword = async (repairman_id, oldPassword, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/auth/change-password`, { repairman_id, oldPassword, newPassword });
      return response.data;
    } catch (error) {
      console.error("Ошибка при смене пароля:", error);
      return { success: false, message: "Ошибка при смене пароля" };
    }
  };
  