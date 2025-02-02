import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getScooterDetails, addRepair } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Layout.css";

const Repair = () => {
  const { id } = useParams(); //получаем id самоката из URL
  const [scooter, setScooter] = useState(null);
  const [node, setNode] = useState(""); //узел
  const [repairType, setRepairType] = useState(""); //тип ремонта
  const [selectedSuccess, setSelectedSuccess] = useState("1"); //успешность ремонта (по умолчанию "успешный")
  const [repairman, setRepairman] = useState(null);
  const [serviceCenterId, setServiceCenterId] = useState(null);

  useEffect(() => { //загрузка данных самоката
    const fetchScooterDetails = async () => {
      const scooterData = await getScooterDetails(id);
      if (scooterData) {
        setScooter(scooterData);
      }
    };
    fetchScooterDetails();
    const storedUser = JSON.parse(localStorage.getItem("user"));  //подгружаем данные о залогиненном пользователе из localStorage
    if (storedUser) {
      setRepairman(storedUser);
      setServiceCenterId(storedUser.service_center_id);
    }
  }, [id]);

  const navigate = useNavigate();

  const handleRepairSubmit = async () => {
    if (!node || !repairType) {
      alert("Заполните все поля!");
      return;
    }

    const repairData = {
      scooter_id: id,
      repairman_id: repairman.id,
      service_center_id: serviceCenterId, 
      repair_timestamp: new Date().toISOString().slice(0, 19).replace("T", " "), //время завершения ремонта в подходящем для БД формате
      node, //узел
      repair_type: repairType,  //с запчастями/с расходниками/без запчастей
      success: Number(selectedSuccess), //подводим selectedSuccess к числу явно 
    };

    console.log("Отправляем данные в API:", repairData); //дебажноэ

    const success = await addRepair(repairData);
    if (success) {
      alert("Ремонт успешно завершён!");
      navigate("/");
    } else {
      alert("Ошибка при завершении ремонта.");
    }
  };

  return (
    <div className="page">
      <h2>Ремонт самоката {scooter ? scooter.registration_number : "Загрузка..."}</h2>

      {/* выбор узла */}
      <label>Выберите узел:</label>
      <select value={node || ""} onChange={(e) => setNode(e.target.value)}>
        <option value="">Выберите узел</option>
        <option value="wheel">Колесо</option>
        <option value="handlebar">Руль</option>
        <option value="frame">Рама</option>
        <option value="electronics">Электроника</option>
      </select>
      <br />

      {/* выбор типа ремонта */}
      <label>Тип ремонта:</label>
      <select value={repairType || ""} onChange={(e) => setRepairType(e.target.value)}>
        <option value="">Выберите тип ремонта</option>
        <option value="with_parts">С запчастями</option>
        <option value="with_consumables">С расходниками</option>
        <option value="without_parts">Без запчастей</option>
      </select>
      <br />

      {/* успешность */}
      <label>Ремонт успешен?</label>
      <select value={selectedSuccess} onChange={(e) => setSelectedSuccess(e.target.value)}>
        <option value="1">Да</option>
        <option value="0">Нет</option>
      </select>
      <br />

      {/* Кнопка завершения ремонта */}
      <button onClick={handleRepairSubmit}>Завершить ремонт</button>
    </div>
  );
};

export default Repair;
