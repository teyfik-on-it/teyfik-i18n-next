import { get, merge, set } from 'lodash-es';
import { resolve } from 'path';
import { type TranslationLoader } from '../types/TranslationLoader';
import { type Translations } from '../types/Translations';

export abstract class DirectoryLoader implements TranslationLoader {
  readonly segments: string[];

  constructor(...segments: string[]) {
    this.segments = segments;
  }

  abstract parse(input: string): any;

  async load(locale: string): Promise<Translations> {
    const [fastGlob, readFile] = await Promise.all([
      import('fast-glob').then(($) => $.default),
      import('fs/promises').then(($) => $.readFile),
    ]);
    const root = fastGlob.convertPathToPattern(
      resolve(process.cwd(), ...this.segments, locale),
    );
    const pattern = fastGlob.convertPathToPattern(
      resolve(root, '**', '*.json'),
    );
    const files = await fastGlob(pattern);
    const contents = await Promise.all(
      files.map(
        async (file) =>
          await readFile(file, 'utf-8')
            .then((raw) => this.parse(raw))
            .then(
              (data) =>
                [
                  file.replace(root, '').slice(1, -5).replace(/\//g, '.'),
                  data,
                ] as const,
            ),
      ),
    );
    const result = contents.reduce(
      (p, [path, data]) => set(p, path, merge(get(p, path, data))),
      {},
    );

    return result;
  }
}
