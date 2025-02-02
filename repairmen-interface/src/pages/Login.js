import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import "../styles/Layout.css";

const Login = ({ setRepairman }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await login(username, password);
    if (response.success) {
      console.log("Данные о пользователе при входе:", response.repairman); //проверяем, что прилетает
        
      if (!response.repairman) {
        console.error("Ошибка: response.repairman отсутствует");
        return;
        }
    
      const repairmanData = {
        id: response.repairman.id,
        username: response.repairman.username,
        specialization: response.repairman.specialization || "Не указано",
        service_center_id: response.repairman.service_center_id || "Не указан",
        service_center_name: response.repairman.service_center_name || "Не указан"
      };

      console.log("Финальные данные перед setRepairman:", repairmanData); //проверяем структуру данных

      setRepairman(repairmanData);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(repairmanData));
      navigate("/");
    } else {
      setError("Неверный логин или пароль");
    }
  };

  console.log("Данные пользователя в профиле:", setRepairman); //дебажноэ


  return (
    <div className="page">
      <h2>Авторизация</h2>
      <p>Для тестового входа можете использовать Pushkin --- 1234. Создать нового пользователя можете из админки, стандартный пароль там ставится 1234. и обязательно читайте инструкцию на главной странице админки! интерфейс ремонтника был построен специально для удобного использования с мобильных устройств!</p>
      <input type="text" placeholder="Имя пользователя" value={username} onChange={(e) => setUsername(e.target.value)} />
      <br />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button onClick={handleLogin}>Войти</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
