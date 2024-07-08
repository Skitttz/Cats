import React from 'react';
import styles from './Header.module.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Cats from '../Assets/cats.svg';
import MinhaConta from '../Assets/usuario.svg';
import Sair from '../Assets/sair.svg';
import { useUser } from '../UserContext';
import UserLogoutModal from './User/UserLogoutModal';
import { disableScroll } from './Utils/DisableScroll';

const Header = () => {
  const { data, userLogout } = useUser();
  const [modalLogout, setModalLogout] = React.useState(null);
  const navigate = useNavigate();

  function handleLogout() {
    userLogout();
    navigate('/login');
  }
  disableScroll(!!modalLogout);
  return (
    <>
      <header className={styles.header}>
        <nav className={`${styles.nav} container`}>
          <Link className={styles.logo} to="/" aria-label="Cats - Home">
            <Cats />
          </Link>
          {data ? (
            <div className={styles.loginContainer}>
              <p className={styles.paragraphName}>
                Olá,{' '}
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/conta');
                  }}
                  style={{ color: '#333' }}
                  className={styles.nome}
                >
                  {data.nome[0].toUpperCase() + data.nome.substring(1)}
                </a>
              </p>
              <Link className={styles.login} to="/conta">
                <button className={styles.btnMinha}>
                  <MinhaConta />
                </button>
              </Link>
              <button
                className={styles.sair}
                onClick={() => setModalLogout(true)}
              >
                <Sair />
              </button>
            </div>
          ) : (
            <Link className={styles.login} to="/login">
              Login / Criar
            </Link>
          )}
        </nav>
      </header>
      {modalLogout && (
        <UserLogoutModal
          setModalLogout={setModalLogout}
          handleLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Header;
