import { createContext } from 'react';
import { type Translate } from './types/Translate';

export interface IContext {
  t: Translate;
}

export const Context = createContext<null | IContext>(null);
