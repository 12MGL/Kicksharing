import React, { useState, useEffect } from "react";
import { getParts, updatePart, addPart } from "../api";
import "../styles/App.css";

//тут всё по аналогии с Scooters.js. почти всё скопировано с него.

const Parts = () => {
  const [parts, setParts] = useState([]);
  const [editingPart, setEditingPart] = useState(null);
  const [filters, setFilters] = useState({ article: "", name: "", minQuantity: "" });
  const [addingPart, setAddingPart] = useState(false);

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    const data = await getParts();
    setParts(data);
  };

  const handleEdit = (part) => {
    setEditingPart({ ...part });
  };

  const handleSave = async () => {
    const success = await updatePart(editingPart.id, editingPart);
    if (success) {
      fetchParts();
      setEditingPart(null);
    } else {
      alert("Ошибка при обновлении данных.");
    }
  };

  const handleFilter = (part) => {
    return (
      (!filters.article || part.article.toLowerCase().includes(filters.article.toLowerCase())) &&
      (!filters.name || part.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.minQuantity || part.quantity <= parseInt(filters.minQuantity))  //выведет позици запчастей, которых меньше или равно указанного числа. нужно, чтобы знать, какие запчасти кончаются на складе
    );
  };

  const handleAddPart = async (newPart) => {
    const success = await addPart(newPart);
    if (success) {
      fetchParts();
      setAddingPart(false);
    } else {
      alert("Ошибка при добавлении запчасти.");
    }
  };

  return (
    <div className="page">
    <div className="parts-container" style={{ marginLeft: "130px", padding: "20px" }}>
      <h1>Склад запчастей</h1>
      <button style={{ padding: "5px" }} onClick={() => setAddingPart(true)}>Добавить запчасть</button>
      <p></p>

      {/* Фильтры */}
      <div className="filters">
        <input
          type="text"
          placeholder="Фильтр по артикулу"
          value={filters.article}
          onChange={(e) => setFilters({ ...filters, article: e.target.value })}
        />
        <input
          type="text"
          placeholder="Фильтр по названию"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        {/* добавил фильтр по количеству, чтобы проверять, каких запчастей на складе осталось мало */}
        <input
          type="number"
          placeholder="фильтр по количеству"
          value={filters.minQuantity}
          onChange={(e) => setFilters({ ...filters, minQuantity: e.target.value })}
        />
      </div>

      {/* Таблица запчастей */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Артикул</th>
            <th>Название</th>
            <th>Количество</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {parts.filter(handleFilter).map((part) => (
            <tr key={part.id}>
              <td>{part.id}</td>
              <td>{part.article}</td>
              <td>{part.name}</td>
              <td>{part.quantity}</td>
              <td>
                <button onClick={() => handleEdit(part)}>Редактировать</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* модальное окно для редактирования */}
      {editingPart && (
        <div className="modal">
          <h2>Редактирование запчасти</h2>
          <input
            type="text"
            value={editingPart.article}
            onChange={(e) => setEditingPart({ ...editingPart, article: e.target.value })}
          />
          <input
            type="text"
            value={editingPart.name}
            onChange={(e) => setEditingPart({ ...editingPart, name: e.target.value })}
          />
          <input
            type="number"
            value={editingPart.quantity}
            onChange={(e) => setEditingPart({ ...editingPart, quantity: e.target.value })}
          />
          <button onClick={handleSave}>Сохранить</button>
          <button onClick={() => setEditingPart(null)}>Отмена</button>
        </div>
      )}
      {/* модальное окно для добавления */}
      {addingPart && (
        <div className="modal">
          <h2>Добавить новую запчасть</h2>
          <input type="text" placeholder="Артикул" id="article" />
          <input type="text" placeholder="Название" id="name" />
          <input type="number" placeholder="Количество" id="quantity" />
          <button onClick={() => handleAddPart({
            article: document.getElementById("article").value,
            name: document.getElementById("name").value,
            quantity: document.getElementById("quantity").value
          })}>Сохранить</button>
          <button onClick={() => setAddingPart(false)}>Отмена</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default Parts;
