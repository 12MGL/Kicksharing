router.put("/:id", async (req, res) => {
    try {
        const complaintId = req.params.id;
        const { status } = req.body;
        const adminId = req.headers["admin-id"]; //получаем id админа

        const query = `UPDATE complaints SET status = ? WHERE id = ?`;
        const [result] = await db.query(query, [status, complaintId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Жалоба не найдена" });
        }

        //логируем админа
        await logAdminAction(adminId, "Изменил статус жалобы", `Жалоба ID: ${complaintId}, Новый статус: ${status}`);

        res.json({ message: "Статус жалобы обновлён!" });
    } catch (error) {
        console.error("Ошибка при обновлении жалобы:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});
