import { GalleryImage } from './ImageGalleryItem.Styled';

export const ImageGalleryItem = ({ url, tag }) => {
  return (
    <>
      <GalleryImage src={url} alt={tag} />
    </>
  );
};
