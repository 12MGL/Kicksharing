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

//функция обновления данных о самокате
export const updateScooter = async (id, updatedData) => {
  try {
    const response = await fetch(`http://localhost:3000/scooters/${id}`, {
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
    const response = await fetch("http://localhost:3000/scooters");

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
    const response = await fetch("http://localhost:3000/parts");
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
    const response = await fetch(`http://localhost:3000/parts/${id}`, {
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
    const response = await fetch("http://localhost:3000/scooters", {
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
    const response = await fetch("http://localhost:3000/parts", {
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
    const response = await fetch("http://localhost:3000/repairmen");
    return await response.json();
  } catch (error) {
    console.error("Ошибка при загрузке ремонтников:", error);
    return [];
  }
};

//добавление нового ремонтника
export const addRepairman = async (repairmanData) => {
  try {
    const response = await fetch("http://localhost:3000/repairmen", {
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
    const response = await fetch(`http://localhost:3000/repairmen/${repairmanId}`, {
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
    const response = await axios.get("http://localhost:3000/repairmen/service-centers");
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке складов:", error);
    return [];
  }
};