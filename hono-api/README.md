```
npm install
npm run dev
```

```
open http://localhost:3000
```

### Usage:

# Build the image
docker build -t hono-api .

# Run the container
docker run -d -p 3000:3000 hono-api

# For production with database persistence:
docker run -d -p 3000:3000 -v $(pwd)/data:/usr/src/app/data hono-api