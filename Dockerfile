
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y curl \
        curl \
        wget \
        unzip \
        supervisor

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN touch .env



RUN wget https://github.com/ACINQ/phoenixd/releases/download/v0.3.3/phoenix-0.3.3-linux-x64.zip \
    && unzip -j phoenix-0.3.3-linux-x64.zip -d /usr/local/bin/ \
    && chmod +x /usr/local/bin/phoenixd

COPY docker_entrypoint.sh /usr/src/app/docker_entrypoint.sh
# COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN chmod +x /usr/src/app/docker_entrypoint.sh

RUN chmod -R 755 /usr/local/bin/

EXPOSE 3000 

CMD ["/usr/src/app/docker_entrypoint.sh"]




