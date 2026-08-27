import type { Calc, CalcField, CalcRow } from '../stages';

export const nf = (v: number, d = 2) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: d }).format(Number.isFinite(v) ? v : 0);

export const f = (key: string, label: string, def: number, unit?: string, step?: number): CalcField => ({
  key,
  label,
  def,
  unit,
  step: step ?? 1,
});

export const mk = (
  id: string,
  title: string,
  note: string,
  basis: string,
  formula: string,
  legend: string[],
  fields: CalcField[],
  compute: (v: Record<string, number>) => CalcRow[],
): Calc => ({ id, title, note, basis, formula, legend, fields, compute });

export const r = (label: string, value: string, accent?: boolean): CalcRow => ({ label, value, accent });

export const DEG = Math.PI / 180;
