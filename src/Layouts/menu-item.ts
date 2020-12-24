import { MenuItemType } from '@paljs/ui/types';

const items: MenuItemType[] = [
  {
    title: 'Dashboard',
    icon: { name: 'home' },
    link: { to: '/dashboard' },
  },
  // {
  //   title: 'FEATURES',
  //   group: true,
  // },
  {
    title: 'Shipper',
    icon: { name: 'archive' },
    children: [
      { title: 'Shipper account', link: { to: '/shipper-account' } },
      { title: 'Jobs', link: { to: '/jobs' } },
    ],
  },
  {
    title: 'Carrier',
    icon: { name: 'car' },
    children: [
      { title: 'Carrier account', link: { to: '/carrier-account' } },
      { title: 'Trucks', link: { to: '/trucks' } },
      { title: 'Drivers', link: { to: '/drivers' } },
    ],
  },
  {
    title: 'User Management',
    icon: { name: 'people' },
    link: { to: '/user-management' },
  },
];

export default items;
