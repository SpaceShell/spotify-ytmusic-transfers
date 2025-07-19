import { createContext } from 'react';

export const ItemsTransferContext = createContext([])
export const ToFromContext = createContext({from: undefined, to: undefined}, () => {})