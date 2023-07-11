import { get, isObject } from 'lodash';
import Mustache from 'mustache';
import { useCallback } from 'react';
import { useI18n } from './I18nProvider';

export class TranslationError extends Error {}

export function useTranslation(prefix?: string): {
  t: <T extends object>(path: string, context?: T) => string;
} {
  const { i18n } = useI18n();
  const t = useCallback(
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
    [prefix, i18n],
  );

  return { t };
}
