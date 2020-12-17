import { MenuItemType } from '@paljs/ui/types';

const items: MenuItemType[] = [
  {
    title: 'Dashboard',
    icon: { name: 'home' },
    link: { to: '/Dashboard' },
  },
  // {
  //   title: 'FEATURES',
  //   group: true,
  // },
  {
    title: 'Shipper',
    icon: { name: 'archive' },
    children: [
      { title: 'Shipper account', link: { to: '/ShipperAccount' } },
      { title: 'Jobs', link: { to: '/Jobs' } },
    ],
  },
  {
    title: 'Carrier',
    icon: { name: 'car' },
    children: [
      { title: 'Carrier account', link: { to: '/CarrierAccount' } },
      { title: 'Trucks', link: { to: '/Trucks' } },
      { title: 'Drivers', link: { to: '/Drivers' } },
    ],
  },
  {
    title: 'User Management',
    icon: { name: 'people' },
    link: { to: '/UserManagement' },
  },
];

export default items;
