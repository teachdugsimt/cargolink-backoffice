const priceCalculator = (truckType: number, distance: number) => {
  let p = 0

  switch (truckType) {
    case 3: // 4 ล้อคอก
    case 4: // 4 ล้อตู้ทึบ
      p = 500
      if (distance >= 3) {
        p = p
          + Math.ceil((distance - 2) / 5) * 50
          + Math.ceil(distance / 280) * 150
      }
      break;

    case 5: // 4 ล้อห้องเย็น
      p = 1200
      if (distance >= 23) {
        p = p
          + Math.ceil((distance - 22) / 5) * 80
          + Math.ceil(distance / 280) * 160
      }
      break;

    case 9: // 6 ล้อคอก
      p = 2800
      if (distance >= 8) {
        p = p
          + Math.ceil((distance - 7) / 10) * 100
          + Math.ceil(distance / 240) * 200
      }
      break;

    case 10: // 6 ล้อตู้ทึบ
      p = 3000
      if (distance >= 22) {
        p = p
          + Math.ceil((distance - 21) / 8) * 100
          + Math.ceil(distance / 240) * 200
      }
      break;

    case 11: // 6 ล้อห้องเย็น
      p = 4850
      if (distance >= 20) {
        p = p
          + Math.ceil((distance - 19) / 5) * 150
          + Math.ceil(distance / 60) * 250
          + Math.ceil(distance / 240) * 300
      }
      break;

    case 15: // 10 ล้อคอก
    case 16: // 10 ล้อตู้ทึบ
      p = 3800
      if (distance >= 5) {
        p = p
          + Math.ceil((distance - 4) / 9) * 100
          + Math.ceil(distance / 240) * 200
      }
      break;

    case 17: // 10 ล้อห้องเย็น
      p = 5900
      if (distance >= 5) {
        p = p
          + Math.ceil((distance - 4) / 6) * 150
          + Math.ceil(distance / 60) * 200
          + Math.ceil(distance / 240) * 300
          + Math.ceil(distance / 960) * 450
      }
      break;

    case 22: // เทรลเลอร์ พื้นเรียบ
    case 23: // เทรลเลอร์ คอก
      p = 4400
      p = p
        + Math.ceil(distance / 6) * 100
        + Math.ceil(distance / 240) * 300
      break;

    case 24: // 10 ล้อพ่วง คอก
      p = 4800
      p = p
        + Math.floor(distance / 5) * 100
        + Math.floor(distance / 240) * 300
      break;

    case 25: // 10 ล้อพว่ง ตู้ทึบ
      p = 5300
      p = p
        + Math.floor(distance / 5) * 100
        + Math.floor(distance / 240) * 300
      break;

    case 31: // เทรลเลอร์ ตู้ทึบ (cgl ไม่มี), หัวลากตู้ทึบ
      p = 4900
      p = p
        + Math.ceil(distance / 5) * 100
        + Math.ceil(distance / 240) * 300
      break;

    default:
      break;
  }

  return p
}

export default priceCalculator
