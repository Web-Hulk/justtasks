import { Layout } from '@/components/Layout/Layout';
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
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      // Public routes
      { index: true, Component: Landing },
      {
        path: '/login',
        Component: Login
      },
      {
        path: '/registration',
        Component: Registration
      },
      {
        path: '/forgot-password',
        Component: ForgotPassword
      },
      {
        path: '/reset-password',
        Component: ResetPassword
      },
      {
        path: '/verify-email',
        Component: VerifyEmail
      },
      { path: '/faq', Component: Settings },

      // Private routes
      {
        Component: Layout,
        children: [
          {
            path: '/dashboard',
            Component: Dashboard
          },
          {
            path: '/calendar',
            Component: Calendar
          },
          {
            path: '/workspaces',
            Component: Workspaces
          },
          {
            path: '/projects/:id',
            Component: Project
          },
          {
            path: '/reports',
            Component: Reports
          },
          {
            path: '/insights',
            Component: Insights
          },
          {
            path: '/teams',
            Component: Teams
          },
          {
            path: '/settings',
            Component: Settings
          },
          {
            path: '/billing',
            Component: Billing
          }
        ]
      }
    ]
  }
]);
