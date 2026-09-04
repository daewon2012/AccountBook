import * as SecureStore from 'expo-secure-store';
const TOKEN_KEY='accountbook.auth-token';
export interface TokenStorage { get():Promise<string|null>; set(token:string):Promise<void>; clear():Promise<void>; }
export const tokenStorage:TokenStorage={get:()=>SecureStore.getItemAsync(TOKEN_KEY),set:(token)=>SecureStore.setItemAsync(TOKEN_KEY,token),clear:()=>SecureStore.deleteItemAsync(TOKEN_KEY)};
