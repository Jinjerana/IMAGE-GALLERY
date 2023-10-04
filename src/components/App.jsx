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
  const [largeImageURL, setLargeImageURL] = useState('');
  const [tag, setTag] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    if (!query) return;
    async function getQuery() {
      try {
        setLoading(true);
        setError(false);
        const searchQuery = query.split('/');

        const { hits, totalHits } = await getImages(searchQuery[1], page);
        if (hits.length === 0) {
          Report.warning('You enter invalid Input. Try again.');
        }
        if (page === 1) {
          Notify.success(`Hooray! We found ${totalHits} images.`);
        }

        setImages(prev => [...prev, ...hits]);

        setLoadMore(page < Math.ceil(totalHits / 12));
      } catch (error) {
        setError(true);
        Report.warning('Error. Try again.');
      } finally {
        setLoading(false);
      }
    }
    getQuery();
  }, [query, page]);

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
    setPage(page + 1);
  };

  const openModal = (largeImageURL, tag) => {
    setIsModalOpen(true);
    setLargeImageURL(largeImageURL);
    setTag(tag);
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
