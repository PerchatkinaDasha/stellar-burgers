import { FC, PropsWithChildren, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

export const ProtectedPage: FC<
  PropsWithChildren<{ isAuthenticated: boolean }>
> = ({ children, isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Перенаправление на страницу логина, если пользователь не авторизован
  useEffect(() => {
    if (!isAuthenticated) {
      // Перенаправляем на страницу логина, сохраняя исходное местоположение пользователя
      navigate('/login', { replace: true, state: { from: location } });
    }
  }, [navigate, isAuthenticated, location]);

  // Отображаем дочерние элементы только если пользователь авторизован
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to='/login' state={{ from: location }} />
  );
};
