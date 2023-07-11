import React from 'react';
import { type Translations } from './types/Translations';

interface Ctx {
  i18n: Translations;
}

const Context = React.createContext<null | Ctx>(null);

export function I18nProvider({
  i18n,
  children,
}: React.PropsWithChildren<{ i18n: Translations }>): React.ReactElement {
  return <Context.Provider value={{ i18n }}>{children}</Context.Provider>;
}

export function useI18n(): Ctx {
  const context = React.useContext(Context);

  if (context === null) {
    throw new Error('Can not find I18nContext');
  }

  return context;
}
