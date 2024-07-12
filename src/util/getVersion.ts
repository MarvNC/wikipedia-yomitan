import { file } from 'bun';
import { join } from 'path';

export async function getVersion(): Promise<string> {
  const packageJsonPath = join(process.cwd(), 'package.json');
  try {
    const packageJson = await file(packageJsonPath).json();
    if (!packageJson.version) {
      throw new Error('Version not found in package.json');
    }
    return packageJson.version;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read package.json: ${error.message}`);
    }
    throw error;
  }
}
