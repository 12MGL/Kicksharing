#!/bin/bash

#получение локального ip 
#ip=$(ipconfig | findstr /R "IPv4" | head -n 1 | cut -d: -f2 | tr -d '[:space:]')
ip=$(ipconfig | awk '/IPv4/ {print $14}' | sed -n '2p')
# sed -n '2p' - фильтрует второй строковый результат, который будет содержать второй IP-адрес.
# awk '/IPv4/ {print $14}': Это находит строку, содержащую "IPv4", и извлекает 14-е поле в этой строке, которое обычно будет содержать IP-адрес.
# findstr /R "IPv4" - ищет строку с IPv4 адресом.
# head -n 1 - ограничивает вывод только первой строки с IPv4.
# cut -d: -f2 - извлекает значение после двоеточия.
# tr -d '[:space:]' - удаляет пробелы.

#записываем IP в файлы .env
echo "REACT_APP_API_URL=http://$ip:8080" > ./admin-panel/.env
echo "REACT_APP_API_URL=http://$ip:8081" > ./repairmen-interface/.env

echo "API URL установлен как: http://$ip:3000"