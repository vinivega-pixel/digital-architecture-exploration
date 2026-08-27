export type NormLink = { match: RegExp; label: string; url: string; source: string };

const P = 'publication.pravo.gov.ru';
const D = 'docs.cntd.ru';
const M = 'minstroyrf.gov.ru';

export const normLinks: NormLink[] = [
  { match: /ГрК РФ|Градостроительн/i, label: 'Градостроительный кодекс РФ № 190-ФЗ', url: 'http://pravo.gov.ru/proxy/ips/?docbody=&nd=102091987', source: P },
  { match: /ЗК РФ|Земельн/i, label: 'Земельный кодекс РФ № 136-ФЗ', url: 'http://pravo.gov.ru/proxy/ips/?docbody=&nd=102073572', source: P },
  { match: /ГК РФ|Гражданск/i, label: 'Гражданский кодекс РФ, часть вторая № 14-ФЗ', url: 'http://pravo.gov.ru/proxy/ips/?docbody=&nd=102039276', source: P },
  { match: /ЖК РФ|Жилищн/i, label: 'Жилищный кодекс РФ № 188-ФЗ', url: 'http://pravo.gov.ru/proxy/ips/?docbody=&nd=102090645', source: P },
  { match: /НК РФ|Налогов/i, label: 'Налоговый кодекс РФ, часть вторая № 117-ФЗ', url: 'http://pravo.gov.ru/proxy/ips/?docbody=&nd=102067058', source: P },
  { match: /№\s*384-ФЗ|безопасност(и|ь) зданий/i, label: 'ФЗ № 384-ФЗ — техрегламент о безопасности зданий и сооружений', url: 'http://pravo.gov.ru/proxy/ips/?docbody=&nd=102134587', source: P },
  { match: /№\s*123-ФЗ|пожарн(ой|ая) безопасност/i, label: 'ФЗ № 123-ФЗ — техрегламент о требованиях пожарной безопасности', url: 'http://pravo.gov.ru/proxy/ips/?docbody=&nd=102117269', source: P },
  { match: /№\s*218-ФЗ|регистрац(ия|ии) недвижимост/i, label: 'ФЗ № 218-ФЗ — государственная регистрация недвижимости', url: 'http://pravo.gov.ru/proxy/ips/?docbody=&nd=102377386', source: P },
  { match: /№\s*214-ФЗ|долевом? участи/i, label: 'ФЗ № 214-ФЗ — участие в долевом строительстве', url: 'http://pravo.gov.ru/proxy/ips/?docbody=&nd=102090621', source: P },
  { match: /ПП РФ №\s*87|постановлени.*87/i, label: 'ПП РФ № 87 — состав разделов проектной документации', url: 'http://pravo.gov.ru/proxy/ips/?docbody=&nd=102120562', source: P },
  { match: /ПП РФ №\s*145/i, label: 'ПП РФ № 145 — порядок проведения государственной экспертизы', url: 'http://pravo.gov.ru/proxy/ips/?docbody=&nd=102110484', source: P },
  { match: /ПП РФ №\s*290/i, label: 'ПП РФ № 290 — минимальный перечень работ по содержанию дома', url: 'http://pravo.gov.ru/proxy/ips/?docbody=&nd=102163651', source: P },
  { match: /Госкомстат|КС-2|КС-3|КС-11|КС-14|№\s*100|№\s*71а/i, label: 'Постановления Госкомстата № 100 и № 71а — унифицированные формы КС', url: 'https://docs.cntd.ru/document/901751469', source: D },
  { match: /РД-11-02-2006/i, label: 'РД-11-02-2006 — исполнительная документация', url: 'https://docs.cntd.ru/document/902024326', source: D },
  { match: /РД-11-05-2007/i, label: 'РД-11-05-2007 — порядок ведения общего журнала работ', url: 'https://docs.cntd.ru/document/902075582', source: D },
  { match: /ПУЭ/i, label: 'Правила устройства электроустановок, издание 7', url: 'https://docs.cntd.ru/document/1200030216', source: D },
  { match: /СО 153-34\.21\.122/i, label: 'СО 153-34.21.122-2003 — устройство молниезащиты', url: 'https://docs.cntd.ru/document/1200034368', source: D },
  { match: /ОСР-2015|сейсмическ(ому|ого) районирован/i, label: 'СП 14.13330.2018, карты ОСР-2015 — сейсмическое районирование', url: 'https://docs.cntd.ru/document/550565571', source: D },
  { match: /СанПиН/i, label: 'СанПиН 1.2.3685-21 — гигиенические нормативы факторов среды', url: 'http://publication.pravo.gov.ru/Document/View/0001202102030022', source: P },
  { match: /ОДН 218/i, label: 'ОДН 218.046-01 — проектирование дорожных одежд', url: 'https://docs.cntd.ru/document/1200028730', source: D },
];

const spDocs: Record<string, string> = {
  '42.13330': '456054209',
  '47.13330': '456045544',
  '20.13330': '456044318',
  '22.13330': '456054206',
  '14.13330': '550565571',
  '50.13330': '1200095525',
  '60.13330': '573697256',
  '30.13330': '573168579',
  '31.13330': '608468959',
  '32.13330': '554535470',
  '52.13330': '456054197',
  '70.13330': '1200097510',
  '73.13330': '456029434',
  '17.13330': '456069594',
  '82.13330': '456069594',
  '124.13330': '1200095545',
  '256.1325800': '456069197',
  '502.1325800': '607906855',
  '323.1325800': '556685529',
  '134.13330': '1200095545',
  '1.13130': '565248722',
  '3.13130': '1200071053',
  '5.13130': '1200071148',
  '6.13130': '1200180876',
  '7.13130': '1200098833',
  '10.13130': '565248776',
  '484.1311500': '565237064',
  '485.1311500': '565237065',
  '486.1311500': '565237066',
  '11-104-97': '1200083406',
  '11-105-97': '1200084076',
};

const gostDocs: Record<string, string> = {
  '21.101': '565792368',
  '21.301': '1200114774',
  '21.601': '1200093054',
  '21.602': '1200140132',
  '21.613': '1200115948',
  '51872': '1200167940',
  '9.602': '1200139650',
  '27751': '1200110372',
  '53246': '1200069962',
  '59638': '1200178856',
  '58973': '1200174078',
  '51992': '1200084278',
};

export const resolveNorm = (title: string): { url: string; source: string } | null => {
  const direct = normLinks.find((n) => n.match.test(title));
  if (direct) return { url: direct.url, source: direct.source };

  const sp = title.match(/СП\s*([\d.]+(?:-\d{2,4})?)/i);
  if (sp) {
    const key = Object.keys(spDocs).find((k) => sp[1].startsWith(k));
    if (key) return { url: `https://docs.cntd.ru/document/${spDocs[key]}`, source: D };
    return { url: `https://www.${M}/docs/`, source: M };
  }

  const gost = title.match(/ГОСТ[\sР]*([\d.]+)/i);
  if (gost) {
    const key = Object.keys(gostDocs).find((k) => gost[1].startsWith(k));
    if (key) return { url: `https://docs.cntd.ru/document/${gostDocs[key]}`, source: D };
    return { url: 'https://docs.cntd.ru/', source: D };
  }

  return null;
};
