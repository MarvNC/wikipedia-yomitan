import fs from 'fs';
import path from 'path';

export function getVersion(): string {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  if (!packageJson.version) {
    throw new Error('Could not get version from package.json');
  }
  return packageJson.version;
}
