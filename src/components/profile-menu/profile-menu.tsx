import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { logoutApi } from '@api';

export const ProfileMenu: FC = () => {
  // Получаем текущий путь (pathname) из React Router
  const { pathname } = useLocation();

  // Функция выхода пользователя
  const handleLogout = () => {
    logoutApi(); // Вызываем API для выхода
    deleteCookie('accessToken'); // Удаляем токен доступа
    deleteCookie('refreshToken'); // Удаляем refresh-токен
    window.location.reload(); // Перезагружаем страницу, чтобы обновить состояние
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
