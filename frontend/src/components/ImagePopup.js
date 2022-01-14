import plusIcon from '../images/plus.svg';

function ImagePopup(props) {
  const close = () => {
    props.onClose();
  }


  const handleClickOnOverlayClose = (e) => {
    close()
  }

  return (
    <div className={`popup popup_image ` + (props.isOpen && 'popup_open')} onClick={handleClickOnOverlayClose} tabIndex="0">
      <figure className="popup__figure" onClick={e => e.stopPropagation()}>
        <button className="popup__close-btn">
          <img src={plusIcon} alt="close-image" className="popup__close-btn-img" onClick={props.onClose} />
        </button>
        <img alt={props.card.name} className="popup__image" src={props.card.link} />
        <figcaption className="popup__caption">{props.card.name}</figcaption>
      </figure>
    </div>
  )
}

export default ImagePopup;