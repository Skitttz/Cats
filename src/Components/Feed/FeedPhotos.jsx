import React from 'react';
import FeedPhotosItem from './FeedPhotosItem';
import { PHOTOS_GET, USER_GET_INFO_NAME } from '../../Api';
import useFetch from '../../Hooks/useFetch';
import Error from '../Helper/Error';
import Loading from '../Helper/Loading';
import styles from './FeedPhotos.module.css';
import Button from '../Forms/Button';
import { NavLink } from 'react-router-dom';
import AddPhotosSvg from '../../Assets/adicionar.svg';

const FeedPhotos = ({ page, user, setModalPhoto, setInfinite }) => {
  const { data, loading, error, request } = useFetch();
  const [userInfo, setUserInfo] = React.useState(null);
  React.useEffect(() => {
    async function fetchUserInfo() {
      try {
        const name = await USER_GET_INFO_NAME();
        setUserInfo(name);
      } catch (error) {
        console.error('[Error User]');
        setUserInfo(null);
      }
    }
    fetchUserInfo();
  }, []);

  React.useEffect(() => {
    async function fetchPhotos() {
      const total = window.innerWidth <= 640 ? 4 : 3;
      const { url, options } = PHOTOS_GET({ page, total, user });
      const { response, json } = await request(url, options);
      if (response && response.ok && json.length < total) {
        setInfinite(false);
      }
    }
    fetchPhotos();
  }, [request, user, page, setInfinite]);
  if (error) return <Error error={error} />;
  if (loading) return <Loading />;
  if ((data === null || data.length === 0) && user !== 0) {
    if (
      (typeof user === 'string' && user === userInfo?.name) ||
      (typeof user === 'number' && user === userInfo?.id)
    ) {
      return (
        <div className={`${styles.noPostUser} animeOpacity`}>
          <div>
            <p>Ops! Parece que seu estoque de gatinhos está vazio.</p>
            <p>Ainda não existem postagens para exibir.</p>
          </div>
          <div className={`${styles.containerButtons}`}>
            <NavLink to={'/conta/post'}>
              <Button>Criar primeiro post 🐾</Button>
            </NavLink>
            ou selecione
            <NavLink to={'/conta/post'} aria-label="Icone Nav">
              <AddPhotosSvg />
            </NavLink>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`${styles.noPostUser} animeOpacity`}>
          <div>
            <p>Ops! Parece que este usuário ainda não compartilhou nadinha.</p>
            <p>Ainda deve estar criando novidades fofinhas... 😺✨</p>
          </div>
        </div>
      );
    }
  }

  if (data)
    return (
      <ul className={`${styles.feed} animeLeft`}>
        {data.map((photo) => (
          <FeedPhotosItem
            key={photo.id}
            photo={photo}
            setModalPhoto={setModalPhoto}
          />
        ))}
      </ul>
    );
  else return null;
};

export default FeedPhotos;
