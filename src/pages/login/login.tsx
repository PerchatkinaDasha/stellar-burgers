import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { login } from '@slices';

// Компонент Login для авторизации пользователя
export const Login: FC = () => {
  // Локальное состояние для хранения email и пароля
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Получаем данные пользователя и возможную ошибку из глобального состояния
  const { data, error } = useSelector((state) => state.user);

  // Хук для программной навигации
  const navigate = useNavigate();

  // Хук для отправки действий в Redux
  const dispatch = useDispatch();

  // Обработчик отправки формы
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы

    // Отправляем действие login с введенными пользователем данными
    dispatch(login({ email, password }));
  };

  // Если пользователь уже авторизован, перенаправляем на главную страницу
  if (data.name) {
    navigate('/');
  }
  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
