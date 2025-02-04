import React, { useState, useEffect } from "react";
import { getStats } from "../api";
import "../styles/Stats.css";
import { updateRepair } from "../api"; 
import { formatDate } from "../utils";

const Stats = () => {
  const [stats, setStats] = useState([]);
  const [sortField, setSortField] = useState("id"); //для сортировки по id ремонта
  const [sortOrder, setSortOrder] = useState("asc"); //сортировка по порядку
  const [filteredStats, setFilteredStats] = useState([]); //добавляем фильтры
  const [filterSuccess, setFilterSuccess] = useState("all"); //по успешности 
  const [filterRepairman, setFilterRepairman] = useState("all"); // по ремонтнику
  const [filterDateFrom, setFilterDateFrom] = useState(""); // фильтр для даты
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterServiceCenter, setFilterServiceCenter] = useState("all");
  const [repairmen, setRepairmen] = useState([]);
  const [uniqueServiceCenters, setUniqueServiceCenters] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_URL; //для скрипта обновления ip, чтобы можно было подключиться внутри сети с других устройств


  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    repair_timestamp:  window.innerWidth > 768, //автоматически скрываем неважные столбцы на мобилках
    scooter_id: true,
    scooter_serial_number: true,
    scooter_registration_number: true,
    repairman_id: true,
    repairman_name: true,
    service_center: window.innerWidth > 768, //автоматически скрываем неважные столбцы на мобилках
    node: true,
    repair_type: window.innerWidth > 768, //автоматически скрываем неважные столбцы на мобилках
    success: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getStats();
      console.log("Полученные данные:", data); //дебажноэ
      // сортируем данные сразу после получения
      const sortedData = [...data].sort((a, b) => a.id - b.id);
      const uniqueRepairmen = [...new Set(data.map(item => item.repairman_name))];  //группировка ремонтников для фильтрации, уникальные имена
      setRepairmen(uniqueRepairmen);
      const uniqueCenters = [...new Set(data.map(item => item.service_center_name).filter(Boolean))];
      console.log("Уникальные склады:", uniqueCenters); //дебажноэ
      setUniqueServiceCenters(uniqueCenters);
      setStats(sortedData); 
      setFilteredStats(sortedData);
    };

    fetchStats();
  }, []);

  const toggleColumn = (column) => {        //возможность скрывать/открывать столбцы
    setVisibleColumns({ ...visibleColumns, [column]: !visibleColumns[column] });
  };

  const handleSort = (field) => {           //функция для сортировки
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedData = [...filteredStats].sort((a, b) => {
        if (a[field] < b[field]) return order === "asc" ? -1 : 1;
        if (a[field] > b[field]) return order === "asc" ? 1 : -1;
        return 0;
    });

    setFilteredStats(sortedData);
};

    useEffect(() => {        //функция для фильтров

        if (!stats || stats.length === 0) {
          console.log("ENV:", process.env.REACT_APP_API_URL);
          console.log("API BASE URL:", API_BASE_URL);
          console.log(API_BASE_URL);
          console.log("Данные ещё не загружены, не фильтруем.");
          return;
        }
        console.log("Фильтры обновлены. Обновляем таблицу..."); //дебажноэ
        let filtered = [...stats];
        console.log("Исходные данные перед фильтрацией:", stats); //дебажноэ

        if (filterSuccess !== "all") {        //по успешности ремонта
        filtered = filtered.filter(item => {
            const match = filterSuccess === "success" ? item.success : !item.success;
            if (!match) console.log("Фильтр по успешности ОТБРАСЫВАЕТ:", item);     //дебажноэ
            return match;
        });
        }

        if (filterRepairman !== "all") {        //по ремонтнику
        filtered = filtered.filter((item) => {
            const match = item.repairman_name === filterRepairman;
            if (!match) console.log("Фильтр по ремонтнику ОТБРАСЫВАЕТ:", item); //дебажноэ
            return match;    
        });
        }

        if (filterDateFrom) {        //по дате
        filtered = filtered.filter(item => {
            const itemDate = new Date(item.repair_timestamp);
            const fromDate = new Date(filterDateFrom);
            const match = itemDate >= fromDate;
            if (!match) console.log("Фильтр по дате С (отбрасывает):", item, "Т.к. дата:", itemDate);   //дебажноэ
            return match;
        });
        }
        if (filterDateTo) {
        filtered = filtered.filter(item => {
            const itemDate = new Date(item.repair_timestamp);
            const toDate = new Date(filterDateTo);
            const match = itemDate <= toDate;
            if (!match) console.log("Фильтр по дате ПО (отбрасывает):", item, "Т.к. дата:", itemDate);  //дебажноэ
            return match;
        });
        }
        if (filterServiceCenter !== "all") {
          filtered = filtered.filter(item => item.service_center_name === filterServiceCenter);
        }

        filtered.sort((a, b) => {    //сортировка отфильтрованного
            if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
            if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        console.log("Отфильтрованные данные:", filtered); //дебажноэ

        if (JSON.stringify(filtered) !== JSON.stringify(filteredStats)) {
            console.log("Обновляем `setFilteredStats`..."); //дебажноэ
            setFilteredStats(filtered);
        }

        setFilteredStats(filtered);
    }, [stats, filterSuccess, filterRepairman, filterDateFrom, filterDateTo, filterServiceCenter, sortField, sortOrder]);

    // обработчик кнопки редактирования, должна вызвать модальное окно
    const [editingItem, setEditingItem] = useState(null); //состояние модального окна
    const handleEdit = (item) => {
      setEditingItem(item); //отправляем данные из выбранной строки в состояние editingItem
    };

    const handleSaveEdit = async () => {  //обработчик для модального окна
      if (!editingItem) return;
    
      console.log("Отправляем данные на сервер:", editingItem);
    
      const success = await updateRepair(editingItem.id, {
        repair_timestamp: editingItem.repair_timestamp,
        node: editingItem.node,
        repair_type: editingItem.repair_type,
        success: editingItem.success,
      });
    
      if (success) {
        console.log("Данные успешно обновлены!");
    
        setStats((prevStats) =>
          prevStats.map((item) =>
            item.id === editingItem.id ? { ...editingItem } : item
          )
        );
    
        setEditingItem(null); //закрываем модальное окно
      } else {
        alert("Ошибка при сохранении данных.");
      }
    };

  return (
    <div className="page">
    <div style={{ marginLeft: "130px", padding: "20px" }}>
      <h1>Статистика ремонтов</h1>
        {/* возможность скрывать столбцы */}
      <div className="column-controls">
        {Object.keys(visibleColumns).map((column) => (
          <label key={column}>
            <input
              type="checkbox"
              checked={visibleColumns[column]}
              onChange={() => toggleColumn(column)}
            />
            {column}
          </label>
        ))}
      </div>
      {/* фильтры */}
      <div className="filters">
        <label>
          Успешность:
          <select value={filterSuccess} onChange={e => setFilterSuccess(e.target.value)}>
            <option value="all">Все</option>
            <option value="success">Успешные</option>
            <option value="failed">Неуспешные</option>
          </select>
        </label>

        <label>
          Ремонтник:
          <select value={filterRepairman} onChange={e => setFilterRepairman(e.target.value)}>
            <option value="all">Все</option>
            {repairmen.map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>
        </label>

        <label>
          Дата с:
          <input
            type="date"
            value={filterDateFrom}
            onChange={e => setFilterDateFrom(e.target.value)}
            onBlur={() => setFilterDateFrom(filterDateFrom)} //фильтр срабатывает только после выхода из поля
            /> 
        </label>

        <label>
          Дата по:
          <input
            type="date"
            value={filterDateTo}
            onChange={e => setFilterDateTo(e.target.value)}
            onBlur={() => setFilterDateTo(filterDateTo)}
            />
        </label>

        <label>
          Склад:
          <select value={filterServiceCenter} onChange={e => setFilterServiceCenter(e.target.value)}>
            <option value="all">Все</option>
            {uniqueServiceCenters.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>
        {/* сама табличка, но уже с добавленной функцией видимости столбцов */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
          {visibleColumns.id && <th onClick={() => handleSort("id")}>ID</th>}
          {visibleColumns.repair_timestamp && <th onClick={() => handleSort("repair_timestamp")}>Дата</th>}
          {visibleColumns.scooter_id && <th onClick={() => handleSort("scooter_id")}>Самокат</th>}
          {visibleColumns.scooter_serial_number && <th onClick={() => handleSort("scooter_serial_number")}>Серийный номер</th>}
          {visibleColumns.scooter_registration_number && <th onClick={() => handleSort("scooter_registration_number")}>Регистрационный номер</th>}
          {visibleColumns.repairman_id && <th onClick={() => handleSort("repairman_id")}>Ремонтник</th>}
          {visibleColumns.repairman_name && <th onClick={() => handleSort("repairman_name")}>Ремонтник</th>}
          {visibleColumns.service_center && <th onClick={() => handleSort("service_center")}>Склад</th>}
          {visibleColumns.node && <th onClick={() => handleSort("node")}>Узел</th>}
          {visibleColumns.repair_type && <th onClick={() => handleSort("repair_type")}>Тип ремонта</th>}
          {visibleColumns.success && <th onClick={() => handleSort("success")}>Успешность</th>}
          <th>Действия</th> {/* для редактирования */}
          </tr>
        </thead>
        <tbody>
          {filteredStats.length > 0 ? (
            filteredStats.map((item) => (
              <tr key={item.id}>
                {visibleColumns.id && <td>{item.id}</td>}
                {visibleColumns.repair_timestamp && <td>{formatDate(item.repair_timestamp)}</td>}
                {visibleColumns.scooter_id && <td>{item.scooter_id}</td>}
                {visibleColumns.scooter_serial_number && <td>{item.scooter_serial_number}</td>}
                {visibleColumns.scooter_registration_number && <td>{item.scooter_registration_number}</td>}
                {visibleColumns.repairman_id && <td>{item.repairman_id}</td>}
                {visibleColumns.repairman_name && <td>{item.repairman_name}</td>}
                {visibleColumns.service_center && <td>{item.service_center_name || "Не указан"}</td>}
                {visibleColumns.node && <td>{item.node}</td>}
                {visibleColumns.repair_type && <td>{item.repair_type}</td>}
                {visibleColumns.success && <td>{item.success ? "✔" : "✖"}</td>}
                <td>
                  <button onClick={() => handleEdit(item)}>Редактировать</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Загрузка данных...</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* модальное окно */}
      {editingItem && (  
        <div className="modal"> 
          <h2>Редактирование</h2>

          <label>
            Дата:
            <input
              type="datetime-local"
              value={editingItem.repair_timestamp}
              onChange={(e) => setEditingItem({ ...editingItem, repair_timestamp: e.target.value })}
            />
          </label>

          <label>
            Узел:
            <select
              value={editingItem.node}
              onChange={(e) => setEditingItem({ ...editingItem, node: e.target.value })}
            >
              <option value="wheel">Колесо</option>
              <option value="handlebar">Руль</option>
              <option value="frame">Рама</option>
              <option value="electronics">Электроника</option>
            </select>
          </label>

          <label>
            Тип ремонта:
            <select
              value={editingItem.repair_type}
              onChange={(e) => setEditingItem({ ...editingItem, repair_type: e.target.value })}
            >
              <option value="with_parts">С запчастями</option>
              <option value="with_consumables">С расходниками</option>
              <option value="without_parts">Без запчастей</option>
            </select>
          </label>

          <label>
            Успешность:
            <select
              value={editingItem.success}
              onChange={(e) => setEditingItem({ ...editingItem, success: e.target.value === "true" })}
            >
              <option value="true">Успешно</option>
              <option value="false">Неуспешно</option>
            </select>
          </label>

          <button onClick={handleSaveEdit}>Сохранить</button>
          <button onClick={() => setEditingItem(null)}>Отмена</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default Stats;
