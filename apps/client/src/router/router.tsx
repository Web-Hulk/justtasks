import { Registration } from '@/components/Registration/Registration';
import { Login } from '@/pages/Login/Login';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/registration',
    element: <Registration />
  }
]);
