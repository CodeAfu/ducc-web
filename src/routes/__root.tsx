/// <reference types="vite/client" />
import {
  ClerkProvider,
  SignIn,
  SignOutButton,
} from '@clerk/tanstack-react-start'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import * as React from 'react'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary.js'
import { NotFound } from '~/components/NotFound.js'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import appCss from '~/styles/app.css?url'
import Navbar from '~/components/Navbar'
import { dark } from "@clerk/themes"
import { Toaster } from 'react-hot-toast';

const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId, sessionClaims } = await auth()
  const email = sessionClaims?.email as string | undefined

  const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(',') ?? []
  const isAuthorized = userId ? ALLOWED_EMAILS.includes(email ?? "") : false;

  return {
    userId,
    email,
    isAuthorized,
  }
})

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  userId?: string | null;
  email?: string | null;
  isAuthorized: boolean;
}>()({
  beforeLoad: async () => {
    const { userId, email, isAuthorized } = await fetchClerkAuth()
    return {
      userId,
      email,
      isAuthorized,
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },

      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Alexandria:wght@100..900&family=Merriweather:wght@300;400;700&family=B612+Mono:wght@400;700&display=swap',
        as: 'style',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Alexandria:wght@100..900&family=Merriweather:wght@300;400;700&family=B612+Mono:wght@400;700&display=swap',
      },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  const { userId, isAuthorized, queryClient } = Route.useRouteContext()
  const currentPath = useRouterState({ select: (s) => s.location.pathname })
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider appearance={{ baseTheme: dark }}>
        <RootDocument>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: 'oklch(0.1787 0.0804 279.8522)',
                color: 'oklch(0.9491 0 0)',
                border: '1px solid oklch(0.2502 0.0303 281.1985)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
              },
              success: {
                iconTheme: {
                  primary: 'oklch(0.6673 0.1682 154.0104)',
                  secondary: 'oklch(0.1787 0.0804 279.8522)',
                },
              },
              error: {
                iconTheme: {
                  primary: 'oklch(0.5037 0.1708 22.2389)',
                  secondary: 'oklch(0.1787 0.0804 279.8522)',
                },
              },
            }}
          />
          {!userId ? (
            <div className="flex items-center justify-center w-full min-h-[50vh] p-8">
              <SignIn routing="hash" forceRedirectUrl={currentPath} />
            </div>
          ) :
            !isAuthorized ? (
              <div className="flex flex-col items-center justify-center w-full min-h-[50vh] gap-4 p-8 text-center">
                <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
                <p className="text-muted-foreground">You are not authorized to view this content</p>
                <SignOutButton>
                  <button className="px-4 py-2 mt-2 font-medium transition-colors rounded-md bg-primary text-primary-foreground hover:bg-primary/80">
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            ) : (
              <Outlet />
            )}
        </RootDocument>
      </ClerkProvider>
    </QueryClientProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="grid grid-rows-[auto_1fr] min-h-screen">
        <Navbar />
        <main className="flex flex-col">
          {children}
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </main>
      </body>
    </html>
  )
}
