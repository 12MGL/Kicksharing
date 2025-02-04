#официальный Node.js
FROM node:22 as build-stage

WORKDIR /admin-panel
COPY ./admin-panel/package*.json ./
#копируем и ставим права на исполнение скрипта получения ip
COPY ./set-ip-env.sh ./
RUN chmod +x ./set-ip-env.sh
#запускаем скрипт на получение ip для внутресетевого доступа к ресурсу
RUN ./set-ip-env.sh
RUN npm install
COPY ./admin-panel ./
RUN npm run build

#nginx для статики
FROM nginx:stable-alpine
COPY --from=build-stage /admin-panel/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
