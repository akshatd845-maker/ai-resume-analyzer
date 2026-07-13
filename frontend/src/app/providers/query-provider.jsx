import { QueryClientProvider } from '@tanstack/react-query'

export function QueryProvider({ client, children }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
