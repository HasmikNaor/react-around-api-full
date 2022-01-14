export const BASE_URL = "https://register.nomoreparties.co";

const _checkResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(res.statusText)
}

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`,
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => _checkResponse(res));
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`,
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => _checkResponse(res));
};

export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then((res) => _checkResponse(res));
} 
