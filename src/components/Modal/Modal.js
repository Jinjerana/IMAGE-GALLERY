import ReactModal from 'react-modal';

export const ModalWindow = ({ isOpen, closeModal, largeImageURL, tag }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={{
        overlay: {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: '1200',
        },
      }}
    >
      <img src={largeImageURL} alt={tag} />
    </ReactModal>

    // <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
    //   <img
    //     src={largeImageURL}
    //     alt={tag}
    //     style={{
    //       overlay: {
    //         position: 'fixed',
    //         top: '0',
    //         left: '0',
    //         width: '100vw',
    //         height: '100vh',
    //         display: 'flex',
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //         backgroundColor: 'rgba(0, 0, 0, 0.8)',
    //         zIndex: '1200',
    //       },
    //       content: {
    //         color: 'lightsteelblue',
    //       },
    //     }}
    //   />
    // </Modal>
  );
};
