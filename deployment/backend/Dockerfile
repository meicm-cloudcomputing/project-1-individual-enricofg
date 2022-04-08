FROM node
# Create app directory
WORKDIR /backend

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .

RUN npm install
RUN npm install forever -g
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
EXPOSE 8081
CMD [ "forever", "server.js" ]

