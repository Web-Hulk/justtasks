import { SideBar } from '@/components/SideBar/SideBar';
import { TopBar } from '@/components/TopBar/TopBar';
import { Outlet } from 'react-router';

export const Layout = () => {
  return (
    <div>
      <TopBar />
      <SideBar />

      <Outlet />
    </div>
  );
};
