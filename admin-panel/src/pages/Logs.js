import React, { useState, useEffect } from "react";
import { getAdminLogs } from "../api";
import "../styles/App.css";

const Logs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        const data = await getAdminLogs();
        setLogs(data);
    };

    return (
        <div className="page">
            <div className="logs-container" style={{ marginLeft: "130px", padding: "20px" }}>
                <h1>Логи действий админа</h1>
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Дата</th>
                            <th>Админ</th>
                            <th>Действие</th>
                            <th>Детали</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length > 0 ? (
                            logs.map((log) => (
                                <tr key={log.id}>
                                    <td>{log.id}</td>
                                    <td>{new Date(log.timestamp).toLocaleString("ru-RU")}</td>
                                    <td>{log.admin_name || "Неизвестен"}</td>
                                    <td>{log.action}</td>
                                    <td>{log.details}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Логов нет</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Logs;
