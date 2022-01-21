import { Link } from 'react-router-dom';
import logo from '../images/logo.svg';

function Header(props) {
  const calledFrom = props.calledFrom;

  const onLogout = () => {
    localStorage.removeItem('token');
    props.handleLogin(false);
  }

  return (
    <header className="header">
      <img src={logo} alt="logo" className="logo" />
      {calledFrom === 'login' && <ul className="header__list">
        <li className="header__list-item">
          <Link className="header__link" to="/signup">Sign up</Link>
        </li>
      </ul>}
      {calledFrom === 'register' && <ul className="header__list">
        <li className="header__list-item">
          <Link className="header__link" to="/login">Sign in</Link>
        </li>
      </ul>}
      {calledFrom === 'main' && <ul className="header__list">
        <li className="header__list-item">
          {props.userData.email}
        </li>
        <li className="header__list-item">
          <Link className="header__link" to="/login" onClick={onLogout}>Log out</Link>
        </li>
      </ul>}
    </header >
  )
}

export default Header;
