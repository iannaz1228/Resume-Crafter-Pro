import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { useEffect } from "react";

import { useThemeStore } from "@/store/theme-store";
import { Toaster } from "@/components/ui/sonner";
import { usePersistHydration } from "@/hooks/use-persist-hydration";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-display font-bold text-gradient">404</h1>
        <p className="mt-4 text-muted-foreground">That page drifted off the resume.</p>
        <a href="/" className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-primary-foreground">
          Back home
        </a>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
});

function ThemeApplier() {
  const hydrated = usePersistHydration(useThemeStore);
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [hydrated, theme]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeApplier />
      <Outlet />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
