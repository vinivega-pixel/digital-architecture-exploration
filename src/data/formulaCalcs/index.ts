import type { Calc } from '../stages';
import { stage1 } from './stage1';
import { stage2 } from './stage2';
import { stage3 } from './stage3';
import { stage4 } from './stage4';
import { stage5 } from './stage5';
import { stage6 } from './stage6';
import { stage7 } from './stage7';
import { stage8 } from './stage8';
import { stage9 } from './stage9';
import { stage10 } from './stage10';

export const formulaCalcs: Record<string, Calc[]> = {
  uchastok: stage1,
  izyskaniya: stage2,
  pd: stage3,
  arkr: stage4,
  eom: stage5,
  vk: stage6,
  ovik: stage7,
  ss: stage8,
  roof: stage9,
  blago: stage10,
};

export default formulaCalcs;
