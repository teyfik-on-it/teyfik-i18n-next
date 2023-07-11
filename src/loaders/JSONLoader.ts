import parse from 'parse-json';
import { DirectoryLoader } from './DirectoryLoader';

export class JSONLoader extends DirectoryLoader {
  parse = parse;
}
