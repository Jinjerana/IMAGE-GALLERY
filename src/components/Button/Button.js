import { ButtonLoader } from './Button.Styled';

export const Button = ({ onClick }) => {
  return (
    <>
      <ButtonLoader type="button" onClick={() => onClick()}>
        Load more
      </ButtonLoader>
    </>
  );
};
