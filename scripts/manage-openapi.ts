import fs from 'fs';
import yaml from 'js-yaml';
import dotenv from 'dotenv';

// Command line args take precedence
const commandLineUrl = process.argv.find(arg => arg.startsWith('--backend-url='))?.split('=')[1];

// Get backend URL from environment, check command line args first
const backendUrl: string =
  commandLineUrl ||
  process.env.ZUDOKU_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://zudoku-backend.onrender.com'
    : 'http://localhost:3001');

// Load .env only if we don't have command line overrides
if (!commandLineUrl && !process.env.ZUDOKU_PUBLIC_BACKEND_URL) {
  dotenv.config();
}

// Path to the template file
const templatePath = './openapi.template.yaml'; // Use a different name for template
const outputPath = './openapi.yaml';

console.log(`Generating OpenAPI spec with backend URL: ${backendUrl}`);

try {
  // Check if template file exists
  // Read the template file as string
  let templateContent = fs.readFileSync(templatePath, 'utf8');

  // Replace environment variables in the template
  templateContent = templateContent.replace(/\${BACKEND_URL}/g, backendUrl);

  // Write the processed content directly
  fs.writeFileSync(outputPath, templateContent);

  console.log(`Generated openapi.yaml with backend URL: ${backendUrl}`);

} catch (error) {
  console.error('Error generating openapi.yaml:', error);
  process.exit(1);
}
