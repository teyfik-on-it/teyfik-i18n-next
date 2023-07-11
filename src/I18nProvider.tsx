import { get, isObject } from 'lodash';
import Mustache from 'mustache';
import React from 'react';
import { type Translate } from './types/Translate';
import { type Translations } from './types/Translations';

interface Ctx {
  t: Translate;
  i18n: Translations;
}

const Context = React.createContext<null | Ctx>(null);

export class TranslationError extends Error {}

export function I18nProvider({
  i18n,
  children,
}: React.PropsWithChildren<{ i18n: Translations }>): React.ReactElement {
  const t = React.useCallback(
    <T extends { key: string }, U extends object>(
      path: string | T,
      context?: U,
    ) => {
      if (isObject(path)) {
        path = path.key;
      }

      if (isObject(context)) {
        if ('answer' in context && typeof context.answer === 'boolean') {
          if (context.answer) {
            path += '.yes';
          } else {
            path += '.no';
          }
        }

        if ('count' in context && typeof context.count === 'number') {
          if (context.count === 0) {
            path += '.zero';
          } else if (context.count === 1) {
            path += '.one';
          } else {
            path += '.other';
          }
        }
      }

      const template = get(i18n, path) ?? path;

      if (template === path) {
        console.warn('Missing translation: ' + path);
      }

      if (typeof template === 'string') {
        return Mustache.render(
          template,
          context,
          {},
          // React already escapes dangerous values
          { escape: String },
        );
      }

      throw new TranslationError(
        `Resolved value for path is ${typeof template}: ${JSON.stringify(
          template,
        )}`,
      );
    },
    [i18n],
  );

  return <Context.Provider value={{ t, i18n }}>{children}</Context.Provider>;
}

export function useI18n(): Ctx {
  const context = React.useContext(Context);

  if (context === null) {
    throw new Error('Can not find I18nContext');
  }

  return context;
}
