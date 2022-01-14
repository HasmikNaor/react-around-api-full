import successIcon from '../images/V.png'
import failIcon from '../images/redX.jpg'
import plus from '../images/plus.svg'
import { useNavigate } from 'react-router-dom';

function InfoTooltip(props) {
  const navigate = useNavigate();

  const redirect = () => {
    if (props.calledFrom === 'register')
      navigate("/signin")

    if (props.calledFrom === 'login')
      navigate('/signin');
  }

  const close = () => {
    props.onClose();
    redirect();
  }

  const handleClickOnOverlayClose = (e) => {
    close();
    redirect();
  }

  return (
    <div className={`popup popup_${props.name} ` + 'popup_open'} onClick={handleClickOnOverlayClose} tabIndex="0">
      <div className="popup__content" onClick={e => e.stopPropagation()}>
        <button className={`popup__close-btn popup__close-btn_${props.name}`} onClick={close}>
          <img src={plus} alt="close-btn" className="popup__close-btn-img" />
        </button>

        <div className={'popup__infoTooltip'}>

          {props.isSuccessOpen && <img src={successIcon} alt="icon" className="popup__infoTooltip_icon" />
          }

          {props.isFailOpen && < img src={failIcon} alt="icon" className="popup__infoTooltip_icon" />}


          {props.isSuccessOpen && <h2 className={'popup__infoTooltip_title'}>Success! You have now been registered</h2>}

          {props.isFailOpen && <h2 className={`popup__infoTooltip_title`}>Oops, something went wrong! Please try again</h2>}
        </div>
      </div>
    </div>
  )
}
export default InfoTooltip