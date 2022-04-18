# build
FROM node:17-alpine3.14 as build
ARG API_URI 
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV e1 inBuild
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install react-scripts@5.0.0 -g --silent
COPY .. /app
RUN REACT_APP_API_URL=${API_URI} npm run build

# production environment
FROM nginx:1.21.6
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
