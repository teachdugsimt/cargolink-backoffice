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
    icon: {name: 'archive'},
    children: [{ title: 'Jobs', link: { to: '/Jobs' } }],
  },
  {
    title: 'Carrier',
    icon: {name: 'car'},
    children: [
      { title: 'Trucks', link: { to: '/Trucks' } },
      { title: 'Drivers', link: { to: '/Drivers' } },
    ],
  },
  {
    title: 'User Management',
    icon: {name: 'people'},
    link: { to: '/UserManagement' },
  },
];

export default items;
