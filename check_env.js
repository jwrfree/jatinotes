
const fs = require('fs');
const path = require('path');

try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('SANITY_API_WRITE_TOKEN=')) {
      console.log('SANITY_API_WRITE_TOKEN is present in .env.local');
    } else {
      console.log('SANITY_API_WRITE_TOKEN is MISSING in .env.local');
    }
  } else {
    console.log('.env.local file not found');
  }
} catch (error) {
  console.error('Error checking .env.local:', error);
}
