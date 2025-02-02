import React, { useState } from "react";
import { searchScooter } from "../api";
import { useNavigate } from "react-router-dom";

const Home = ({ onSelectScooter }) => {
  const [query, setQuery] = useState("");
  const [scooter, setScooter] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Введите регистрационный или серийный номер");
      return;
    }
    
    setError("");
    const result = await searchScooter(query);
    
    if (result) {
      setScooter(result);
    } else {
      setScooter(null);
      setError("Самокат не найден");
    }
  };

  const handleSelectScooter = () => {
    if (scooter) {
      onSelectScooter(scooter);
      navigate(`/repair/${scooter.id}`);
    }
  };

  return (
    <div className="page">
      <h2>Ремонт самокатов</h2>
      <p>Введите номер существующего самоката (для теста можно взять SN-1001)</p>
      <h2>Поиск самоката</h2>
      <input
        type="text"
        placeholder="Введите сер. или рег. номер самоката"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Найти</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {scooter && (
        <div>
          <h3>Найденный самокат:</h3>
          <p>ID: {scooter.id}</p>
          <p>Регистрационный номер: {scooter.registration_number}</p>
          <p>Серийный номер: {scooter.serial_number}</p>
          <p>Модель: {scooter.model}</p>
          <p>Год выпуска: {scooter.year}</p>
          <p>Цвет: {scooter.color}</p>
          <button onClick={handleSelectScooter}>Начать ремонт</button>
        </div>
      )}
    </div>
  );
};

export default Home;
