import { DirectoryLoader } from './DirectoryLoader';

export class YAMLLoader extends DirectoryLoader {
  async parse(input: string): Promise<any> {
    return await import('yaml').then(($) => $.parse(input));
  }
}
