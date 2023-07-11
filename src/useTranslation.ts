import { get, isObject } from 'lodash-es';
import Mustache from 'mustache';
import React from 'react';
import { useCtx } from './I18nProvider';
import { type Translate } from './types/Translate';
import { type Translations } from './types/Translations';

interface UseTranslation {
  t: Translate;
  i18n: Translations;
}

export class TranslationError extends Error {}

export function useTranslation(prefix?: string): UseTranslation {
  const i18n = useCtx();
  const t = React.useCallback(
    <T extends { key: string }, U extends object>(
      path: string | T,
      context?: U,
    ) => {
      if (isObject(path)) {
        path = path.key;
      }

      if (typeof prefix === 'string') {
        path = prefix + '.' + path;
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
    [i18n, prefix],
  );

  return { t, i18n } as const;
}
