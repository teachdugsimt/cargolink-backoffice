import { MenuItemType } from '../Layouts/Sidebar/types';

// menuHome: require('../../images/icons/pie-chart.png'),
// menuTransport: require('../../images/icons/check-list.png'),
// menuTruck: require('../../images/icons/delivery.png'),
// menuJob: require('../../images/icons/warehouse.png'),
// menuUser: require('../../images/icons/delivery-man.png'),
// menuSetting: require('../../images/icons/settings.png'),

const items: MenuItemType[] = [
  {
    title_th: 'ภาพรวม',
    title_en: 'Dashboard',
    icon: 'pie-chart',
    link: { to: '/dashboard' },
  },
  {
    title_th: 'การขนส่ง',
    title_en: 'Transportation',
    icon: 'check-list',
    link: { to: '/trips' },
  },
  {
    title_th: 'จัดการรถ',
    title_en: 'Trucks',
    icon: 'delivery',
    expanded: true,
    link: { to: '/vehicles' }
    // children: [
    //   // { title_th: 'บัญชีผู้ให้บริการขนส่ง', title_en: 'Carrier account', link: { to: '/carrier-account' } },
    //   { title_th: 'รถบรรทุก', title_en: 'Trucks', link: { to: '/vehicles' } },
    //   { title_th: 'คนขับรถ', title_en: 'Drivers', link: { to: '/drivers' } },
    // ],
  },
  {
    title_th: 'จัดการงาน',
    title_en: 'Jobs',
    icon: 'warehouse',
    link: { to: '/jobs' },
  },
  {
    title_th: 'ผู้ใช้งาน',
    title_en: 'Users',
    icon: 'delivery-man',
    link: { to: '/users' },
  },
  {
    title_th: 'ตั้งค่า',
    title_en: 'Settings',
    icon: 'settings',
    link: { to: '/settings' },
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
