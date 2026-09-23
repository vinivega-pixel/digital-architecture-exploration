/**
 * Переход к этапу: подсвечивает нужный этап в ленте и прокручивает к нему.
 * Работает на компьютере (единый экран) и на телефоне (галерея).
 */
export const openStage = (id: string) => {
  if (id === 'premium' || id === 'about' || id === 'knowledge') {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  window.dispatchEvent(new CustomEvent<string>('open-stage', { detail: id }));

  const target =
    document.getElementById('stages') ?? document.getElementById('stages-mobile');
  setTimeout(() => target?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
};

export default openStage;
