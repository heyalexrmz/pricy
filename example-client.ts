// Example client showing how to use the Price Scraper API

const API_BASE_URL = 'http://localhost:3000';

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

// Example using POST request
async function extractPriceWithPost(url: string): Promise<PriceResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/extract-price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

// Example using GET request
async function extractPriceWithGet(url: string): Promise<PriceResponse> {
  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(`${API_BASE_URL}/extract-price?url=${encodedUrl}`);
    
    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

// Example usage
async function main() {
  console.log('🔍 Testing Price Scraper API...\n');
  
  // Test with Amazon URL
  const amazonUrl = 'https://www.amazon.com.mx/gp/product/B0DDTKHX31?smid=A209UUQT8O7JCV&psc=1';
  
  console.log('Testing POST request...');
  const postResult = await extractPriceWithPost(amazonUrl);
  console.log('POST Result:', JSON.stringify(postResult, null, 2));
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('Testing GET request...');
  const getResult = await extractPriceWithGet(amazonUrl);
  console.log('GET Result:', JSON.stringify(getResult, null, 2));
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { extractPriceWithPost, extractPriceWithGet };
