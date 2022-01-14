import PopupWithForm from "./PopupWithForm";
import { useRef } from 'react';

function AddPlacePopup(props) {
  const titleInputRef = useRef();
  const imgUrlRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    props.onAddPlaceSubmit({
      name: titleInputRef.current.value,
      link: imgUrlRef.current.value
    })
  }

  return (
    <PopupWithForm name='add-new-place' title='New Place' isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit}>
      <input id="card-name-input" type="text" className="popup__input popup__input_new-place_title" ref={titleInputRef}
        placeholder="Title" required minLength="1" maxLength="30" name="name" />
      <span id="card-name-input-error" className="popup__error"></span>
      <input id="card-link-input" type="url" className="popup__input popup__input_new-place_url" ref={imgUrlRef}
        placeholder="Image url" required name="link" />
      <span id="card-link-input-error" className="popup__error"></span>
    </PopupWithForm>
  )
}
export default AddPlacePopup;