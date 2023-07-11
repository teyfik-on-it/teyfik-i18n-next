import { isObject } from 'lodash';
import { useCallback, useContext } from 'react';
import { Context, type IContext } from './Context';
import { getType } from './helpers/getType';
import { type Translate } from './types/Translate';

export function useTranslation(prefix?: string): IContext {
  const { t: $t } = useContext(Context) ?? {};

  if ($t == null) {
    throw new Error('useTranslation must be used under appWithtranslations');
  }

  const t = useCallback<Translate>(
    (path, context?) => {
      if (isObject(path)) {
        path = path.key;
      }

      if (typeof path !== 'string') {
        throw new Error(`Expected path to be string, given: ${getType(path)}`);
      }

      return $t(
        typeof prefix === 'string' ? prefix + '.' + path : path,
        context,
      );
    },
    [$t, prefix],
  );

  return { t };
}
