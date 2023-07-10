import fastGlob, { convertPathToPattern } from 'fast-glob';
import { unflatten } from 'flat';
import { readFile } from 'fs/promises';
import { get, merge, set } from 'lodash-es';
import { resolve } from 'path';
import { type Translations } from './types/Translations';

async function loadJSONFile(path: string): Promise<object> {
  return await readFile(path, 'utf-8')
    .then((content) => JSON.parse(content))
    .then((data) => unflatten(data));
}

function resolveObjectPath(path: string, file: string): string {
  return file
    .replace(path, '')
    .replace(/\.json$/i, '')
    .substring(1)
    .replace('/', '.');
}

async function loadTranslations(
  segments: string[],
  locale: string,
): Promise<Translations> {
  const path = convertPathToPattern(resolve(process.cwd(), ...segments));
  const pattern = convertPathToPattern(resolve(path, '**', '*.json'));
  const files = await fastGlob(pattern);
  const contents = await Promise.all(
    files.map(
      async (file) =>
        await loadJSONFile(file).then((content) => ({
          path: resolveObjectPath(path, file),
          content,
        })),
    ),
  );
  const result = contents.reduce(
    (p, c) => set(p, c.path, merge(get(p, c.path, c.content))),
    {},
  );

  return get(result, locale);
}

export function createLoadTranslations(...segments: string[]) {
  return async function _(locale: string) {
    return await loadTranslations(segments, locale);
  };
}
