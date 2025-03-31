import { FC, PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProtectedPage: FC<
  PropsWithChildren<{ isAuthenticated: boolean }>
> = ({ children, isAuthenticated }) => {
  const navigate = useNavigate();

  // Перенаправление на страницу логина, если пользователь не авторизован
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [navigate, isAuthenticated]);

  // Отображаем дочерние элементы только если пользователь авторизован
  return isAuthenticated ? <>{children}</> : null;
};
