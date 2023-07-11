import { unflatten } from 'flat';
import { readFile } from 'fs/promises';

export default async function loadJSON(path: string): Promise<object> {
  return await readFile(path, 'utf-8')
    .then((content) => JSON.parse(content))
    .then((data) => unflatten(data));
}
