import React from 'react';
import moment from 'moment';
import 'moment/locale/th';
moment.locale('th');

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: 'id',
        content: 'ID',
        isSortable: true,
        // width: withWidth ? 5 : undefined,
      },
      {
        key: 'name',
        content: 'Truck brand name',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 5 : undefined,
      },
      {
        key: 'working_zones',
        content: 'Working Zones',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'plate_number',
        content: 'Truck plate number',
        shouldTruncate: true,
        isSortable: true,
        // width: withWidth ? 15 : undefined,
      },
      {
        key: 'type',
        content: 'Truck type',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 15 : undefined,
      },
      {
        key: 'weigth',
        content: 'Weigth capacity',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'carrier_name',
        content: 'Status',
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: 'register_date',
        content: 'Register Date',
        shouldTruncate: true,
        isSortable: true,
      },
    ],
  };
};

export const head = createHead(true);

export const regionOptions: { value: any; label: string }[] = [
  { value: 1, label: 'ภาคเหนือ' },
  { value: 2, label: 'ภาคกลาง' },
  { value: 3, label: 'ภาคตะวันออกเฉียงเหนือ' },
  { value: 4, label: 'ภาคตะวันตก' },
  { value: 5, label: 'ภาคตะวันออก' },
  { value: 6, label: 'ภาคใต้' },
];

export const stallHeightOption: { value: string; label: string }[] = [
  { value: 'LOW', label: 'LOW' },
  { value: 'MEDIUM', label: 'MEDIUM' },
  { value: 'HIGH', label: 'HIGH' },
];

export const provinceOptions: { value: any; label: string; area: number }[] = [
  { value: 1, label: 'กรุงเทพมหานคร', area: 2 },
  { value: 2, label: 'สมุทรปราการ', area: 2 },
  { value: 3, label: 'นนทบุรี', area: 2 },
  { value: 4, label: 'ปทุมธานี', area: 2 },
  { value: 5, label: 'พระนครศรีอยุธยา', area: 2 },
  { value: 6, label: 'อ่างทอง', area: 2 },
  { value: 7, label: 'ลพบุรี', area: 2 },
  { value: 8, label: 'สิงห์บุรี', area: 2 },
  { value: 9, label: 'ชัยนาท', area: 2 },
  { value: 10, label: 'สระบุรี', area: 2 },
  { value: 11, label: 'ชลบุรี', area: 5 },
  { value: 12, label: 'ระยอง', area: 5 },
  { value: 13, label: 'จันทบุรี', area: 5 },
  { value: 14, label: 'ตราด', area: 5 },
  { value: 15, label: 'ฉะเชิงเทรา', area: 5 },
  { value: 16, label: 'ปราจีนบุรี', area: 5 },
  { value: 17, label: 'นครนายก', area: 2 },
  { value: 18, label: 'สระแก้ว', area: 5 },
  { value: 19, label: 'นครราชสีมา', area: 3 },
  { value: 20, label: 'บุรีรัมย์', area: 3 },
  { value: 21, label: 'สุรินทร์', area: 3 },
  { value: 22, label: 'ศรีสะเกษ', area: 3 },
  { value: 23, label: 'อุบลราชธานี', area: 3 },
  { value: 24, label: 'ยโสธร', area: 3 },
  { value: 25, label: 'ชัยภูมิ', area: 3 },
  { value: 26, label: 'อำนาจเจริญ', area: 3 },
  { value: 27, label: 'หนองบัวลำภู', area: 3 },
  { value: 28, label: 'ขอนแก่น', area: 3 },
  { value: 29, label: 'อุดรธานี', area: 3 },
  { value: 30, label: 'เลย', area: 3 },
  { value: 31, label: 'หนองคาย', area: 3 },
  { value: 32, label: 'มหาสารคาม', area: 3 },
  { value: 33, label: 'ร้อยเอ็ด', area: 3 },
  { value: 34, label: 'กาฬสินธุ์', area: 3 },
  { value: 35, label: 'สกลนคร', area: 3 },
  { value: 36, label: 'นครพนม', area: 3 },
  { value: 37, label: 'มุกดาหาร', area: 3 },
  { value: 38, label: 'เชียงใหม่', area: 1 },
  { value: 39, label: 'ลำพูน', area: 1 },
  { value: 40, label: 'ลำปาง', area: 1 },
  { value: 41, label: 'อุตรดิตถ์', area: 1 },
  { value: 42, label: 'แพร่', area: 1 },
  { value: 43, label: 'น่าน', area: 1 },
  { value: 44, label: 'พะเยา', area: 1 },
  { value: 45, label: 'เชียงราย', area: 1 },
  { value: 46, label: 'แม่ฮ่องสอน', area: 1 },
  { value: 47, label: 'นครสวรรค์', area: 2 },
  { value: 48, label: 'อุทัยธานี', area: 2 },
  { value: 49, label: 'กำแพงเพชร', area: 2 },
  { value: 50, label: 'ตาก', area: 4 },
  { value: 51, label: 'สุโขทัย', area: 2 },
  { value: 52, label: 'พิษณุโลก', area: 2 },
  { value: 53, label: 'พิจิตร', area: 2 },
  { value: 54, label: 'เพชรบูรณ์', area: 2 },
  { value: 55, label: 'ราชบุรี', area: 4 },
  { value: 56, label: 'กาญจนบุรี', area: 4 },
  { value: 57, label: 'สุพรรณบุรี', area: 2 },
  { value: 58, label: 'นครปฐม', area: 2 },
  { value: 59, label: 'สมุทรสาคร', area: 2 },
  { value: 60, label: 'สมุทรสงคราม', area: 2 },
  { value: 61, label: 'เพชรบุรี', area: 4 },
  { value: 62, label: 'ประจวบคีรีขันธ์', area: 4 },
  { value: 63, label: 'นครศรีธรรมราช', area: 6 },
  { value: 64, label: 'กระบี่', area: 6 },
  { value: 65, label: 'พังงา', area: 6 },
  { value: 66, label: 'ภูเก็ต', area: 6 },
  { value: 67, label: 'สุราษฎร์ธานี', area: 6 },
  { value: 68, label: 'ระนอง', area: 6 },
  { value: 69, label: 'ชุมพร', area: 6 },
  { value: 70, label: 'สงขลา', area: 6 },
  { value: 71, label: 'สตูล', area: 6 },
  { value: 72, label: 'ตรัง', area: 6 },
  { value: 73, label: 'พัทลุง', area: 6 },
  { value: 74, label: 'ปัตตานี', area: 6 },
  { value: 75, label: 'ยะลา', area: 6 },
  { value: 76, label: 'นราธิวาส', area: 6 },
  { value: 77, label: 'บึงกาฬ', area: 3 },
];
