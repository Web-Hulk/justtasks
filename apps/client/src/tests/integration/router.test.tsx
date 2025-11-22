import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router';
import { describe, expect, it } from 'vitest';

import { Billing } from '@/pages/Billing/Billing';
import { Calendar } from '@/pages/Calendar/Calendar';
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import { ForgotPassword } from '@/pages/ForgotPassword/ForgotPassword';
import { Insights } from '@/pages/Insights/Insights';
import { Landing } from '@/pages/Landing/Landing';
import { Login } from '@/pages/Login/Login';
import { Project } from '@/pages/Project/Project';
import { Registration } from '@/pages/Registration/Registration';
import { Reports } from '@/pages/Reports/Reports';
import { ResetPassword } from '@/pages/ResetPassword/ResetPassword';
import { Settings } from '@/pages/Settings/Settings';
import { Teams } from '@/pages/Teams/Teams';
import { VerifyEmail } from '@/pages/VerifyEmail/VerifyEmail';
import { Workspaces } from '@/pages/Workspaces/Workspaces';

const queryClient = new QueryClient();

const renderRoute = (routePath: string, routes: RouteObject[]) => {
  const router = createMemoryRouter(routes, { initialEntries: [routePath] });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

// --- IDEAS FOR LATER ---
// 1. Split into multiple files: router.public.test.tsx & router.private.test.tsx
// 2. Add edge case coverage: redirects, 404s, dynamic params
// 3. Test accessibility: getByRole/getByLabelText for user-facing elements
// 4. Centralize route definitions: import actual app routes if possible
// 5. Extract renderRoute to a shared test utility if reused
// 6. Add coverage for auth guards (redirects for unauthenticated users)
// 7. Consider parametrizing testId in routeTestCases for more flexibility
const routeTestCases = [
  { path: '/', component: Landing, isPublic: true },
  { path: '/login', component: Login, isPublic: true },
  { path: '/registration', component: Registration, isPublic: true },
  { path: '/forgot-password', component: ForgotPassword, isPublic: true },
  { path: '/reset-password', component: ResetPassword, isPublic: true },
  { path: '/verify-email', component: VerifyEmail, isPublic: true },
  { path: '/dashboard', component: Dashboard, isPublic: false },
  { path: '/calendar', component: Calendar, isPublic: false },
  { path: '/workspaces', component: Workspaces, isPublic: false },
  { path: '/projects/:id', component: Project, isPublic: false },
  { path: '/reports', component: Reports, isPublic: false },
  { path: '/insights', component: Insights, isPublic: false },
  { path: '/teams', component: Teams, isPublic: false },
  { path: '/settings', component: Settings, isPublic: false },
  { path: '/billing', component: Billing, isPublic: false }
];

const routes: RouteObject[] = routeTestCases.map(({ path, component }) => ({
  path,
  Component: component
}));

const getTestPath = (path: string) => (path.includes(':id') ? '/projects/123' : path);

const getTestId = (path: string) => {
  if (path === '/') return 'landing';
  if (path.includes(':id')) return 'project';
  return path.replace('/', '');
};

describe('Router', () => {
  describe('Public Routes', () => {
    it.each(routeTestCases.filter(({ isPublic }) => isPublic))(
      'Route $path should render $component.name',
      async ({ path }) => {
        renderRoute(getTestPath(path), routes);
        expect(await screen.findByTestId(getTestId(path))).toBeInTheDocument();
      }
    );
  });

  describe('Private Routes', () => {
    it.each(routeTestCases.filter(({ isPublic }) => !isPublic))(
      'Route $path should render $component.name',
      async ({ path }) => {
        renderRoute(getTestPath(path), routes);
        expect(await screen.findByTestId(getTestId(path))).toBeInTheDocument();
      }
    );
  });
});
