import React, { useState, useEffect } from "react";
import { getScooters, updateScooter, addScooter, getScooterRepairs } from "../api";
import { formatDate } from "../utils";
import "../styles/App.css";

const Scooters = () => {
  const [scooters, setScooters] = useState([]); //таблица самокатов
  const [editingScooter, setEditingScooter] = useState(null); //редактирование самоката
  const [filters, setFilters] = useState({ model: "", year: "", status: "" });  //фильтрация
  const [searchQuery, setSearchQuery] = useState(""); //поиск по самокатам
  const [addingScooter, setAddingScooter] = useState(false);  //добавление самоката
  const [selectedScooter, setSelectedScooter] = useState(null); //выбор самоката (для реализации истории ремонтов)
  const [scooterRepairs, setScooterRepairs] = useState([]); //ремонты самоката

  useEffect(() => {
      fetchScooters(); 
    }, []);

  const fetchScooters = async () => {
    const data = await getScooters();
    setScooters(data);
  };

  //редактирование самокатов
  const handleEdit = (scooter) => {
    setEditingScooter({ ...scooter });
  };

  //сохранение данных после редактирования
  const handleSave = async () => {
    const success = await updateScooter(editingScooter.id, editingScooter);
    if (success) {
      fetchScooters();
      setEditingScooter(null);
    } else {
      alert("Ошибка при обновлении данных.");
    }
  };

  //фильтрация всего, чего захочешь
  const handleFilter = (scooter) => {
    //при поиске по id нам нужно проверять не все включения, а только точное совпадение. 
    if (filters.id && scooter.id.toString() !== filters.id.trim()) {
        return false;
    }

    //делаем нечувствительность к регистру при фильтрации и гарантируем, что значения - строки, иначе задаём ""
    const searchLower = searchQuery?.toLowerCase() || "";
    const serialLower = scooter.serial_number?.toLowerCase() || "";
    const regLower = scooter.registration_number?.toLowerCase() || "";
    
    return (
        (!filters.model || scooter.model?.toLowerCase().includes(filters.model.toLowerCase())) &&
        (!filters.year || scooter.year.toString() === filters.year) &&
        (!filters.status || scooter.status === filters.status) &&
        (!searchQuery || serialLower.includes(searchLower) || regLower.includes(searchLower))
      );
    };

    //добавление новых самокатов
    const handleAddScooter = async (newScooter) => {
        const success = await addScooter(newScooter);
        if (success) {
          fetchScooters();
          setAddingScooter(false);
        } else {
          alert("Ошибка при добавлении самоката.");
        }
      };
    
    //загрузка истории ремонтов 
    const handleShowRepairs = async (scooterId) => {
      try {
        const repairs = await getScooterRepairs(scooterId);
        console.log("История ремонтов (ответ сервера):", repairs);

        setScooterRepairs(repairs);

        //находим регистрационный номер самоката для отображении его в истории ремонтов в заголовке (ну и вообще когда понадобится)
        setSelectedScooter({
            id: scooterId,
            registration_number: repairs[0]?.registration_number || "Неизвестен"
        });

      } catch (error) {
          console.error("Ошибка при загрузке истории ремонтов:", error);
      }

      // const repairs = await getScooterRepairs(scooterId);
      // console.log("История ремонтов (ответ сервера):", repairs); //дебажноэ
      // setScooterRepairs(repairs);
      // setSelectedScooter(scooterId);
    };

    console.log(selectedScooter) //дебажноэ
    console.log(selectedScooter?.registration_number); //дебажноэ

  return (
    <div className="page">
    <div className="scooters-container" style={{ marginLeft: "130px", padding: "20px" }}>
      <h1>Список самокатов</h1>
      <button style={{ padding: "5px" }} onClick={() => setAddingScooter(true)}>Добавить самокат</button>
        <p></p>
      {/* Фильтры */}
      <div className="filters">
        <input
            type="number"
            placeholder="Фильтр по ID"
            value={filters.id}
            onChange={(e) => setFilters({ ...filters, id: e.target.value })}
        />
        <input
            type="text"
            placeholder="Поиск по серийнику или рег. номеру"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
            type="text"
            placeholder="Фильтр по модели"
            value={filters.model}
            onChange={(e) => setFilters({ ...filters, model: e.target.value })}
        />
        <input
            type="number"
            placeholder="Фильтр по году"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        />
        <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
            <option value="">Все</option>
            <option value="working">Рабочий</option>
            <option value="on_repair">На ремонте</option>
            <option value="retired">Списан</option>
        </select>
        </div>

      {/* Таблица самокатов */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Серийный номер</th>
            <th>Регистрационный номер</th>
            <th>Модель</th>
            <th>Год</th>
            <th>Цвет</th>
            <th>Пробег</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {scooters.filter(handleFilter).map((scooter) => (
            <tr key={scooter.id}>
              <td>{scooter.id}</td>
              <td>{scooter.serial_number}</td>
              <td>{scooter.registration_number}</td>
              <td>{scooter.model}</td>
              <td>{scooter.year}</td>
              <td>{scooter.color}</td>
              <td>{scooter.mileage}</td>
              <td>{scooter.status}</td>
              <td>
                <button onClick={() => handleEdit(scooter)} style={{marginRight:'5px'}}>Редактировать</button>
                <button onClick={() => handleShowRepairs(scooter.id)} style={{marginRight:'5px'}}>История ремонтов</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* модальное окно для редактирования самокатов */}
      {editingScooter && (
        <div className="modal">
          <h2>Редактирование самоката</h2>
          <input
            type="text"
            value={editingScooter.serial_number}
            onChange={(e) => setEditingScooter({ ...editingScooter, serial_number: e.target.value })}
          />
          <input
            type="text"
            value={editingScooter.registration_number}
            onChange={(e) => setEditingScooter({ ...editingScooter, registration_number: e.target.value })}
          />
          <input
            type="text"
            value={editingScooter.model}
            onChange={(e) => setEditingScooter({ ...editingScooter, model: e.target.value })}
          />
          <input
            type="number"
            value={editingScooter.year}
            onChange={(e) => setEditingScooter({ ...editingScooter, year: e.target.value })}
          />
          <input
            type="text"
            value={editingScooter.color}
            onChange={(e) => setEditingScooter({ ...editingScooter, color: e.target.value })}
          />
          <input
            type="number"
            value={editingScooter.mileage}
            onChange={(e) => setEditingScooter({ ...editingScooter, mileage: e.target.value })}
          />
          <button onClick={handleSave}>Сохранить</button>
          <button onClick={() => setEditingScooter(null)}>Отмена</button>
        </div>
      )}
      {/* модальное окно для добавления новых самокатов */}
      {addingScooter && (
        <div className="modal">
          <h2>Добавить новый самокат</h2>
          <input type="text" placeholder="Серийный номер" id="serial_number" />
          <input type="text" placeholder="Регистрационный номер" id="registration_number" />
          <input type="text" placeholder="Модель" id="model" />
          <input type="number" placeholder="Год" id="year" />
          <input type="text" placeholder="Цвет" id="color" />
          <input type="number" placeholder="Пробег" id="mileage" />
          <select id="status">
            <option value="working">Рабочий</option>
            <option value="on_repair">На ремонте</option>
            <option value="retired">Списан</option>
          </select>
          <button onClick={() => handleAddScooter({
            serial_number: document.getElementById("serial_number").value,
            registration_number: document.getElementById("registration_number").value,
            model: document.getElementById("model").value,
            year: document.getElementById("year").value,
            color: document.getElementById("color").value,
            mileage: document.getElementById("mileage").value,
            status: document.getElementById("status").value
          })}>Сохранить</button>
          <button onClick={() => setAddingScooter(false)}>Отмена</button>
        </div>
      )}
      {selectedScooter && (
        <div className="modal">
            <h2>История ремонтов самоката {selectedScooter?.registration_number || "Неизвестен"}</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID ремонта</th>
                        <th>Дата</th>
                        <th>Узел</th>
                        <th>Тип ремонта</th>
                        <th>Ремонтник</th>
                        <th>Склад</th>
                        <th>Успешность</th>
                    </tr>
                </thead>
                <tbody>
                    {scooterRepairs.length > 0 ? (
                        scooterRepairs.map((repair) => (
                            <tr key={repair.id}>
                                <td>{repair.id}</td>
                                <td>{formatDate(repair.repair_timestamp)}</td>
                                <td>{repair.node}</td>
                                <td>{repair.repair_type}</td>
                                <td>{repair.repairman_name || "Не указан"}</td>
                                <td>{repair.service_center_name || "Не указан"}</td>
                                <td>{repair.success ? "✔" : "✖"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">Ремонты не найдены</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <button onClick={() => setSelectedScooter({ id: scooterId, registration_number: repairs[0]?.registration_number || "Неизвестен" })}>Закрыть</button>
        </div>
    )}
    </div>
    </div>
  );
};

export default Scooters;
