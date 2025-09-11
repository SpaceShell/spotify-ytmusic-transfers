import { createContext } from 'react';

export const ItemsTransferContext = createContext({transfer: undefined, items: [], to: [], status: "unstarted", updateFunc: undefined}, () => {})
export const ToFromContext = createContext({from: undefined, to: undefined}, () => {})