
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y curl \
        curl \
        wget \
        unzip

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs
    
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN wget https://github.com/ACINQ/phoenixd/releases/download/v0.3.3/phoenix-0.3.3-linux-x64.zip \
    && unzip -j phoenix-0.3.3-linux-x64.zip -d /usr/local/bin/ \
    && chmod +x /usr/local/bin/phoenixd

COPY start.sh /usr/src/app/start.sh
RUN chmod +x /usr/src/app/start.sh

EXPOSE 3000

CMD ["/usr/src/app/start.sh"]




