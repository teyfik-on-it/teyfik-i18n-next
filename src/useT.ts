import { get, isObject } from 'lodash';
import Mustache from 'mustache';
import { useCallback } from 'react';
import { type Translate } from './types/Translate';

export class TranslationError extends Error {}

export function useT(i18n: string): Translate {
  return useCallback<Translate>(
    (path, context?) => {
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

      if (path === template) {
        throw new TranslationError(
          `Expected string but got ${typeof template}: ${JSON.stringify(
            template,
          )}`,
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
}
