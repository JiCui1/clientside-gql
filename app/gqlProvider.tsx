'user client' //this mean use only react and no Next.js stuff
//The purpose of having a provider is to cache otherwise it can be done with just fetch/axios
import { useMemo } from 'react'
import { UrqlProvider, ssrExchange, fetchExchange, createClient, gql } from '@urql/next'
import { cacheExchange } from '@urql/next' //kinda like redux for react

import { url } from '@/utils/url'
import { getToken } from '@/utils/token'

//create GQL provider
const GQLProvider = ({ children }) => {
  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({
      isClient: typeof window !== 'undefined',
    })
    
    const client = createClient({
      url,
      exchanges: [cacheExchange({}), ssr, fetchExchange],
      fetchOptions: () => {
        const token = getToken()
        return token ? {headers: {authorization: `Bearer ${token}`}} : {}
      }
    })

    return [client, ssr]

    }, [])

  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  )
}

export default GQLProvider

