FROM node:20-bookworm

# Install the exact dependencies Chrome needs + Go for the Vibium daemon
RUN apt-get update && apt-get install -y \
    wget gnupg ca-certificates \
    libgbm1 libnss3 libatk-bridge2.0-0 libgtk-3-0 libasound2 \
    golang-go make dumb-init \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install

# Force Vibium to install its browser in a known path
RUN npx playwright install chrome

COPY . .

# Set environment variables to guide the Vibium daemon
ENV VIBIUM_LOG_LEVEL=debug
ENV VIBIUM_SKIP_BROWSER_DOWNLOAD=1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "index.js"]