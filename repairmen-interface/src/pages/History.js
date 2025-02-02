import React, { useState, useEffect } from "react";
import { getRepairHistory } from "../api";
import { formatDate } from "../utils";
import "../styles/Layout.css";

const History = () => {
  const [repairs, setRepairs] = useState([]);
  const [repairmanId, setRepairmanId] = useState(null);

  useEffect(() => {
    //получаем id залогинившегося ремонтника из локального хранилища
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setRepairmanId(storedUser.id);
    }
  }, []);

  useEffect(() => {
    if (!repairmanId) return; //ждём загрузки id

    const fetchHistory = async () => {
      const data = await getRepairHistory(repairmanId);
      setRepairs(data);
    };

    fetchHistory();
  }, [repairmanId]); //история ремонтов загрузится только после загрузки id ремонтника


  return (
    <div className="page">
      <h2>История ремонтов</h2>
      {repairs.length === 0 ? (
        <p>Вы пока не выполнили ни одного ремонта.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Дата</th>
              <th>Рег.номер самоката</th>
              <th>Сер.номер самоката</th>
              <th>Узел</th>
              <th>Тип ремонта</th>
              <th>Успешность</th>
            </tr>
          </thead>
          <tbody>
            {repairs.map((repair) => (
              <tr key={repair.id}>
                <td>{repair.id}</td>
                <td>{formatDate(repair.repair_timestamp)}</td>
                <td>{repair.scooter_registration_number || "Неизвестно"}</td>
                <td>{repair.scooter_serial_number || "Неизвестно"}</td>
                <td>{repair.node}</td>
                <td>
                  {repair.repair_type === "with_parts"
                    ? "С запчастями"
                    : repair.repair_type === "with_consumables"
                    ? "С расходниками"
                    : "Без запчастей"}
                </td>
                <td>{repair.success ? "Успешно" : "Неуспешно"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;
