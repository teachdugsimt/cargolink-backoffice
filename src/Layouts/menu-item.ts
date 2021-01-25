import { MenuItemType } from '../Layouts/Sidebar/types';

const items: MenuItemType[] = [
  {
    title_th: 'แดชบอร์ด',
    title_en: 'Dashboard',
    icon: { name: 'home' },
    link: { to: '/dashboard' },
  },
  {
    title_th: 'ผู้จัดส่ง',
    title_en: 'Shipper',
    icon: { name: 'archive' },
    expanded: true,
    children: [
      { title_th: 'บัญชีผู้จัดส่ง', title_en: 'Shipper account', link: { to: '/shipper-account' } },
      { title_th: 'งาน', title_en: 'Jobs', link: { to: '/jobs' } },
    ],
  },
  {
    title_th: 'ผู้ให้บริการ',
    title_en: 'Carrier',
    icon: { name: 'car' },
    expanded: true,
    children: [
      { title_th: 'บัญชีผู้ให้บริการ', title_en: 'Carrier account', link: { to: '/carrier-account' } },
      { title_th: 'รถบรรทุก', title_en: 'Trucks', link: { to: '/trucks' } },
      { title_th: 'ไดรเวอร์', title_en: 'Drivers', link: { to: '/drivers' } },
    ],
  },
  {
    title_th: 'การจัดการผู้ใช้',
    title_en: 'User Management',
    icon: { name: 'people' },
    link: { to: '/user-management' },
  },
  {
    title_th: 'สถานะงาน',
    title_en: 'Job Status',
    icon: { name: 'briefcase' },
    link: { to: '/user-management' },
  },
];

export default items;
