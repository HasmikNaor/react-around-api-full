import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login.js';
import Register from './Register.js';
import ProtectedRoute from './ProtectedRoute.js';
import { getContent } from '../utils/auth.js';
import '../index.css';
import CurrentUser from '../contexts/CurrentUserContext';
import { api } from '../utils/api.js'
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isSucceededPopupOpen, setIsSucceededPopupOpen] = useState(false);
  const [isFailedPopupOpen, setIsFailedPopupOpen] = useState(false);
  const [user, setUser] = useState({});
  const [cards, setCards] = useState([]);
  const [userData, setUserData] = useState({ email: '' });
  const [selectedCard, setSelectedCard] = useState({
    link: '',
    name: '',
    id: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    tokenCheck();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      api.getUserInfo()
        .then((res) => {
          setUser(res)
        })
        .catch((error) => console.log(error))

      api.getInitialCards()
        .then(res => {
          setCards(res)
        }
        )
        .catch((error) => console.log(error))

    }

  }, [loggedIn])

  //after authorization get the content of the page
  const tokenCheck = () => { //check that the user has a valid token
    const token = localStorage.getItem('token');

    if (token) {
      getContent(token) //verifies the token
        .then((res) => {
          if (res) {
            setUserData({
              email: res.data.email,
            })
            setLoggedIn({
              loggedIn: true,
            });

            navigate("/");
          }
        })
        .catch(err => console.log(err))
    }
  } //Now, if a user logs in and leaves the page, when they return, everything will appear right where they left it

  const handleLogin = () => {
    setLoggedIn({
      loggedIn: true
    })
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }

  const handleCardClick = (card) => {
    setIsImagePopupOpen(true);
    setSelectedCard({
      link: card.link,
      name: card.name,
      id: card._id
    })
  }

  const handleCardDelete = (card, isOwn) => {
    if (isOwn)
      api.deleteCard(card._id)
        .then(() => setCards(cards => cards.filter(c => c._id !== card._id)))
        .catch(error => console.log(error))
  }

  const handleCardLike = (card, isLiked) => {
    if (isLiked)
      api.deleteLike(card._id)
        .then((newCard) => setCards(cards => cards.map(c => c._id === card._id ? newCard : c)
        )
        )
        .catch((error) => console.log(error))
    else
      api.addLike(card._id)
        .then((newCard) => setCards(cards => cards.map(c => c._id === card._id ? newCard : c)
        ))
        .catch((error) => console.log(error))
  }

  const handleUpdateUser = ({ name, about }) => {
    api.setUserData(name, about)
      .then((res) => {
        setUser(res);
        closeAllPopups();
      })
      .catch(error => console.log(error))
  }

  const handleUpdateAvatar = ({ avatar }) => {
    api.updateAvatar(avatar)
      .then((res) => {
        setUser(res);
        closeAllPopups();
      })
      .catch(error => console.log(error))
  }

  const handleAddPlaceSubmit = (data) => {
    api.createCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(error => console.log(error))
  }

  const closeAllPopups = () => {
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsSucceededPopupOpen(false)
    setIsFailedPopupOpen(false)
  }

  return (
    <CurrentUser.Provider value={user}>
      {/* <div className="body"> */}
      <div className="page">
        <Routes >
          <Route path="/" element={
            <ProtectedRoute
              component={Main}
              loggedIn={loggedIn}
              userData={userData}
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onEditAvatarClick={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              handleLogin={handleLogin}
            />} />

          <Route path="/signin"
            element={
              <Login
                handleLogin={handleLogin}
                closeAllPopups={closeAllPopups}
                setIsFailOpen={setIsFailedPopupOpen}
                isFailOpen={isFailedPopupOpen}
                setUserData={setUserData} />}
          />
          <Route path="/signup" element={
            <Register
              closeAllPopups={closeAllPopups}
              isFailOpen={isFailedPopupOpen}
              setIsFailOpen={setIsFailedPopupOpen}
              setIsSuccessOpen={setIsSucceededPopupOpen}
              isSuccessOpen={isSucceededPopupOpen}
            />} />
          <Route path="*" element={!loggedIn && <Navigate replace to="/signin" />} />
        </Routes>
        <Footer />

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlaceSubmit={handleAddPlaceSubmit} />

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

        <PopupWithForm name='type_delete-card' title='Are you sure' onClose={closeAllPopups} />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} isOpen={isImagePopupOpen} />
      </div>
      {/* </div> */}
    </CurrentUser.Provider>
  )
}

export default App;

