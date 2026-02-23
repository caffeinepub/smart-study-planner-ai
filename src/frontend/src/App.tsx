import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import StudyPlanForm from './pages/StudyPlanForm';
import ProgressTracker from './pages/ProgressTracker';
import MotivationalQuotes from './pages/MotivationalQuotes';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const createPlanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-plan',
  component: StudyPlanForm,
});

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/progress',
  component: ProgressTracker,
});

const motivationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/motivation',
  component: MotivationalQuotes,
});

const routeTree = rootRoute.addChildren([indexRoute, createPlanRoute, progressRoute, motivationRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
