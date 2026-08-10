FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html script.js style.css /usr/share/nginx/html/
EXPOSE 80
