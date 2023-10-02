import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';
import { Gallery, GalleryItem } from './ImageGallery.Styled';

export const ImageGallery = ({ gallery, onImageClick }) => {
  return (
    <Gallery>
      {gallery.map(item => (
        <GalleryItem
          key={item.id}
          onClick={() => onImageClick(item.largeImageURL, item.tags)}
        >
          <ImageGalleryItem url={item.webformatURL} tag={item.tags} />
        </GalleryItem>
      ))}
    </Gallery>
  );
};
