import React, { useState, useEffect } from "react";
import { changePassword } from "../api";
import "../styles/Layout.css";

const Profile = () => {
  const [repairman, setRepairman] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    //подгружаем данные о пользователе из localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("Данные из localStorage:", storedUser); //дебажноэ
    if (storedUser) {
      setRepairman(storedUser);
    } else {
        console.error("Пользователь не найден в localStorage!");
    }
    }, []);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      setMessage("Заполните все поля");
      return;
    }

    const response = await changePassword(repairman.id, oldPassword, newPassword);
    setMessage(response.message);
  };

  if (!repairman) {
    return <p>Загрузка...</p>;
  }

  console.log("Данные пользователя:", repairman);

  return (
    <div className="page">
      <h2>Профиль</h2>
      <p>Имя: {repairman.username || "Не указано"}</p>
      <p>Специализация: {repairman.specialization || "Не указана"}</p>
      <p>Сервисный центр: {repairman.service_center_name || "Не указан"}</p>

      <h3>Смена пароля</h3>
      <input type="password" placeholder="Старый пароль" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
      <br />
      <input type="password" placeholder="Новый пароль" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      <br />
      <button onClick={handleChangePassword}>Сменить пароль</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Profile;
