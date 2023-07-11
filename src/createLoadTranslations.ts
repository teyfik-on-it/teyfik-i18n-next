import fastGlob, { convertPathToPattern } from 'fast-glob';
import { get, merge, set } from 'lodash';
import { resolve } from 'path';
import loadJSON from './helpers/loadJSON';
import { type Translations } from './types/Translations';

async function loadTranslations(
  segments: string[],
  locale: string,
): Promise<Translations> {
  const path = convertPathToPattern(resolve(process.cwd(), ...segments));
  const pattern = convertPathToPattern(resolve(path, locale, '**', '*.json'));
  const files = await fastGlob(pattern);
  const contents = await Promise.all(
    files.map(
      async (file) =>
        await loadJSON(file).then((content) => ({
          path: file.slice(1, -5).replace(path, '').replace(/\//g, '.'),
          content,
        })),
    ),
  );
  const result = contents.reduce(
    (p, c) => set(p, c.path, merge(get(p, c.path, c.content))),
    {},
  );

  return result;
}

export function createLoadTranslations(...segments: string[]) {
  return async function _(locale: string) {
    return await loadTranslations(segments, locale);
  };
}
