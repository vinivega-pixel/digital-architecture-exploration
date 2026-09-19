import { useEffect } from 'react';

let locks = 0;

const apply = () => {
  document.body.style.overflow = locks > 0 ? 'hidden' : '';
};

/**
 * Блокирует прокрутку страницы, пока открыто окно.
 * Считает все открытые окна, поэтому прокрутка возвращается только когда закрыто последнее.
 */
export const useBodyLock = (active: boolean) => {
  useEffect(() => {
    if (!active) return;
    locks += 1;
    apply();
    return () => {
      locks = Math.max(0, locks - 1);
      apply();
    };
  }, [active]);
};

export default useBodyLock;
