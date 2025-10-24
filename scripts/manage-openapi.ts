import fs from 'fs';
import yaml from 'js-yaml';
import dotenv from 'dotenv';


dotenv.config();

// Get backend URL from environment, check command line args first
const backendUrl: string =
  process.env.ZUDOKU_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://zudoku-backend.onrender.com'
    : 'http://localhost:3001');

// Path to the template file
const templatePath = './openapi.template.yaml'; // Use a different name for template
const outputPath = './openapi.yaml';

try {
  // Check if template file exists
  // Read the template file as string
  let templateContent = fs.readFileSync(templatePath, 'utf8');

  // Replace environment variables in the template
  templateContent = templateContent.replace(/\${BACKEND_URL}/g, backendUrl);

  // Write the processed content directly
  fs.writeFileSync(outputPath, templateContent);


} catch (error) {
  process.exit(1);
}
