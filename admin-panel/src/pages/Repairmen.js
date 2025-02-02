import React, { useState, useEffect } from "react";
import { getRepairmen, updateRepairman, addRepairman, getServiceCenters, getRepairmanRepairs } from "../api";
import { formatDate } from "../utils";
import "../styles/App.css";

//многое взято из Scooters и Parts

const Repairmen = () => {
  const [repairmen, setRepairmen] = useState([]);
  const [editingRepairman, setEditingRepairman] = useState(null);
  const [addingRepairman, setAddingRepairman] = useState(false);
  const [filters, setFilters] = useState({ name: "", specialization: "", service_center: "" });
  const [serviceCenters, setServiceCenters] = useState([]);
  const [newRepairman, setNewRepairman] = useState({
    username: "",
    photo: "",
    specialization: "",
    service_center_id: ""
  });
  const [selectedRepairman, setSelectedRepairman] = useState(null);
  const [repairmanRepairs, setRepairmanRepairs] = useState([]);
  


  useEffect(() => {
    fetchRepairmen();   //подгрузка списка ремонтников
    fetchServiceCenters(); //подгрузка складов
  }, []);

  const fetchRepairmen = async () => {
    const data = await getRepairmen();
    setRepairmen(data);
  };

  const fetchServiceCenters = async () => {
    try {
        const data = await getServiceCenters();
        console.log("Полученные склады:", data);  //дебажноэ
        setServiceCenters(data);
      } catch (error) {
        console.error("Ошибка при загрузке складов:", error);
      }
  };

  const handleEdit = (repairman) => {
    setEditingRepairman({ ...repairman, service_center_id: repairman.service_center_id || ""  });
  };

  const handleSaveEdit = async () => {
    const success = await updateRepairman(editingRepairman.id, editingRepairman);
    if (success) {
      fetchRepairmen();
      setEditingRepairman(null);
    } else {
      alert("Ошибка при обновлении данных.");
    }
  };

  const handleAddRepairman = async (newRepairman) => {
    if (!newRepairman.username || !newRepairman.specialization || !newRepairman.service_center_id) {
        alert("Имя, специальность и склад обязательны");
        return;
      }
    const success = await addRepairman(newRepairman);
    if (success) {
        alert("Ремонтник добавлен!\nСтандартный пароль: 1234");
        fetchRepairmen();
        setAddingRepairman(false);
      } else {
        alert("Ошибка при добавлении ремонтника");
      }
  };

  const handleFilter = (repairman) => {
    return (
      (!filters.name || repairman.username.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.specialization || repairman.specialization.toLowerCase().includes(filters.specialization.toLowerCase())) &&
      (!filters.service_center || repairman.service_center_name === filters.service_center)
     );
  };

  const handleShowRepairs = async (repairman) => {
    setSelectedRepairman(repairman); //cохраняем все данные о ремонтнике
    const data = await getRepairmanRepairs(repairman.id);
    setRepairmanRepairs(data);
};

  return (
    <div className="page">
    <div className="repairmen-container" style={{ marginLeft: "130px", padding: "20px" }}>
      <h1>Ремонтники</h1>
      <button style={{ padding: "5px" }} onClick={() => setAddingRepairman(true)}>Добавить ремонтника</button>
        <p></p>

      {/* Фильтры */}
      <div className="filters">
        <input
          type="text"
          placeholder="Фильтр по имени"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Фильтр по специальности"
          value={filters.specialization}
          onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
        />
        <select onChange={(e) => setFilters({ ...filters, service_center: e.target.value })}>
            <option value="">Все склады</option>
            {serviceCenters.map((center) => (
                <option key={center.id} value={center.name}>{center.name}</option>
            ))}
        </select>
      </div>

      {/* Таблица ремонтников */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Фото</th>
            <th>Специальность</th>
            <th>ID сервис-центра</th>
            <th>Название сервис-центра</th>
            <th>Общее количество ремонтов</th>
            <th>Успешные ремонты</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {repairmen.filter(handleFilter).map((repairman) => (
            <tr key={repairman.id}>
              <td>{repairman.id}</td>
              <td>{repairman.username}</td>
              <td>
                {repairman.photo ? <img src={repairman.photo} alt="Фото" width="50" /> : "Нет фото"}
              </td>
              <td>{repairman.specialization}</td>
              <td>{repairman.service_center_id}</td>
              <td>{repairman.service_center_name || "Не указан"}</td>
              <td>{repairman.total_repairs || 0}</td>
              <td>{repairman.successful_repairs || 0}</td>
              <td>
                <button onClick={() => handleEdit(repairman)} style={{marginRight:'5px'}}>Редактировать</button>
                <button onClick={() => handleShowRepairs(repairman/*.id*/)} style={{marginRight:'5px'}}>История ремонтов</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Модальное окно для редактирования */}
      {editingRepairman && (
        <div className="modal">
          <h2>Редактирование ремонтника</h2>
          <input
            type="text"
            value={editingRepairman.username}
            onChange={(e) => setEditingRepairman({ ...editingRepairman, username: e.target.value })}
          />
          <input
            type="text"
            value={editingRepairman.photo}
            onChange={(e) => setEditingRepairman({ ...editingRepairman, photo: e.target.value })}
          />
          <input
            type="text"
            value={editingRepairman.specialization}
            onChange={(e) => setEditingRepairman({ ...editingRepairman, specialization: e.target.value })}
          />
          <label>Склад:</label>
            <select
                value={editingRepairman.service_center_id}
                onChange={(e) => setEditingRepairman({ ...editingRepairman, service_center_id: e.target.value })}
                >
                {serviceCenters.map((center) => (
                    <option key={center.id} value={center.id}>{center.name}</option>
                ))}
            </select>
          <button onClick={handleSaveEdit}>Сохранить</button>
          <button onClick={() => setEditingRepairman(null)}>Отмена</button>
        </div>
      )}

        {addingRepairman && (
        <div className="modal">
            <h2>Добавить ремонтника</h2>
            <input
              type="text"
              placeholder="Имя"
              value={newRepairman.username}
              onChange={(e) => setNewRepairman({ ...newRepairman, username: e.target.value })}
              />
            <input
              type="text"
              placeholder="Фото (URL)"
              value={newRepairman.photo}
              onChange={(e) => setNewRepairman({ ...newRepairman, photo: e.target.value })}
              />
            <input
              type="text"
              placeholder="Специальность"
              value={newRepairman.specialization}
              onChange={(e) => setNewRepairman({ ...newRepairman, specialization: e.target.value })}
              />
            <label>Склад:</label>
            <select
              value={newRepairman.service_center_id}
              onChange={(e) => setNewRepairman({ ...newRepairman, service_center_id: e.target.value })}
              >
              <option value="">Выберите склад</option>
              {serviceCenters.map((center) => (
                <option key={center.id} value={center.id}>{center.name}</option>
              ))}
            </select>
            <button onClick={() => handleAddRepairman(newRepairman)}>Сохранить</button>
            <button onClick={() => setAddingRepairman(false)}>Отмена</button>
        </div>
        )}
        {/* история ремонтов ремонтника */}
        {repairmanRepairs.length > 0 ? (
          <div className="modal">
            <h2>История ремонтов ремонтника {selectedRepairman ? selectedRepairman.username : "Неизвестен"}</h2>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Дата</th>
                        <th>Самокат</th>
                        <th>Узел</th>
                        <th>Тип ремонта</th>
                        <th>Успешность</th>
                    </tr>
                </thead>
                <tbody>
                  {repairmanRepairs.map((repair) => (
                    <tr key={repair.id}>
                        <td>{repair.id}</td>
                        <td>{formatDate(repair.repair_timestamp)}</td>
                        <td>{repair.scooter_registration_number || "Неизвестен"}</td>
                        <td>{repair.node}</td>
                        <td>{repair.repair_type}</td>
                        <td>{repair.success ? "✔" : "✖"}</td>
                    </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={() => setRepairmanRepairs([])}>Закрыть</button>
              </div>
            ) : (
              selectedRepairman && (
                  <div className="modal">
                      <h2>История ремонтов ремонтника {selectedRepairman?.username || "Неизвестен"}</h2>
                      <p>Ремонтник {selectedRepairman?.username} пока не имеет ремонтов.</p>
                      <button onClick={() => setSelectedRepairman(null)}>Закрыть</button>
                  </div>
              )
          )}
    </div>
    </div>
  );
};

export default Repairmen;
