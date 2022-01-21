import React from 'react';
import plus from '../images/plus.svg';

function PopupWithForm(props) {
  const close = () => {
    props.onClose();
  }

  const handleClickOnOverlayClose = () => {
    close();
  }

  return (
    <div className={`popup popup_${props.name} ` + (props.isOpen && 'popup_open')} onClick={handleClickOnOverlayClose} tabIndex="0">
      <div className="popup__content" onClick={(e) => e.stopPropagation()}>
        <button className={`popup__close-btn popup__close-btn_${props.name}`} onClick={close}>
          <img src={plus} alt="close-btn" className="popup__close-btn-img" />
        </button>
        <form className={`popup__form popup__form_${props.name}`} onSubmit={props.onSubmit}>
          <h2 className={`popup__title popup__title_theme_${props.name}`}>{props.title}</h2>
          {props.children}
          <button type="submit" className="popup__save-btn">Save</button>
        </form>
      </div>
    </div>
  )
}

export default PopupWithForm;
