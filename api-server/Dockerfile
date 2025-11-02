# Stage 1: build
FROM node:23 as builder

WORKDIR /build

# Copy package manifests
COPY package*.json ./

RUN npm install

#Copy source code
# COPY ./ ./
COPY ./src/ ./src/
COPY tsconfig.json tsconfig.json

# Build your Typescript ( build script)
RUN npm run build


#Stage 2:runtime
FROM node:23 as runner

WORKDIR /app

COPY --from=builder build/package*.json ./
COPY --from=builder build/node_modules/ ./node_modules/
COPY --from=builder build/dist/ ./dist/

CMD ["npm","start"]





