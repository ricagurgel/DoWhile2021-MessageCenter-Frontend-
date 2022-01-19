/*
    contexts do React é um provedor de informações para todo o restante do sistema.
    o que acontece é que eu gero (aqui por exemplo) informações que são buscadas em 
    lugares diferentes (por exemplo em DB ou em outros sites, se está logado ou não,
    informações do usuário, etc.) e todas essas informações estarão disponíveis no
    restante do sistema via authProvider.children (nesse caso é authProvider)

    Importante lembrar que o <App/> do main.tsx vai ter que estar dentro de 
    <authProvider> <App/> <authProvider />, para ai sim, as informações de
    authProvider estarem disponíveis para <App> 

*/

import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}
type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;

}
export const AuthContext = createContext({} as AuthContextData)
type AuthProvider = {
  children: ReactNode;  // é toda a informação que o authProvider vai distribuir (authProvider.children)
}
type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
  }

}



export function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<User | null>(null)

  //**********************
  //* */
  //* */ Começar a mudar o oAuth para um modulo
  //* */
  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=631487224dac51632518`

  async function signIn(gitHubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: gitHubCode,
      platform: 'web',
    })
    const { token, user } = response.data;
    localStorage.setItem('@dowhile:token', token)

    api.defaults.headers.common.authorization = `Bearer ${token}`

    setUser(user)
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem('@dowhile:token')
  }
  // Verifica se o usuário já está logado e retorna a sessão
  // via token, na rota /profile
  //
  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token')
    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`
      api.get<User>('profile').then(response => {
        setUser(response.data)
      })
    }

  }, []) // esse [] é o tempo de atualização, se não tiver [] ele fica atualizando sem parar se tiver o [] ele atualiza só quando os dados forem alterados.

  // retorna as informações do usuário
  //
  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=')

    if (hasGithubCode) {
      // vou dar um split code=f9554ce5f826b0e8564e no =
      const [urlWithoutCode, githubCode] = url.split("?code=")
      window.history.pushState({}, '', urlWithoutCode)

      signIn(githubCode)
    }
  }, []
  )

  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {props.children}

    </AuthContext.Provider>
  )
}