# Pricy - Price Scraper API 🏷️

A powerful web scraping API that extracts product prices from any e-commerce website using AI-powered browser automation.

## Features

- 🤖 AI-powered price extraction from any website
- 🌐 RESTful API with JSON responses
- 🔄 Support for both GET and POST requests
- 🚀 Easy deployment to multiple platforms
- 🛡️ Built-in error handling and validation
- 📊 Structured response format with metadata

## Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API key
- Browserbase API key (for production)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pricy.git
cd pricy

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys
```

### Environment Setup

Create a `.env` file with:

```env
OPENAI_API_KEY=your_openai_api_key
BROWSERBASE_API_KEY=your_browserbase_api_key
BROWSERBASE_PROJECT_ID=your_browserbase_project_id
NODE_ENV=development
```

### Running the API

```bash
# Development (uses local browser)
npm run api:dev

# Production
npm run api
```

## API Usage

### Endpoints

#### Health Check
```
GET /health
```

#### Extract Price (POST)
```
POST /extract-price
Content-Type: application/json

{
  "url": "https://example.com/product"
}
```

#### Extract Price (GET)
```
GET /extract-price?url=https://example.com/product
```

### Response Format

```json
{
  "success": true,
  "data": {
    "price": "$29.99",
    "currency": "USD",
    "url": "https://example.com/product",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Invalid URL format"
}
```

## Example Usage

### cURL

```bash
# POST request
curl -X POST http://localhost:3000/extract-price \
  -H "Content-Type: application/json" \
  -d '{"url": "https://amazon.com/product/123"}'

# GET request
curl "http://localhost:3000/extract-price?url=https://amazon.com/product/123"
```

### JavaScript/Node.js

```javascript
const response = await fetch('http://localhost:3000/extract-price', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://amazon.com/product/123' })
});

const result = await response.json();
console.log(result);
```

### Python

```python
import requests

response = requests.post(
    'http://localhost:3000/extract-price',
    json={'url': 'https://amazon.com/product/123'}
)

result = response.json()
print(result)
```

## Deployment

### Railway (Recommended)

1. Fork this repository
2. Sign up at [railway.app](https://railway.app)
3. Connect your GitHub repo
4. Set environment variables
5. Deploy automatically

### Vercel

```bash
npm i -g vercel
vercel
```

### Render

1. Sign up at [render.com](https://render.com)
2. Connect your GitHub repo
3. Use the included `render.yaml` configuration

### Docker

```bash
docker build -t pricy-api .
docker run -p 3000:3000 --env-file .env pricy-api
```

## Project Structure

```
├── api.ts              # Main API server
├── index.ts            # Original CLI scraper
├── example-client.ts   # Usage examples
├── utils.ts            # Utility functions
├── stagehand.config.ts # Browser configuration
├── Dockerfile          # Docker configuration
├── vercel.json         # Vercel deployment
├── render.yaml         # Render deployment
└── railway.json        # Railway deployment
```

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Stagehand** - Browser automation
- **OpenAI GPT-4** - AI-powered extraction
- **Browserbase** - Cloud browser service
- **TypeScript** - Type safety
- **Zod** - Schema validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open a GitHub issue or reach out on [Stagehand Slack](https://stagehand.dev/slack).

---

 Made with 🤘 by [Alex Ramirez](https://github.com/alexramirez)
