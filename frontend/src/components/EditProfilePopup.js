import PopupWithForm from './PopupWithForm';
import { useState, useContext, useEffect } from 'react';
import CurrentUser from '../contexts/CurrentUserContext';

function EditProfilePopup(props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const user = useContext(CurrentUser);

  useEffect(() => {
    setName(user.name);
    setDescription(user.about);
  }, [user, props.isOpen])

  const nameInputHandler = (e) => {
    setName(e.target.value)
  }

  const descriptionInputHandler = (e) => {
    setDescription(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    props.onUpdateUser({
      name: name,
      about: description
    })
  }

  return (
    <PopupWithForm name='edit-profile' title='Edit Profile' isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit}>
      <input id="name-input" type="text" className="popup__input popup__input_edit-profile_name"
        placeholder="Name" required minLength="2" maxLength="40" name="name" onChange={nameInputHandler} value={name || ''} />
      <span id="name-input-error" className="popup__error"></span>
      <input id="job-input" type="text" className="popup__input popup__input_edit-profile_about" value={description || ''}
        placeholder="Proffesion" required minLength="2" maxLength="200" name="job" onChange={descriptionInputHandler} />
      <span id="job-input-error" className="popup__error"></span>
    </PopupWithForm>
  )
}

export default EditProfilePopup;