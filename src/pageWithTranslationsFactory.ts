import { get, isNull, isUndefined, merge, set } from 'lodash';
import {
  type GetStaticProps,
  type GetStaticPropsContext,
  type PreviewData,
} from 'next';
import { type ParsedUrlQuery } from 'querystring';
import { type TranslationLoader } from './types/TranslationLoader';

export function pageWithTranslationsFactory<T extends TranslationLoader>(
  loader: T,
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

      const translations = await loader.load(gspContext.locale as string);
      const i18n = namespaces.reduce((p, c) => {
        const target = get(p, c);
        const source = get(translations, c);

        if (isNull(source) || isUndefined(source)) {
          return p;
        }

        if (isNull(target) || isUndefined(target)) {
          return set(p, c, source);
        }

        return set(p, c, merge(target, source));
      }, {});

      if (getStaticProps != null) {
        return merge({ props: { i18n } }, await getStaticProps(gspContext));
      }

      return { props: { i18n } };
    };
  };
}
