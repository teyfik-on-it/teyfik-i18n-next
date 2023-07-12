import { DirectoryLoader } from './DirectoryLoader';

export class YAMLLoader extends DirectoryLoader {
  constructor(...segments: string[]) {
    super('*.{yml,yaml}', segments);
  }

  async parse(input: string): Promise<any> {
    return await import('yaml').then(($) => $.parse(input));
  }
}
