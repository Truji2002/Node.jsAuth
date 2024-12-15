# Usa una imagen oficial de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de tu código
COPY . .

# Expone el puerto en el que corre la app
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "index.js"]
