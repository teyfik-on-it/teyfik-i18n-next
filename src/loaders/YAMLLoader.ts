import { parse } from 'yaml';
import { DirectoryLoader } from './DirectoryLoader';

export class YAMLLoader extends DirectoryLoader {
  parse = parse;
}
