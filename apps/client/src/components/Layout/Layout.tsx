import { Outlet } from 'react-router';
import { SideBar } from '../SideBar/SideBar';
import { TopBar } from '../TopBar/TopBar';

export const Layout = () => {
  return (
    <div>
      <TopBar />
      <SideBar />

      <Outlet />
    </div>
  );
};
