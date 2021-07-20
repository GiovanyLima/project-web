FROM node:14.17.3-alpine
WORKDIR /app
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY . .
ARG REACT_APP_API
ENV REACT_APP_API=${REACT_APP_API}
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"] 