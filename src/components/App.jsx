import React, { Component } from 'react';
import getImages from 'Services/API';
import { SearchBar } from './SearchBar/SearchBar';
import { ImageGallery } from './ImageGallery/ImageGallery.js';
import { Button } from './Button/Button.js';
import { Loader } from './Loader/Loader.js';
import { ModalWindow } from './Modal/Modal.js';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export class App extends Component {
  state = {
    images: [],
    query: '',
    page: 1,
    largeImageURL: '',
    tag: '',
    isModalOpen: false,
    loading: false,
    error: null,
    loadMore: false,
  };

  async componentDidUpdate(_, prevState) {
    if (
      prevState.query !== this.state.query ||
      prevState.page !== this.state.page
    ) {
      try {
        this.setState({ loading: true });

        const searchQuery = this.state.query.split('/');

        const { hits, totalHits } = await getImages(
          searchQuery[1],
          this.state.page
        );
        if (hits.length === 0) {
          Report.warning('You enter invalid Input. Try again.');
        }
        if (this.state.page === 1) {
          Notify.success(`Hooray! We found ${totalHits} images.`);
        }

        this.setState(prev => {
          return {
            images: [...prev.images, ...hits],
            loadMore: this.state.page < Math.ceil(totalHits / 12),
          };
        });
      } finally {
        this.setState({ loading: false });
      }
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const searchQuery = e.target.query.value.toLowerCase().trim('');
    if (!searchQuery) {
      return Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    }

    this.setState({
      query: `${Date.now()}/${searchQuery}`,
      page: 1,
      images: [],
    });
  };

  onLoadMore = () => {
    this.setState(prev => ({ page: prev.page + 1 }));
  };

  openModal = (largeImageURL, tag) => {
    this.setState({
      isModalOpen: true,
      largeImageURL,
      tag,
    });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
      largeImageURL: '',
      tag: '',
    });
  };

  render() {
    const { images, largeImageURL, tag, isModalOpen, loading, loadMore } =
      this.state;
    return (
      <>
        <SearchBar onSubmit={this.onSubmit} />
        {loading && <Loader />}
        {images.length > 0 && (
          <ImageGallery
            gallery={images}
            onImageClick={this.openModal}
          ></ImageGallery>
        )}
        {loadMore && <Button onClick={this.onLoadMore}>Load more</Button>}
        <ModalWindow
          isOpen={isModalOpen}
          closeModal={this.closeModal}
          largeImageURL={largeImageURL}
          tag={tag}
        />
      </>
    );
  }
}
