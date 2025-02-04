import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";  //делаем динамический ip, чтобы при подключении с внешних устройств, нас пускало на бэкенд
console.log('ENV API URL:', process.env.REACT_APP_API_URL); //дебажноэ
console.log('API URL:', API_BASE_URL); //дебажноэ


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
    const response = await fetch(`${API_BASE_URL}/repairs/${id}`, {
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

//функция обновления данных о самокате
export const updateScooter = async (id, updatedData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/scooters/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    return response.ok;
  } catch (error) {
    console.error("Ошибка при обновлении самоката:", error);
    return false;
  }
};


//получение списка самокатов
export const getScooters = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/scooters`);
    
    if (!response.ok) {
      throw new Error("Ошибка при загрузке списка самокатов");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении списка самокатов:", error);
    return [];
  }
};

//получение списка запчастей на складе
export const getParts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/parts`);
    if (!response.ok) {
      throw new Error("Ошибка при загрузке запчастей");
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении запчастей:", error);
    return [];
  }
};

//обновление данных о запчастях на складе
export const updatePart = async (id, updatedData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/parts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    return response.ok;
  } catch (error) {
    console.error("Ошибка при обновлении запчасти:", error);
    return false;
  }
};

//добавление нового самоката
export const addScooter = async (scooterData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/scooters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scooterData),
    });

    return response.ok;
  } catch (error) {
    console.error("Ошибка при добавлении самоката:", error);
    return false;
  }
};

//добавление новой запчасти
export const addPart = async (partData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/parts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partData),
    });

    return response.ok;
  } catch (error) {
    console.error("Ошибка при добавлении запчасти:", error);
    return false;
  }
};

//список всех ремонтников
export const getRepairmen = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/repairmen`);
    return await response.json();
  } catch (error) {
    console.error("Ошибка при загрузке ремонтников:", error);
    return [];
  }
};

//добавление нового ремонтника
export const addRepairman = async (repairmanData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/repairmen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repairmanData),
    });

    return response.ok;
  } catch (error) {
    console.error("Ошибка при добавлении ремонтника:", error);
    return false;
  }
};

//обновление данных о ремонтнике
export const updateRepairman = async (repairmanId, updatedData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/repairmen/${repairmanId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    return response.ok;
  } catch (error) {
    console.error("Ошибка при обновлении данных ремонтника:", error);
    return false;
  }
};

//список сервисных центров - при добавлении/редактировании ремонтника
export const getServiceCenters = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/repairmen/service-centers`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке складов:", error);
    return [];
  }
};

//получение истории ремонтов самоката по id
export const getScooterRepairs = async (scooterId) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/scooters/${scooterId}/repairs`);
      return response.data;
  } catch (error) {
      console.error("Ошибка при загрузке истории ремонтов:", error);
      return [];
  }
};

//получение всех ремонтов конкретного ремонтника
export const getRepairmanRepairs = async (repairmanId) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/repairmen/${repairmanId}/repairs`);
      return response.data;
  } catch (error) {
      console.error("Ошибка при получении истории ремонтов ремонтника:", error);
      return [];
  }
};

//получение админских логов
export const getAdminLogs = async () => {
  try {
      const response = await axios.get(`${API_BASE_URL}/logs`);
      return response.data;
  } catch (error) {
      console.error("Ошибка при загрузке логов:", error);
      return [];
  }
};
