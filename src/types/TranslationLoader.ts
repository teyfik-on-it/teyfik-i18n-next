import { type Translations } from './Translations';

export interface TranslationLoader {
  load: (locale: string) => Translations | Promise<Translations>;
}
