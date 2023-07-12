import { type Translations } from './Translations';

export type TranslationLoader = (
  locale: string,
) => Translations | Promise<Translations>;
