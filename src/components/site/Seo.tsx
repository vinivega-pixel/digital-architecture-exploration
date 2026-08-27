import { useEffect } from 'react';
import { HERO_IMAGE, stages } from '@/data/stages';

const TITLE = 'ЦИФРА — расчёты, шаблоны и цифровые продукты для строительства | Институт архитектуры';
const DESC =
  'Бесплатные строительные калькуляторы с формулами и выгрузкой PDF, шаблоны документов по государственным формам и нормы: от покупки участка и изысканий до ОВиК, слаботочных систем и ввода в эксплуатацию. Премиум — ИИ-агенты, офлайн-программы и проекты института ЦИФРА.';
const KEYS = [
  'строительные калькуляторы',
  'шаблоны документов строительство',
  'форма КС-2 КС-3',
  'проектная документация ПП РФ 87',
  'рабочая документация',
  'инженерные изыскания',
  'проект электроснабжения ИОС1',
  'проект ОВиК',
  'АУПТ СКУД проект',
  'исполнительная документация РД-11-02-2006',
  'молниезащита расчёт',
  'ИИ агенты для стройки',
].join(', ');

const meta = (attr: string, name: string, content: string) => {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const Seo = () => {
  useEffect(() => {
    document.title = TITLE;
    meta('name', 'description', DESC);
    meta('name', 'keywords', KEYS);
    meta('name', 'robots', 'index, follow, max-image-preview:large');
    meta('property', 'og:type', 'website');
    meta('property', 'og:site_name', 'ЦИФРА');
    meta('property', 'og:locale', 'ru_RU');
    meta('property', 'og:title', TITLE);
    meta('property', 'og:description', DESC);
    meta('property', 'og:image', HERO_IMAGE);
    meta('name', 'twitter:card', 'summary_large_image');
    meta('name', 'twitter:title', TITLE);
    meta('name', 'twitter:description', DESC);
    meta('name', 'twitter:image', HERO_IMAGE);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;

    const ld = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${window.location.origin}/#org`,
          name: 'ООО «ЦИФРА»',
          alternateName: 'Цифровой институт фундаментального развития архитектуры',
          url: window.location.origin,
          email: 'info@cifra-institute.ru',
          image: HERO_IMAGE,
          description: DESC,
          areaServed: 'RU',
        },
        {
          '@type': 'ItemList',
          name: 'Этапы строительного проекта',
          itemListElement: stages.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: `${s.phase}: ${s.kicker}`,
            description: s.lead,
            url: `${window.location.origin}/#${s.id}`,
          })),
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Калькуляторы на сайте бесплатные?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Да. Все калькуляторы с формулами и расшифровкой обозначений, шаблоны документов и подборки норм доступны бесплатно, результат расчёта выгружается в PDF.',
              },
            },
            {
              '@type': 'Question',
              name: 'Что входит в премиум-доступ?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Автономные ИИ-агенты по разделам проекта, офлайн-программы HTML, карты согласований, готовые комплекты проектной и рабочей документации.',
              },
            },
          ],
        },
      ],
    };

    let script = document.head.querySelector('script[data-seo-ld]');
    if (!script) {
      script = document.createElement('script');
      (script as HTMLScriptElement).type = 'application/ld+json';
      script.setAttribute('data-seo-ld', '1');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(ld);
  }, []);

  return null;
};

export default Seo;
