import { Login } from '@/pages/Login/Login';
import { Registration } from '@/pages/Registration/Registration';
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
