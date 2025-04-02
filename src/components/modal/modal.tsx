import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

// Получаем корневой элемент, в который будет рендериться модальное окно
const modalRoot = document.getElementById('modals');

// Компонент Modal - отвечает за отображение модального окна
export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  useEffect(() => {
    // Функция обработчик события нажатия клавиши Escape
    const handleEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && onClose(); // Закрывает модальное окно при нажатии Escape
    };

    // Добавляем обработчик события при монтировании компонента
    document.addEventListener('keydown', handleEsc);

    return () => {
      // Удаляем обработчик события при размонтировании компонента
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]); // Запускаем эффект при изменении onClose

  return ReactDOM.createPortal(
    // Отрисовка UI-компонента модального окна
    <ModalUI title={title} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot as HTMLDivElement
  );
});
