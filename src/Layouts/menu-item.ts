import { MenuItemType } from '../Layouts/Sidebar/types';

const items: MenuItemType[] = [
  {
    title_th: 'ภาพรวม',
    title_en: 'Dashboard',
    icon: 'home',
    link: { to: '/dashboard' },
  },
  {
    title_th: 'การขนส่ง',
    title_en: 'Transportation',
    icon: 'briefcase',
    link: { to: '/job-status' },
  },
  {
    title_th: 'จัดการรถ',
    title_en: 'Trucks',
    icon: 'truck',
    expanded: true,
    children: [
      // { title_th: 'บัญชีผู้ให้บริการขนส่ง', title_en: 'Carrier account', link: { to: '/carrier-account' } },
      { title_th: 'รถบรรทุก', title_en: 'Trucks', link: { to: '/trucks' } },
      { title_th: 'คนขับรถ', title_en: 'Drivers', link: { to: '/drivers' } },
    ],
  },
  {
    title_th: 'จัดการงาน',
    title_en: 'Jobs',
    icon: 'archive',
    link: { to: '/jobs' },
  },
  {
    title_th: 'ผู้ใช้งาน',
    title_en: 'Users',
    icon: 'user',
    link: { to: '/user-management' },
  },
  {
    title_th: 'ตั้งค่า',
    title_en: 'Settings',
    icon: 'cog',
    link: { to: '#' },
  },
  // {
  //   title_th: 'ผู้จัดส่ง',
  //   title_en: 'Shipper',
  //   icon: 'archive',
  //   expanded: true,
  //   children: [
  //     { title_th: 'บัญชีผู้จัดส่ง', title_en: 'Shipper account', link: { to: '/shipper-account' } },
  //     { title_th: 'งาน', title_en: 'Jobs', link: { to: '/jobs' } },
  //   ],
  // },
];

export default items;
