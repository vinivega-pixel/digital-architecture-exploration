export const hiddenCalcIds = new Set<string>([
  'tep',
  'auction',
  'landcost',
  'landtax',
  'сashflow',
]);

export const isHiddenCalc = (id: string) => hiddenCalcIds.has(id);

export default hiddenCalcIds;
