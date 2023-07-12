import { DirectoryLoader } from './DirectoryLoader';

export class JSONLoader extends DirectoryLoader {
  constructor(...segments: string[]) {
    super('*.json', segments);
  }

  async parse(input: string): Promise<any> {
    return await import('parse-json').then(($) => $.default(input));
  }
}
