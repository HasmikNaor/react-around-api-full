import PopupWithForm from "./PopupWithForm";
import { useRef } from 'react';

function EditAvatarPopup(props) {
  const avatarLinkInput = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    props.onUpdateAvatar({
      avatar: avatarLinkInput.current.value
    })
  }

  return (
    <PopupWithForm name='type_edit-avatar' title='Change profile picture' isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit}>
      <input id="avatar-link-input" type="url" className="popup__input" placeholder="Image url" required
        name="link" ref={avatarLinkInput} />
      <span id="avatar-link-input-error" className="popup__error"></span>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;