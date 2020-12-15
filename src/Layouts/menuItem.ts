import { MenuItemType } from '@paljs/ui/types';

const items: MenuItemType[] = [
  {
    title: 'Home Page',
    icon: { name: 'home' },
    link: { to: '/dashboard' },
  },
  // {
  //   title: 'FEATURES',
  //   group: true,
  // },
  {
    title: 'Shipper',
    children: [{ title: 'Jobs', link: { to: '/Jobs' } }],
  },
  {
    title: 'Carrier',
    children: [
      { title: 'Trucks', link: { to: '/Trucks' } },
      { title: 'Drivers', link: { to: '/Drivers' } },
    ],
  },
  {
    title: 'User Management',
    link: { to: '/UserManagement' },
  },
];

export default items;
