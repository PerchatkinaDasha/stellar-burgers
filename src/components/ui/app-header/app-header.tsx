import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

// Компонент AppHeaderUI отвечает за отображение шапки с навигацией
export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    {' '}
    {/* Шапка сайта с применением стилей из app-header.module.css */}
    <nav className={`${styles.menu} p-4`}>
      {' '}
      {/* Навигационное меню с отступами */}
      {/* Левая часть меню с навигационными ссылками */}
      <div className={styles.menu_part_left}>
        {/* Ссылка на страницу конструктора с иконкой */}
        <NavLink
          to={'/'}
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.link_active}` : styles.link
          }
        >
          <BurgerIcon type={'primary'} /> {/* Иконка конструктора */}
          <p className='text text_type_main-default ml-2 mr-10'>
            Конструктор
          </p>{' '}
          {/* Текст рядом с иконкой */}
        </NavLink>

        {/* Ссылка на страницу ленты заказов с иконкой */}
        <NavLink
          to={'/feed'}
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.link_active}` : styles.link
          }
        >
          <ListIcon type={'primary'} /> {/* Иконка ленты заказов */}
          <p className='text text_type_main-default ml-2'>Лента заказов</p>{' '}
          {/* Текст рядом с иконкой */}
        </NavLink>
      </div>
      {/* Центр с логотипом сайта */}
      <div className={styles.logo}>
        <Logo className='' /> {/* Логотип сайта */}
      </div>
      {/* Правая часть меню с личным кабинетом */}
      <div className={styles.link_position_last}>
        {/* Ссылка на страницу профиля с иконкой */}
        <NavLink
          to={'/profile'}
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.link_active}` : styles.link
          }
        >
          <ProfileIcon type={'primary'} /> {/* Иконка профиля */}
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}{' '}
            {/* Если имя пользователя есть, отображаем его, иначе "Личный кабинет" */}
          </p>
        </NavLink>
      </div>
    </nav>
  </header>
);
