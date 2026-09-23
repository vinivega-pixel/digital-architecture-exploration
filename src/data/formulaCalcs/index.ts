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
import { more1 } from './more1';
import { more2 } from './more2';
import { more3 } from './more3';
import { more4 } from './more4';
import { more5 } from './more5';
import { more6 } from './more6';
import { more7 } from './more7';
import { more8 } from './more8';
import { more9 } from './more9';
import { more10 } from './more10';

export const formulaCalcs: Record<string, Calc[]> = {
  uchastok: [...stage1, ...more1],
  izyskaniya: [...stage2, ...more2],
  pd: [...stage3, ...more3],
  arkr: [...stage4, ...more4],
  eom: [...stage5, ...more5],
  vk: [...stage6, ...more6],
  ovik: [...stage7, ...more7],
  ss: [...stage8, ...more8],
  roof: [...stage9, ...more9],
  blago: [...stage10, ...more10],
};

export default formulaCalcs;
