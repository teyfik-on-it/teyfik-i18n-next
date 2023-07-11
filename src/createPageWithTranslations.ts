import { get, isNull, isUndefined, merge, set } from 'lodash-es';
import {
  type GetStaticProps,
  type GetStaticPropsContext,
  type PreviewData,
} from 'next';
import { type ParsedUrlQuery } from 'querystring';
import { type Translations } from './types/Translations';

export function createPageWithTranslations(
  loadTranslations: (locale: string) => Translations | Promise<Translations>,
) {
  return function _<
    Props extends Record<string, any> = Record<string, any>,
    Params extends ParsedUrlQuery = ParsedUrlQuery,
    Preview extends PreviewData = PreviewData,
    Fn extends GetStaticProps<Props, Params, Preview> = GetStaticProps<
      Props,
      Params,
      Preview
    >,
    Context extends GetStaticPropsContext<
      Params,
      Preview
    > = GetStaticPropsContext<Params, Preview>,
  >(namespaces: string | string[], getStaticProps?: Fn) {
    return async function $(gspContext: Context) {
      if (typeof namespaces === 'string') {
        namespaces = namespaces.split(/\s+/);
      }

      const translations = await loadTranslations(gspContext.locale as string);
      const i18n = namespaces.reduce((p, c) => {
        const left = get(p, c);
        const right = get(translations, c);

        if (isNull(right) || isUndefined(right)) {
          return p;
        }

        if (isNull(left) || isUndefined(left)) {
          return set(p, c, right);
        }

        return set(p, c, merge(left, right));
      }, {});

      if (getStaticProps != null) {
        return merge({ props: { i18n } }, await getStaticProps(gspContext));
      }

      return { props: { i18n } };
    };
  };
}
