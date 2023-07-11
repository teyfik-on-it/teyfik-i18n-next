import { type AppProps } from 'next/app';
import React from 'react';
import { Context } from './Context';
import { useT } from './useT';

export function appWithTranslations(
  AppComponent: React.ComponentType<AppProps>,
): React.ComponentType<AppProps> {
  return function AppWithTranslations(props) {
    // eslint-disable-next-line react/prop-types
    const { i18n } = props.pageProps;
    const t = useT(i18n);

    return (
      <Context.Provider value={{ t }}>
        <AppComponent {...props} />
      </Context.Provider>
    );
  };
}
