const maleAgeData: [
  {
    state: string;
    Western: number;
    Central: number;
    Eastern: number;
    North: number;
    South: number;
    Northeast: number;
  },
] = [
  {
    state: '4 Wheels',
    Western: 6.7,
    Central: 28.6,
    Eastern: 5.1,
    North: 6.7,
    South: 28.6,
    Northeast: 5.1,
  },
  {
    state: '6 wheels',
    Western: 6.7,
    Central: 28.6,
    Eastern: 5.1,
    North: 6.7,
    South: 28.6,
    Northeast: 5.1,
  },
  {
    state: '10 Wheels',
    Western: 6.7,
    Central: 28.6,
    Eastern: 5.1,
    North: 26.7,
    South: 28.6,
    Northeast: 5.1,
  },
  {
    state: '18 Wheels',
    Western: 6.7,
    Central: 28.6,
    Eastern: 5.1,
    North: 46.7,
    South: 28.6,
    Northeast: 5.1,
  },
  {
    state: 'Semi',
    Western: 6.7,
    Central: 28.6,
    Eastern: 45.1,
    North: 6.7,
    South: 28.6,
    Northeast: 25.1,
  },
  {
    state: '40” Trailer',
    Western: 6.7,
    Central: 28.6,
    Eastern: 5.1,
    North: 16.7,
    South: 28.6,
    Northeast: 5.1,
  },
  {
    state: '20” Trailer',
    Western: 6.7,
    Central: 28.6,
    Eastern: 15.1,
    North: 6.7,
    South: 8.6,
    Northeast: 5.1,
  },
  {
    state: '20 wheels',
    Western: 6.7,
    Central: 28.6,
    Eastern: 5.1,
    North: 6.7,
    South: 2.6,
    Northeast: 5.1,
  },
  {
    state: 'Tractor Head Truck',
    Western: 6.7,
    Central: 38.6,
    Eastern: 5.1,
    North: 6.7,
    South: 27.6,
    Northeast: 5.1,
  },
  {
    state: 'Bike Carrier Truck',
    Western: 4.7,
    Central: 8.6,
    Eastern: 5.1,
    North: 6.7,
    South: 5.6,
    Northeast: 5.1,
  },
];

export default {
  getMaleAgeData() {
    return maleAgeData;
  },
};
