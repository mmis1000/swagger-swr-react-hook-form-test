/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Api } from './api'
import useSWR, { SWRResponse } from 'swr'
import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite'
import { ReactNode, createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AxiosResponse } from 'axios'

const createApis = () => {
  // trim common prefix
  const baseURL = import.meta.env.VITE_API_BASE ?? '/'

  const client = new Api({
    baseURL,
  })

  const clientApis = {
    ...client.post,
    ...client.login
  }

  type clientApisType = typeof clientApis
  const names = Object.keys(clientApis) as unknown as keyof clientApisType

  type ToSWRHook<Fn extends (...args: any[]) => Promise<any>> = (
    ...args: Parameters<Fn>
  ) => SWRResponse<ToData<Awaited<ReturnType<Fn>>>>

  type RemoveCurrent<T> = T extends {} ? Omit<T, 'current'> : T

  type ToSWRInfiniteHook<Fn extends (...args: any[]) => Promise<any>> = Fn extends (
    arg0: infer Arg0 extends { current: number },
    ...args: infer Args extends any[]
  ) => Promise<any>
    ? (arg0: RemoveCurrent<Arg0>, ...args: Args) => SWRInfiniteResponse<ToData<Awaited<ReturnType<Fn>>>>
    : never

  type SWR_Raws = {
    [Name in keyof clientApisType as `use_${Name}`]: ToSWRHook<clientApisType[Name]>
  } & {
    [Name in keyof clientApisType as `useInfinite_${Name}`]: ToSWRInfiniteHook<clientApisType[Name]>
  } & clientApisType

  type Remain = {
    [K in keyof SWR_Raws]: [SWR_Raws[K]] extends [never] ? never : K
  }[keyof SWR_Raws]

  type SWRs = {
    [key in Remain]: SWR_Raws[key]
  }

  type ToData<T> = T extends AxiosResponse<infer U> ? U : T

  const apis: SWRs = {} as unknown as SWRs

  for (const name of names) {
    const fetcher = (key: string) => {
      const [name, args] = JSON.parse(key)
      // @ts-expect-error 7053
      return clientApis[name](...args).then((res: AxiosResponse<any, any>) => res.data)
    }
    // @ts-expect-error 7053
    apis['use_' + name] = (...args: any[]) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useSWR(JSON.stringify([name, args]), fetcher)
    }
    const infiniteFetcher = (key: string) => {
      const [name, args, current] = JSON.parse(key)
      const query = { ...(args[0] ?? {}), current: current + 1 }
      // @ts-expect-error 7053
      return clientApis[name](query, args.slice(1)).then((res: AxiosResponse<any, any>) => res.data)
    }
    // @ts-expect-error 7053
    apis['useInfinite_' + name] = (...args: any[]) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const keyFn = useCallback(
        (pageIndex: number, previousPageData: any) => {
          if (previousPageData && !previousPageData.data.length) return null // reached the end
          return JSON.stringify([name, args, pageIndex])
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(args)]
      )
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const options = useMemo(() => ({ revalidateFirstPage: false }), [])

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const swrRes = useSWRInfinite(keyFn, infiniteFetcher, options)
      const hasMore = swrRes.data && swrRes.data[0] && swrRes.data[swrRes.data.length - 1].data.length !== 0

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const lastSetSize = useRef<number>()
      const originalSetSize = swrRes.setSize
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const wrappedSetSize = useCallback(
        (newSize: number) => {
          if (newSize !== lastSetSize.current) {
            console.log('new size', newSize)
            originalSetSize(newSize)
            lastSetSize.current = newSize
          }
        },
        [originalSetSize]
      )

      return {
        ...swrRes,
        setSize: wrappedSetSize,
        hasMore,
      }
    }
    // @ts-expect-error 7053
    apis[name] = clientApis[name]
  }

  return {
    instance: client.instance,
    apis,
  }
}

const tokenContext = createContext({
  token: null as null | string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setToken: (_arg: string | null) => {}
})

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<null | string>(null)
  const data = useMemo(() => ({
    token,
     setToken
  }), [token])
  return <tokenContext.Provider value={data}>{children}</tokenContext.Provider>
}

export const useCurrentToken = () => {
  const ctx = useContext(tokenContext)
  return [ctx.token, ctx.setToken] as const
}

export const apis = createApis()
