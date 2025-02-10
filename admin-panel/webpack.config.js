const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');   

module.exports = {
    entry: "./src/index.js",    //входная точка
    output: {       //выходные файлы
        path: path.resolve(__dirname, 'build'),
        filename: "bundle.js",      //хранение итогового кода
    },
    mode: "development",    //быстрый билд, без "минификации", "production" - "минификация", удаление мусора. "none" - без оптимизации кода (для тестирования)
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,        //регулярное выражение для поиска в данном случае js и jsx файлов
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",     //загрузчик JavaScript
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }
            },
            {
                test: /\.css$/,         
                use: ["style-loader", "css-loader"],        //благодаря загрузчику CSS, webpack поймёт импорты стилей среди кода и загрузит их.
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",        //создание HTML-файла в dist/, если там его нет, подключит стили, а index.html останется именно как шаблон
        }),
        new Dotenv(),   //подключаем переменные среды в .env
    ],
    resolve: {
        extensions: [".js", ".jsx"],        //при импорте модулей (import Logs from "./pages/Logs") Webpack будет автоматически подставлять js и jsx расширение этому файлу 
    },
    devServer: {  //настройки встроенного сервера для разработки, пересобирающего код при изменениях
        static: path.join(__dirname, 'build'),      //статику нужно искать в папке build/
        hot: true,  //включаем горячую замену модулей (Hot Module Replacement), изменяющую код без перезагрузки страницы (HMR обновляет только изменённый код, а не всю страницу)
        historyApiFallback: true, //разрешает конфликты маршрутизации - если страницы нет - перенаправляет на index.html, а не загружает "404".
    },
};
