import fs from 'fs';
import yaml from 'js-yaml';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get backend URL from environment
const backendUrl: string | undefined = process.env.ZUDOKU_PUBLIC_BACKEND_URL;

// Path to the template file
const templatePath = './openapi.template.yaml'; // Use a different name for template
const outputPath = './openapi.yaml';

try {
  // Check if template file exists
  // Read and parse the template YAML file
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  
  // Replace environment variables in the template
  const processedContent = templateContent.replace(/\${BACKEND_URL}/g, backendUrl);
  
  // Parse the processed YAML
  const openapiSpec = yaml.load(processedContent);
  
  // Generate new openapi.yaml with environment variable
  fs.writeFileSync(outputPath, yaml.dump(openapiSpec, { lineWidth: -1 }));
  
  
} catch (error) {
  process.exit(1);
}