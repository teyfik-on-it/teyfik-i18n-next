import { get, merge, set } from 'lodash';
import { resolve } from 'path';
import { type TranslationLoader } from '../types/TranslationLoader';
import { type Translations } from '../types/Translations';

export abstract class DirectoryLoader implements TranslationLoader {
  constructor(
    readonly matcher: string,
    readonly segments: string[],
  ) {}

  abstract parse(input: string): any;

  async load(locale: string): Promise<Translations> {
    const [{ default: glob }, { readFile }, { default: slash }] =
      await Promise.all([
        import('glob-promise'),
        import('fs/promises'),
        import('slash'),
      ]);
    const root = slash(resolve(process.cwd(), ...this.segments, locale));
    const pattern = slash(resolve(root, '**', this.matcher));
    const files = await glob(pattern);
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
      (p, [path, data]) => set(p, path, merge(get(p, path), data)),
      {},
    );

    return result;
  }
}
