import { file } from 'bun';

export async function getVersion(): Promise<string> {
  const packageJsonPath = `${import.meta.dir}/../package.json`;
  const packageJson = await file(packageJsonPath).json();
  if (!packageJson.version) {
    throw new Error('Could not get version from package.json');
  }
  return packageJson.version;
}
