import React from 'react';
import { useState, useEffect } from 'react';
import getImages from 'Services/API';
import { SearchBar } from './SearchBar/SearchBar';
import { ImageGallery } from './ImageGallery/ImageGallery.js';
import { Button } from './Button/Button.js';
import { Loader } from './Loader/Loader.js';
import { ModalWindow } from './Modal/Modal.js';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [largeImageURL, setLargeImageURL] = '';
  const [tag, setTag] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    async function getQuery() {
      try {
        setLoading(true);
        const searchQuery = setQuery.split('/');

        const { hits, totalHits } = await getImages(searchQuery[1], page);
        if (hits.length === 0) {
          Report.warning('You enter invalid Input. Try again.');
        }
        if (page === 1) {
          Notify.success(`Hooray! We found ${totalHits} images.`);
        }

        setImages(prev => prev.images: [...prev.images, ...hits],
          );

        setLoadMore(prev => {
          return {
            loadMore: page < Math.ceil(totalHits / 12),
          };
        });
      } finally {
        setLoading(false);
      }
    }
    getQuery();
  }, [query]);

  const onSubmit = e => {
    e.preventDefault();

    const searchQuery = e.target.query.value.toLowerCase().trim('');
    if (!searchQuery) {
      return Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    }

    setQuery(`${Date.now()}/${searchQuery}`);
    setPage(1);
    setImages([]);
  };

  const onLoadMore = () => {
    prev => ({ setPage: prev.page + 1 });
  };

  const openModal = () => {
    setIsModalOpen(true);
    setLargeImageURL();
    setTag();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLargeImageURL('');
    setTag('');
  };

  return (
    <>
      <SearchBar onSubmit={onSubmit} />
      {loading && <Loader />}
      {images.length > 0 && (
        <ImageGallery gallery={images} onImageClick={openModal}></ImageGallery>
      )}
      {loadMore && <Button onClick={onLoadMore}>Load more</Button>}
      <ModalWindow
        isOpen={isModalOpen}
        closeModal={closeModal}
        largeImageURL={largeImageURL}
        tag={tag}
      />
    </>
  );
};
