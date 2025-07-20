import { createContext } from 'react';

export const ItemsTransferContext = createContext({transfer: undefined, items: [], to: []}, () => {})
export const ToFromContext = createContext({from: undefined, to: undefined}, () => {})