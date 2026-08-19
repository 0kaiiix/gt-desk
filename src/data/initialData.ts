import { Pedestal, ZoneInfo } from '../types';

export const ZONES: ZoneInfo[] = [
  {
    id: 'A區',
    name: 'A 區 (抽屜櫃放置區 A)',
    description: '11 個縱向直排：第 1 排 7 格，第 2~11 排每排 6 格 (共 67 格，對應 GT 系列新抽屜代號)',
    color: 'blue',
    totalColumns: 11,
    columnSlots: [7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    totalSlots: 67,
  },
  {
    id: 'B區',
    name: 'B 區 (抽屜櫃放置區 B)',
    description: '14 個縱向直排：每排 6 格 (共 84 格，對應 GT 系列新抽屜代號)',
    color: 'emerald',
    totalColumns: 14,
    columnSlots: Array(14).fill(6),
    totalSlots: 84,
  },
  {
    id: 'C區',
    name: 'C 區 (抽屜櫃放置區 C)',
    description: '8 個縱向直排：每排 6 格 (共 48 格，對應 GT 系列新抽屜代號)',
    color: 'purple',
    totalColumns: 8,
    columnSlots: Array(8).fill(6),
    totalSlots: 48,
  },
];

// A 區 67 格目前客戶編號位置 (依據現場 11 排直排對照表)
const A_ZONE_CUSTOMER_IDS: string[][] = [
  // 第 1 排 (7 格)
  ['GT1181', 'GT1181', 'GT1216', 'GT1216', 'GT6211', 'GT1236', 'GT1251'],
  // 第 2 排 (6 格)
  ['GT6583', 'GT1282', 'GT1312', 'GT1359', 'GT1706', 'GT1706'],
  // 第 3 排 (6 格)
  ['GT1359', 'GT6014', 'GT6737', 'GT1684', 'GT1414', 'GT12405'],
  // 第 4 排 (6 格)
  ['GT1386-1', 'GT5988', 'GT5368', 'GT12236', 'GT1418', 'GT12486'],
  // 第 5 排 (6 格)
  ['GT5987', 'GT5988', 'GT5368', 'GT12236', 'GT1631', 'GT7004'],
  // 第 6 排 (6 格)
  ['GT12251', 'GT1390', 'GT11102', 'GT12515', 'GT1599034', 'GT1599034'],
  // 第 7 排 (6 格)
  ['GT4996', 'GT1800', 'GT1636', 'GT1636', 'GT1636', 'GT12698'],
  // 第 8 排 (6 格)
  ['GT4831', 'GT1979', 'GT1957', 'GT1958', 'GT3051', 'GT4777'],
  // 第 9 排 (6 格)
  ['GT5674', 'GT1990', 'GT11195', 'GT3030', 'GT8505', 'GT3062HZ'],
  // 第 10 排 (6 格)
  ['GT11169', 'GT8946', 'GT11195', 'GT1763', 'GT1763', 'GT1801'],
  // 第 11 排 (6 格)
  ['GT5673', 'GT1456', 'GT1456', 'GT5962', 'GT1801', 'GT8884'],
];

// A 區 67 格新抽屜代號 (依據現場 11 排由左至右、每排由上至下對照表)
const A_ZONE_CODES: string[][] = [
  // 第 1 排 (7 格)
  ['GT1181', 'GT1181', 'GT1216', 'GT1216', 'GT1222', 'GT1236', 'GT1251'],
  // 第 2 排 (6 格)
  ['GT1251', 'GT1282', 'GT1301', 'GT1303', 'GT1303', 'GT1312'],
  // 第 3 排 (6 格)
  ['GT1359', 'GT1359', 'GT1359CEM', 'GT1359CPM', 'GT1359TC', 'GT1386'],
  // 第 4 排 (6 格)
  ['GT1386-1', 'GT1390', 'GT1394', 'GT1414', 'GT1418', 'GT1426'],
  // 第 5 排 (6 格)
  ['GT1456', 'GT1456', 'GT1606', 'GT1631', 'GT1636', 'GT1636'],
  // 第 6 排 (6 格)
  ['GT1636', 'GT1684', 'GT1706', 'GT1706', 'GT1739', 'GT1763'],
  // 第 7 排 (6 格)
  ['GT1763', 'GT1800', 'GT1801', 'GT1801', 'GT1813', 'GT1861'],
  // 第 8 排 (6 格)
  ['GT1864', 'GT1932', 'GT1957', 'GT1958', 'GT1959', 'GT1964'],
  // 第 9 排 (6 格)
  ['GT1979', 'GT1990', 'GT1999', 'GT2023', 'GT2057', 'GT2088'],
  // 第 10 排 (6 格)
  ['GT2212', 'GT3030', 'GT3051', 'GT3062', 'GT3062HZ', 'GT3204'],
  // 第 11 排 (6 格)
  ['GT3780', 'GT4777', 'GT4803', 'GT4831', 'GT4848', 'GT4996'],
];

// A 區 67 格新目標位置 (依據現場 11 排由左至右、每排由上至下對照表)
const A_ZONE_NEW_LOCATIONS: string[][] = [
  // 第 1 排 (7 格)
  ['A區#1-1', 'A區#1-2', 'A區#1-3', 'A區#1-4', 'B區#6-6', 'A區#1-6', 'A區#1-7'],
  // 第 2 排 (6 格)
  ['B區#8-5', 'A區#2-2', 'A區#2-6', 'A區#3-1', 'A區#6-3', 'A區#6-4'],
  // 第 3 排 (6 格)
  ['A區#3-2', 'B區#6-2', 'B區#10-3', 'A區#6-2', 'A區#4-4', 'C區#5-4'],
  // 第 4 排 (6 格)
  ['A區#4-1', 'B區#5-6', 'B區#1-4', 'C區#4-1', 'A區#4-5', 'C區#5-5'],
  // 第 5 排 (6 格)
  ['B區#5-5', 'B區#6-1', 'B區#1-5', 'C區#4-2', 'A區#5-4', 'B區#11-4'],
  // 第 6 排 (6 格)
  ['C區#4-3', 'A區#4-2', 'C區#3-2', 'C區#6-1', 'B區#7-4', 'B區#7-5'],
  // 第 7 排 (6 格)
  ['A區#11-6', 'A區#7-2', 'A區#5-5', 'A區#5-6', 'A區#6-1', 'C區#6-4'],
  // 第 8 排 (6 格)
  ['A區#11-4', 'A區#9-1', 'A區#8-3', 'A區#8-4', 'A區#10-3', 'A區#11-2'],
  // 第 9 排 (6 格)
  ['B區#4-1', 'A區#9-2', 'C區#3-5', 'A區#10-2', 'B區#13-2', 'A區#10-5'],
  // 第 10 排 (6 格)
  ['C區#3-3', 'C區#1-4', 'C區#3-6', 'A區#6-6', 'A區#7-1', 'A區#7-3'],
  // 第 11 排 (6 格)
  ['B區#3-6', 'A區#5-1', 'A區#5-2', 'B區#5-4', 'A區#7-4', 'B區#14-5'],
];

// B 區 84 格目前客戶編號位置 (依據現場 14 排由左至右、每排由上至下對照表)
const B_ZONE_CUSTOMER_IDS: string[][] = [
  // 第 1 排 (6 格)
  ['GT5315', 'GT6769', 'GT2212', 'GT6697', 'GT12822', 'GT5446'],
  // 第 2 排 (6 格)
  ['GT12288', 'GT11172', 'GT1426', 'GT8946', 'GT5525', 'GT5529'],
  // 第 3 排 (6 格)
  ['GT12518', 'GT6562', 'GT5816', 'GT6969', 'GT5449', 'GT5504'],
  // 第 4 排 (6 格)
  ['GT5960A19', 'GT5759', 'GT5759', 'GT12830', 'GT6133', 'GT5856'],
  // 第 5 排 (6 格)
  ['GT5960', 'GT5529', 'GT4803', 'GT1964', 'GT1251', 'GT9001'],
  // 第 6 排 (6 格)
  ['GT7193', 'GT6623', 'GT8906', 'GT6150', 'GT6698', 'GT12848'],
  // 第 7 排 (6 格)
  ['GT6633', 'GT1739', 'GT6233', 'GT1394', 'GT1999', 'GT11101'],
  // 第 8 排 (6 格)
  ['GT10066', 'GT3062', 'GT12284', 'GT2023', 'GT8690', 'GT12388'],
  // 第 9 排 (6 格)
  ['GT1861', 'GT6666', 'GT12760', 'GT1386', 'GT6764', 'GT8824'],
  // 第 10 排 (6 格)
  ['GT12858', 'GT1303', 'GT1303', 'GT6255', 'GT5366', 'GT5638'],
  // 第 11 排 (6 格)
  ['GT6733', 'GT1864', 'GT7000', 'GT1301', 'GT7042', 'GT3204'],
  // 第 12 排 (6 格)
  ['GT10067', 'GT7165', 'GT1959', 'GT5614', 'GT7288', 'GT8975'],
  // 第 13 排 (6 格)
  ['GT8907', 'GT5614', 'GT7094', 'GT2057', 'GT8690', 'GT1359CEM'],
  // 第 14 排 (6 格)
  ['GT8943', 'GT8993', 'GT8856', 'GT8884', 'GT1359CPM', 'GT1359TC'],
];

// B 區 84 格新目標位置 (依據現場 14 排由左至右、每排由上至下對照表)
const B_ZONE_NEW_LOCATIONS: string[][] = [
  // 第 1 排 (6 格)
  ['B區#1-1', 'B區#10-6', 'A區#10-1', 'B區#9-6', 'C區#7-6', 'B區#1-6'],
  // 第 2 排 (6 格)
  ['C區#4-5', 'C區#3-4', 'A區#4-6', 'C區#1-5', 'B區#2-4', 'B區#2-6'],
  // 第 3 排 (6 格)
  ['C區#6-2', 'B區#8-2', 'B區#4-5', 'B區#11-2', 'B區#2-2', 'B區#2-3'],
  // 第 4 排 (6 格)
  ['B區#5-2', 'B區#4-2', 'B區#4-3', 'C區#8-2', 'B區#6-3', 'B區#4-6'],
  // 第 5 排 (6 格)
  ['B區#5-1', 'B區#2-1', 'A區#11-3', 'A區#8-6', 'A區#2-1', 'C區#2-3'],
  // 第 6 排 (6 格)
  ['B區#12-4', 'B區#8-6', 'B區#14-6', 'B區#6-4', 'B區#9-4', 'C區#8-4'],
  // 第 7 排 (6 格)
  ['B區#9-1', 'A區#6-5', 'B區#7-6', 'A區#4-3', 'A區#9-3', 'C區#3-1'],
  // 第 8 排 (6 格)
  ['C區#2-5', 'A區#10-4', 'C區#4-4', 'A區#9-4', 'B區#13-5', 'C區#5-2'],
  // 第 9 排 (6 格)
  ['A區#7-6', 'B區#9-2', 'C區#7-2', 'A區#3-6', 'B區#10-5', 'B區#14-2'],
  // 第 10 排 (6 格)
  ['C區#8-5', 'A區#2-4', 'A區#2-5', 'B區#7-3', 'B區#1-3', 'B區#3-5'],
  // 第 11 排 (6 格)
  ['B區#10-2', 'A區#8-1', 'B區#11-3', 'A區#2-3', 'B區#11-5', 'A區#10-6'],
  // 第 12 排 (6 格)
  ['C區#2-6', 'B區#12-2', 'A區#8-5', 'B區#3-4', 'B區#12-5', 'C區#1-6'],
  // 第 13 排 (6 格)
  ['C區#1-1', 'B區#3-3', 'B區#11-6', 'A區#9-5', 'B區#13-4', 'A區#3-3'],
  // 第 14 排 (6 格)
  ['C區#1-2', 'C區#2-2', 'B區#14-3', 'B區#14-4', 'A區#3-4', 'A區#3-5'],
];

// B 區 84 格新抽屜代號 (依據現場 14 排由左至右、每排由上至下對照表)
const B_ZONE_CODES: string[][] = [
  // 第 1 排 (6 格)
  ['GT5315', 'GT5363', 'GT5366', 'GT5368', 'GT5368', 'GT5446'],
  // 第 2 排 (6 格)
  ['GT5446', 'GT5449', 'GT5504', 'GT5525', 'GT5525', 'GT5529'],
  // 第 3 排 (6 格)
  ['GT5529', 'GT5608', 'GT5614', 'GT5614', 'GT5638', 'GT5673'],
  // 第 4 排 (6 格)
  ['GT5674', 'GT5759', 'GT5759', 'GT5765', 'GT5816', 'GT5856'],
  // 第 5 排 (6 格)
  ['GT5960', 'GT5960A19', 'GT5962', 'GT5962', 'GT5987', 'GT5988'],
  // 第 6 排 (6 格)
  ['GT5988', 'GT6014', 'GT6133', 'GT6150', 'GT6154', 'GT6211'],
  // 第 7 排 (6 格)
  ['GT6235', 'GT6235', 'GT6255', 'GT6278-1', 'GT6278-1', 'GT6233'],
  // 第 8 排 (6 格)
  ['GT6417', 'GT6562', 'GT6562', 'GT6582', 'GT6583', 'GT6623'],
  // 第 9 排 (6 格)
  ['GT6633', 'GT6666', 'GT6678', 'GT6678', 'GT6687', 'GT6697'],
  // 第 10 排 (6 格)
  ['GT6731', 'GT6733', 'GT6737', 'GT6749', 'GT6764', 'GT6769'],
  // 第 11 排 (6 格)
  ['GT6928', 'GT6969', 'GT7000', 'GT7004', 'GT7042', 'GT7094'],
  // 第 12 排 (6 格)
  ['GT7131', 'GT7165', 'GT7184', 'GT7193', 'GT7288', 'GT7399'],
  // 第 13 排 (6 格)
  ['GT7399', 'GT8505', 'GT8506', 'GT8690', 'GT8690', 'GT8748'],
  // 第 14 排 (6 格)
  ['GT8778', 'GT8824', 'GT8856', 'GT8884', 'GT8884', 'GT8906'],
];

// C 區 48 格目前客戶編號位置 (依據現場 8 排由左至右、每排由上至下對照表)
const C_ZONE_CUSTOMER_IDS: string[][] = [
  // 第 1 排 (6 格)
  ['GT6417', 'GT8988', 'GT7399', 'GT6235', 'GT4848', 'GT5363'],
  // 第 2 排 (6 格)
  ['GT1222', 'GT1932', 'GT7399', 'GT6235', 'GT8946', 'GT12390'],
  // 第 3 排 (6 格)
  ['GT6154', 'GT1813', 'GT12711', 'GT7184', 'GT6582', 'GT12721'],
  // 第 4 排 (6 格)
  ['GT1606', 'GT12509', 'GT2088', 'GT5765', 'GT5525', 'GT9033'],
  // 第 5 排 (6 格)
  ['GT12725', 'GT12794', 'GT7131', 'GT12696', 'GT5446', 'GT12360'],
  // 第 6 排 (6 格)
  ['GT6562', 'GT8748', 'GT12809', 'GT12360', 'GT3780', 'GT6749'],
  // 第 7 排 (6 格)
  ['GT12820', 'GT6678', 'GT5962', 'GT8506', 'GT6687', 'GT12829'],
  // 第 8 排 (6 格)
  ['GT6928', 'GT8778', 'GT5608', 'GT6731', 'GT12839', 'GT12880'],
];

// C 區 48 格新目標位置 (依據現場 8 排由左至右、每排由上至下對照表)
const C_ZONE_NEW_LOCATIONS: string[][] = [
  // 第 1 排 (6 格)
  ['B區#8-1', 'C區#2-1', 'B區#12-6', 'B區#7-1', 'A區#11-5', 'B區#1-2'],
  // 第 2 排 (6 格)
  ['A區#1-5', 'A區#8-2', 'B區#13-1', 'B區#7-2', 'C區#1-3', 'C區#5-3'],
  // 第 3 排 (6 格)
  ['B區#6-5', 'A區#7-5', 'C區#6-5', 'B區#12-3', 'B區#8-4', 'C區#6-6'],
  // 第 4 排 (6 格)
  ['A區#5-3', 'C區#5-6', 'A區#9-6', 'B區#4-4', 'B區#2-5', 'C區#2-4'],
  // 第 5 排 (6 格)
  ['C區#7-1', 'C區#7-3', 'B區#12-1', 'C區#6-3', 'B區#3-1', 'C區#4-6'],
  // 第 6 排 (6 格)
  ['B區#8-3', 'B區#13-6', 'C區#7-4', 'C區#5-1', 'A區#11-1', 'B區#10-4'],
  // 第 7 排 (6 格)
  ['C區#7-5', 'B區#9-3', 'B區#5-3', 'B區#13-3', 'B區#9-5', 'C區#8-1'],
  // 第 8 排 (6 格)
  ['B區#11-1', 'B區#14-1', 'B區#3-2', 'B區#10-1', 'C區#8-3', 'C區#8-6'],
];

// C 區 48 格新抽屜代號 (依據現場 8 排由左至右、每排由上至下對照表)
const C_ZONE_CODES: string[][] = [
  // 第 1 排 (6 格)
  ['GT8907', 'GT8943', 'GT8946', 'GT8946', 'GT8946', 'GT8975'],
  // 第 2 排 (6 格)
  ['GT8988', 'GT8993', 'GT9001', 'GT9033', 'GT10066', 'GT10067'],
  // 第 3 排 (6 格)
  ['GT11101', 'GT11102', 'GT11169', 'GT11172', 'GT11195', 'GT11195'],
  // 第 4 排 (6 格)
  ['GT12236', 'GT12236', 'GT12251', 'GT12284', 'GT12288', 'GT12360'],
  // 第 5 排 (6 格)
  ['GT12360', 'GT12388', 'GT12390', 'GT12405', 'GT12486', 'GT12509'],
  // 第 6 排 (6 格)
  ['GT12515', 'GT12518', 'GT12696', 'GT12698', 'GT12711', 'GT12721'],
  // 第 7 排 (6 格)
  ['GT12725', 'GT12760', 'GT12794', 'GT12809', 'GT12820', 'GT12822'],
  // 第 8 排 (6 格)
  ['GT12829', 'GT12830', 'GT12839', 'GT12848', 'GT12858', 'GT12880'],
];

// 經辦同仁與客戶編號 (GT代號) 正式對照表
export const CUSTOMER_ID_TO_STAFF: Record<string, string> = {
  'GT1181': 'Penny',
  'GT1216': 'Ellie',
  'GT1222': 'Jin',
  'GT1236': 'Penny',
  'GT1251': 'B team',
  'GT1282': 'Cindy',
  'GT1301': 'Joyce',
  'GT1303': 'Kimber',
  'GT1312': 'Kimmy',
  'GT1359': 'Jin',
  'GT1359CEM': 'Jin',
  'GT1359CPM': 'Jin',
  'GT1359TC': 'Jin',
  'GT1386': 'Rebekah',
  'GT1386-1': 'Rebekah',
  'GT1390': 'Penny',
  'GT1394': 'Howard',
  'GT1414': 'Joyce',
  'GT1418': 'Sam',
  'GT1426': 'Zenith',
  'GT1456': 'Sharon',
  'GT1606': 'Cindy',
  'GT1631': 'Kimmy',
  'GT1636': 'Cindy',
  'GT1684': 'Penny',
  'GT1706': 'Yuna',
  'GT1739': 'Alice',
  'GT1763': 'Sharon',
  'GT1800': 'Penny',
  'GT1801': 'Sharon',
  'GT1813': 'Cindy',
  'GT1861': 'Joyce',
  'GT1864': 'Yuna',
  'GT1932': 'Candice',
  'GT1957': 'Kimmy',
  'GT1958': 'Kimmy',
  'GT1959': 'Yuna',
  'GT1964': 'Kimber',
  'GT1979': 'Kimmy',
  'GT1990': 'Howard',
  'GT1999': 'Cindy',
  'GT2023': 'Alice',
  'GT2057': 'Jin',
  'GT2088': 'David',
  'GT2212': 'Sharon',
  'GT3030': 'Joyce',
  'GT3051': 'Joyce',
  'GT3062': 'Howard',
  'GT3062HZ': 'Howard',
  'GT3204': 'Candice',
  'GT3780': 'Zenith',
  'GT4777': 'Alice',
  'GT4803': 'Howard',
  'GT4831': 'Alice',
  'GT4848': 'Zenith',
  'GT4996': 'Candice',
  'GT5315': 'Candice',
  'GT5363': 'Howard',
  'GT5366': 'Rebekah',
  'GT5368': 'Penny',
  'GT5446': 'Candice',
  'GT5449': 'Sharon',
  'GT5504': 'Kimmy',
  'GT5525': 'Alice',
  'GT5529': 'Candice',
  'GT5608': 'Candice',
  'GT5614': 'Jin',
  'GT5638': 'Cindy',
  'GT5673': 'Kimber',
  'GT5674': 'Kimber',
  'GT5759': 'Candice',
  'GT5765': 'Kimmy',
  'GT5816': 'Kimber',
  'GT5856': 'Joyce',
  'GT5960': 'Howard',
  'GT5960A19': 'Howard',
  'GT5962': 'Candice',
  'GT5987': 'Penny',
  'GT5988': 'Penny',
  'GT6014': 'Cindy',
  'GT6133': 'David',
  'GT6150': 'Alice',
  'GT6154': 'David',
  'GT6211': 'Kimber',
  'GT6235': 'Alice',
  'GT6255': 'Alice',
  'GT6278-1': 'Penny',
  'GT6233': 'Zenith',
  'GT6417': 'Joyce',
  'GT6562': 'Alice',
  'GT6582': 'Joyce',
  'GT6583': 'Yuna',
  'GT6623': 'Penny',
  'GT6633': 'Candice',
  'GT6666': 'Joyce',
  'GT6678': 'Ellie',
  'GT6687': 'Howard',
  'GT6697': 'Howard',
  'GT6731': 'Candice',
  'GT6733': 'Yuna',
  'GT6737': 'Penny',
  'GT6749': 'Bella',
  'GT6764': 'Cindy',
  'GT6769': 'Yuna',
  'GT6928': 'Howard',
  'GT6969': 'Joyce',
  'GT7000': 'Joyce',
  'GT7004': 'Candice',
  'GT7042': 'Penny',
  'GT7094': 'Jin',
  'GT7131': 'Howard',
  'GT7165': 'Joyce',
  'GT7184': 'Howard',
  'GT7193': 'Howard',
  'GT7288': 'Joyce',
  'GT7399': 'Jin',
  'GT8505': 'David',
  'GT8506': 'Candice',
  'GT8690': 'Zenith',
  'GT8748': 'Sharon',
  'GT8778': 'Zenith',
  'GT8824': 'David',
  'GT8856': 'Candice',
  'GT8884': 'Sharon',
  'GT8906': 'Penny',
  'GT8907': 'David',
  'GT8943': 'Jin',
  'GT8946': 'B team',
  'GT8975': 'Kimmy',
  'GT8988': 'David',
  'GT8993': 'Jin',
  'GT9001': 'Yuna',
  'GT9033': 'David',
  'GT10066': 'Sharon',
  'GT10067': 'David',
  'GT11101': 'David',
  'GT11102': 'David',
  'GT11169': 'Sharon',
  'GT11172': 'David',
  'GT11195': 'Sharon',
  'GT12236': 'Penny',
  'GT12251': 'Joyce',
  'GT12284': 'Cindy',
  'GT12288': 'Candice',
  'GT12360': 'Alice',
  'GT12388': 'David',
  'GT12390': 'Joyce',
  'GT12405': 'Candice',
  'GT12486': 'Alice',
  'GT12509': 'Howard',
  'GT12515': 'Joyce',
  'GT12518': 'Howard',
  'GT12696': 'Kimber',
  'GT12698': 'Howard',
  'GT12711': 'Howard',
  'GT12721': 'Sharon',
  'GT12725': 'Howard',
  'GT12760': 'Rebekah',
  'GT12794': 'Ellie',
  'GT12809': 'Ellie',
  'GT12820': 'Rebekah',
  'GT12822': 'Rebekah',
  'GT12829': 'Candice',
  'GT12830': 'Candice',
  'GT12839': 'Howard',
  'GT12848': 'David',
  'GT12858': 'Howard',
  'GT12880': 'Bella',
};

// 獨立經辦人清單
export const DISTINCT_STAFF_NAMES: string[] = [
  'Penny', 'Ellie', 'Jin', 'B team', 'Cindy', 'Joyce',
  'Kimber', 'Kimmy', 'Rebekah', 'Howard', 'Sam', 'Zenith',
  'Sharon', 'Yuna', 'Alice', 'Candice', 'David', 'Bella'
];

export function getStaffNameByCustomerId(customerId: string): string {
  if (!customerId) return '公用/未指定';
  const cleanId = customerId.trim();
  if (CUSTOMER_ID_TO_STAFF[cleanId]) {
    return CUSTOMER_ID_TO_STAFF[cleanId];
  }
  const foundKey = Object.keys(CUSTOMER_ID_TO_STAFF).find(
    (k) => k.toLowerCase() === cleanId.toLowerCase()
  );
  if (foundKey) return CUSTOMER_ID_TO_STAFF[foundKey];
  return '未指派';
}

// Generate complete pedestals matching 199 slots specifications
function generateInitialPedestals(): Pedestal[] {
  const list: Pedestal[] = [];
  let globalIndex = 0;

  // 1. A 區 (67 格, 使用 A_ZONE_CODES 提供之實體代號 與 A_ZONE_NEW_LOCATIONS 新目標位置)
  let aCounter = 1;
  A_ZONE_CODES.forEach((columnList, colIdx) => {
    const colNumber = colIdx + 1;
    columnList.forEach((codeName, slotIdx) => {
      const slotNumber = slotIdx + 1;
      const customerId = A_ZONE_CUSTOMER_IDS[colIdx]?.[slotIdx] || codeName;
      const userName = getStaffNameByCustomerId(customerId);

      let oldCol = colNumber;
      let oldRow = slotNumber;
      let oldZone = 'A區';
      let oldCode = `${oldZone}#${oldCol}-${oldRow}`;
      let targetNewLocation = A_ZONE_NEW_LOCATIONS[colIdx]?.[slotIdx] || `A區#${colNumber}-${slotNumber}`;

      // 特殊指定：A區 GT6211 (Kimber) 舊位置為 C區#2-1，新位置為 B區#6-6
      if (customerId === 'GT6211' || (colNumber === 1 && slotNumber === 5)) {
        oldZone = 'C區';
        oldCol = 2;
        oldRow = 1;
        oldCode = 'C區#2-1';
        targetNewLocation = 'B區#6-6';
      }

      const newCode = targetNewLocation;
      const isMoved = oldCode === targetNewLocation;

      list.push({
        id: `pedestal-A-${colNumber}-${slotNumber}`,
        userName,
        customerId,
        oldCode,
        newCode,
        newLocation: targetNewLocation,
        zone: 'A區',
        colIndex: colNumber,
        slotIndex: slotNumber,
        row: slotNumber,
        col: colNumber,
        oldZone,
        oldRow,
        oldCol,
        status: isMoved ? 'moved' : 'pending',
        notes: undefined,
      });

      aCounter++;
      globalIndex++;
    });
  });

  // 2. B 區 (84 格, 使用 B_ZONE_CODES 提供之實體代號 與 B_ZONE_NEW_LOCATIONS 新目標位置)
  let bCounter = 1;
  B_ZONE_CODES.forEach((columnList, colIdx) => {
    const colNumber = colIdx + 1;
    columnList.forEach((codeName, slotIdx) => {
      const slotNumber = slotIdx + 1;
      const customerId = B_ZONE_CUSTOMER_IDS[colIdx]?.[slotIdx] || codeName;
      const userName = getStaffNameByCustomerId(customerId);

      const oldCol = colNumber;
      const oldRow = slotNumber;
      const oldZone = 'B區';
      const oldCode = `${oldZone}#${oldCol}-${oldRow}`;
      const targetNewLocation = B_ZONE_NEW_LOCATIONS[colIdx]?.[slotIdx] || `B區#${colNumber}-${slotNumber}`;
      const newCode = targetNewLocation;
      const isMoved = oldCode === targetNewLocation;

      list.push({
        id: `pedestal-B-${colNumber}-${slotNumber}`,
        userName,
        customerId,
        oldCode,
        newCode,
        newLocation: targetNewLocation,
        zone: 'B區',
        colIndex: colNumber,
        slotIndex: slotNumber,
        row: slotNumber,
        col: colNumber,
        oldZone,
        oldRow,
        oldCol,
        status: isMoved ? 'moved' : 'pending',
        notes: undefined,
      });

      bCounter++;
      globalIndex++;
    });
  });

  // 3. C 區 (48 格, 使用 C_ZONE_CODES 提供之實體代號 與 C_ZONE_NEW_LOCATIONS 新目標位置)
  let cCounter = 1;
  C_ZONE_CODES.forEach((columnList, colIdx) => {
    const colNumber = colIdx + 1;
    columnList.forEach((codeName, slotIdx) => {
      const slotNumber = slotIdx + 1;
      const customerId = C_ZONE_CUSTOMER_IDS[colIdx]?.[slotIdx] || codeName;
      const userName = getStaffNameByCustomerId(customerId);

      let oldCol = colNumber;
      let oldRow = slotNumber;
      let oldZone = 'C區';
      let oldCode = `${oldZone}#${oldCol}-${oldRow}`;
      let targetNewLocation = C_ZONE_NEW_LOCATIONS[colIdx]?.[slotIdx] || `C區#${colNumber}-${slotNumber}`;

      // 特殊指定：C區 GT1222 (Jin) 舊位置為 A區#1-5，新位置為 A區#1-5
      if (customerId === 'GT1222' || (colNumber === 2 && slotNumber === 1)) {
        oldZone = 'A區';
        oldCol = 1;
        oldRow = 5;
        oldCode = 'A區#1-5';
        targetNewLocation = 'A區#1-5';
      }

      const newCode = targetNewLocation;
      const isMoved = oldCode === targetNewLocation;

      list.push({
        id: `pedestal-C-${colNumber}-${slotNumber}`,
        userName,
        customerId,
        oldCode,
        newCode,
        newLocation: targetNewLocation,
        zone: 'C區',
        colIndex: colNumber,
        slotIndex: slotNumber,
        row: slotNumber,
        col: colNumber,
        oldZone,
        oldRow,
        oldCol,
        status: isMoved ? 'moved' : 'pending',
        notes: undefined,
      });

      cCounter++;
      globalIndex++;
    });
  });

  return list;
}

// Helper to parse any location code (e.g. "B區#1-4", "A區#1-5", "C區#2-1") into zone, column, row, and readable text
export function parseLocationCode(code: string): {
  zone: string;
  col: number;
  row: number;
  formatted: string;
} {
  if (!code) return { zone: '', col: 0, row: 0, formatted: '' };
  const clean = code.trim();
  const match = clean.match(/^([ABCabc]區?)[#\s]?(\d+)[-#\s](\d+)$/);
  if (match) {
    let zone = match[1].toUpperCase();
    if (!zone.includes('區')) zone = `${zone}區`;
    const col = parseInt(match[2], 10);
    const row = parseInt(match[3], 10);
    return {
      zone,
      col,
      row,
      formatted: `${zone} (縱向第 ${col} 排 / 第 ${row} 格)`,
    };
  }
  return {
    zone: clean,
    col: 0,
    row: 0,
    formatted: clean,
  };
}

// Helper to get fixed new location for any zone, col, slot
export function getFixedNewLocation(zone: string, colIndex: number, slotIndex: number): string {
  const colIdx = colIndex - 1;
  const slotIdx = slotIndex - 1;
  if (zone === 'A區' || zone === 'A') {
    return A_ZONE_NEW_LOCATIONS[colIdx]?.[slotIdx] || `A區#${colIndex}-${slotIndex}`;
  }
  if (zone === 'B區' || zone === 'B') {
    return B_ZONE_NEW_LOCATIONS[colIdx]?.[slotIdx] || `B區#${colIndex}-${slotIndex}`;
  }
  if (zone === 'C區' || zone === 'C') {
    return C_ZONE_NEW_LOCATIONS[colIdx]?.[slotIdx] || `C區#${colIndex}-${slotIndex}`;
  }
  return `${zone}#${colIndex}-${slotIndex}`;
}

// Function to re-index and re-calculate pedestals after re-ordering a column or moving items
// 新位置永久綁定於 GT 抽屜本體（跟著 GT 代號移動），舊位置隨當前格位順序更新
export function recalculatePedestalsOrder(
  allPedestals: Pedestal[],
  zoneId: string,
  colNumber: number,
  newColumnOrderedPedestals: Pedestal[]
): Pedestal[] {
  const updatedColumnItems = newColumnOrderedPedestals.map((item, index) => {
    const slotNumber = index + 1;
    const oldCode = `${zoneId}#${colNumber}-${slotNumber}`;
    // 新位置與 GT 抽屜代號綁定，保持該抽屜原本的目標新位置不變
    const newLocation = item.newLocation || oldCode;
    const newCode = newLocation;
    const isMoved = oldCode === newLocation;

    return {
      ...item,
      zone: zoneId,
      colIndex: colNumber,
      slotIndex: slotNumber,
      row: slotNumber,
      col: colNumber,
      oldZone: zoneId,
      oldCol: colNumber,
      oldRow: slotNumber,
      oldCode,
      newLocation,
      newCode,
      status: isMoved ? ('moved' as const) : ('pending' as const),
      updatedAt: new Date().toISOString(),
    };
  });

  const otherPedestals = allPedestals.filter(
    (p) => !(p.zone === zoneId && p.colIndex === colNumber)
  );

  return [...otherPedestals, ...updatedColumnItems];
}

// Helper to move or swap an item between two slots
// 新位置跟隨 GT 代號綁定一起移動（目標值不變），舊位置隨移動後的新格位變更
export function movePedestalBetweenSlots(
  allPedestals: Pedestal[],
  sourceId: string,
  targetZone: string,
  targetCol: number,
  targetSlotIndex: number,
  mode: 'swap' | 'insert' = 'swap'
): Pedestal[] {
  const sourceItem = allPedestals.find((p) => p.id === sourceId);
  if (!sourceItem) return allPedestals;

  const sourceZone = sourceItem.zone;
  const sourceCol = sourceItem.colIndex;
  const sourceSlot = sourceItem.slotIndex;

  if (sourceZone === targetZone && sourceCol === targetCol && mode === 'insert') {
    // Reorder/Insert within same column
    const colItems = allPedestals
      .filter((p) => p.zone === sourceZone && p.colIndex === sourceCol)
      .sort((a, b) => a.slotIndex - b.slotIndex);

    const fromIndex = colItems.findIndex((p) => p.id === sourceId);
    if (fromIndex === -1) return allPedestals;

    const toIndex = Math.max(0, Math.min(targetSlotIndex - 1, colItems.length - 1));
    if (fromIndex === toIndex) return allPedestals;

    const reordered = [...colItems];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    return recalculatePedestalsOrder(allPedestals, sourceZone, sourceCol, reordered);
  } else {
    // Swap between source slot and target slot (direct swap)
    const targetItem = allPedestals.find(
      (p) => p.zone === targetZone && p.colIndex === targetCol && p.slotIndex === targetSlotIndex
    );

    if (targetItem) {
      const sourceNewOldCode = `${targetZone}#${targetCol}-${targetSlotIndex}`;
      const targetNewOldCode = `${sourceZone}#${sourceCol}-${sourceSlot}`;

      // Source item (GT 抽屜) 移動至 target 格位：
      // 舊位置變成 targetNewOldCode，新位置仍綁定 sourceItem.newLocation (目標值不變)
      const updatedSourceItem: Pedestal = {
        ...sourceItem,
        zone: targetZone,
        colIndex: targetCol,
        slotIndex: targetSlotIndex,
        row: targetSlotIndex,
        col: targetCol,
        oldZone: targetZone,
        oldCol: targetCol,
        oldRow: targetSlotIndex,
        oldCode: sourceNewOldCode,
        newLocation: sourceItem.newLocation, // 永久跟隨此 GT 抽屜
        newCode: sourceItem.newLocation || sourceNewOldCode,
        status: sourceNewOldCode === sourceItem.newLocation ? 'moved' : 'pending',
        updatedAt: new Date().toISOString(),
      };

      // Target item (GT 抽屜) 移動至 source 格位：
      // 舊位置變成 targetNewOldCode，新位置仍綁定 targetItem.newLocation (目標值不變)
      const updatedTargetItem: Pedestal = {
        ...targetItem,
        zone: sourceZone,
        colIndex: sourceCol,
        slotIndex: sourceSlot,
        row: sourceSlot,
        col: sourceCol,
        oldZone: sourceZone,
        oldCol: sourceCol,
        oldRow: sourceSlot,
        oldCode: targetNewOldCode,
        newLocation: targetItem.newLocation, // 永久跟隨此 GT 抽屜
        newCode: targetItem.newLocation || targetNewOldCode,
        status: targetNewOldCode === targetItem.newLocation ? 'moved' : 'pending',
        updatedAt: new Date().toISOString(),
      };

      return allPedestals.map((p) => {
        if (p.id === sourceItem.id) return updatedSourceItem;
        if (p.id === targetItem.id) return updatedTargetItem;
        return p;
      });
    }

    return allPedestals;
  }
}

// Helper to shift a pedestal up or down within its column
export function shiftPedestalWithinColumn(
  allPedestals: Pedestal[],
  pedestalId: string,
  direction: 'up' | 'down'
): Pedestal[] {
  const item = allPedestals.find((p) => p.id === pedestalId);
  if (!item) return allPedestals;

  const targetSlot = direction === 'up' ? item.slotIndex - 1 : item.slotIndex + 1;
  return movePedestalBetweenSlots(allPedestals, pedestalId, item.zone, item.colIndex, targetSlot);
}

export const INITIAL_PEDESTALS: Pedestal[] = generateInitialPedestals();

// Helper to calculate stats
export function calculateStats(items: Pedestal[]): { total: number; moved: number; pending: number; percentage: number } {
  const total = items.length;
  const moved = items.filter((item) => item.status === 'moved').length;
  const pending = total - moved;
  const percentage = total > 0 ? Math.round((moved / total) * 100) : 0;
  return { total, moved, pending, percentage };
}
