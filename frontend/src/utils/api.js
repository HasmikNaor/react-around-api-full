
class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  customFetch(url, headers) {
    return fetch(url, headers)
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
  }

  getInitialCards() {
    return this.customFetch(`${this._baseUrl}/cards`, {
      headers: this._headers
    })
  }

  getUserInfo() {
    return this.customFetch(`${this._baseUrl}/users/me`, {
      headers: this._headers
    })
  }

  createCard(data) {
    return this.customFetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  deleteCard(cardId) {
    return this.customFetch(`${this._baseUrl}/cards/${cardId}`, {
      headers: this._headers,
      method: 'DELETE',
    })
  }

  addLike(cardId) {
    return this.customFetch(`${this._baseUrl}/cards/likes/${cardId}`, {
      headers: this._headers,
      method: 'PUT',
    })
  }

  deleteLike(cardId) {
    return this.customFetch(`${this._baseUrl}/cards/likes/${cardId}`, {
      headers: this._headers,
      method: 'DELETE',
    })
  }

  updateAvatar(avatar) {
    return this.customFetch(`${this._baseUrl}/users/me/avatar`, {
      headers: this._headers,
      method: 'PATCH',
      body: JSON.stringify({ avatar })
    })
  }

  setUserData(name, job) {
    return this.customFetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
      method: 'PATCH',
      body: JSON.stringify({
        name: `${name}`,
        about: `${job}`
      })
    })
  } s
}

export const api = new Api({
  // baseUrl: "https://around.nomoreparties.co/v1/group-12",
  baseUrl: "https://around.students.nomoreparties.sbs",
  headers: {
    Authorization: "e3c1d69b-5d6d-4954-a353-d1cd5804394f",
    "Content-Type": "application/json"
  }
});

export default Api;