import express from 'express';
import cors from 'cors';
import { Stagehand, Page, BrowserContext } from "@browserbasehq/stagehand";
import StagehandConfig from "./stagehand.config.js";
import { z } from "zod";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface PriceResponse {
  success: boolean;
  data?: {
    price: string;
    currency?: string;
    url: string;
    timestamp: string;
  };
  error?: string;
}

// Price extraction function
async function extractPrice(url: string): Promise<PriceResponse> {
  let stagehand: Stagehand | null = null;
  
  try {
    // Validate URL
    const urlSchema = z.string().url();
    urlSchema.parse(url);
    
    // Initialize Stagehand
    stagehand = new Stagehand({
      ...StagehandConfig,
      // Use Browserbase in production, local browser in development
      env: process.env.NODE_ENV === 'production' ? 'BROWSERBASE' : 'LOCAL',
    });
    await stagehand.init();
    
    const page = stagehand.page;
    
    // Navigate to the provided URL
    await page.goto(url);
    
    // Wait for the page to load
    await page.waitForTimeout(3000);
    
    // Extract the current price from the page
    const priceData = await page.extract({
      instruction: "extract the current price of the product",
      schema: z.object({
        price: z.string().describe("The current price of the product"),
        currency: z.string().optional().describe("The currency symbol or code"),
      }),
    });
    
    return {
      success: true,
      data: {
        price: priceData.price,
        currency: priceData.currency,
        url: url,
        timestamp: new Date().toISOString(),
      }
    };
    
  } catch (error) {
    console.error('Error extracting price:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  } finally {
    // Always close the browser instance
    if (stagehand) {
      await stagehand.close();
    }
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Price extraction endpoint
app.post('/extract-price', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required in request body'
      });
    }
    
    const result = await extractPrice(url);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET endpoint for easier testing
app.get('/extract-price', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'URL query parameter is required'
      });
    }
    
    const result = await extractPrice(url);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Price Scraper API running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`💰 Extract price: POST http://localhost:${PORT}/extract-price`);
  console.log(`💰 Extract price (GET): http://localhost:${PORT}/extract-price?url=YOUR_URL`);
});

export default app;
