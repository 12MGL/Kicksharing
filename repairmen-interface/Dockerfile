#официальный Node.js
FROM node:22 as build-stage

#устанавливаем рабочую апаку, копируем package перед установкой зависимостей
WORKDIR /repairmen-interface
COPY ./repairmen-interface/package*.json ./
#копируем и ставим права на исполнение скрипта получения ip
COPY ./set-ip-env.sh ./
RUN chmod +x ./set-ip-env.sh
#запускаем скрипт на получение ip для внутресетевого доступа к ресурсу
RUN ./set-ip-env.sh
RUN npm install
#копируем необходимые файлы. через COPY . . не получается скопировать.
COPY ./repairmen-interface/public ./public
COPY ./repairmen-interface/src ./src
COPY ./repairmen-interface/webpack.config.js ./webpack.config.js
RUN echo "REACT_APP_API_URL=http://backend:3000" > .env
#запускаем сборку 
RUN npm run build

#nginx
FROM nginx:stable-alpine
COPY --from=build-stage /repairmen-interface/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
