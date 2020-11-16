import qs from 'qs';
import fetchlib from 'node-fetch';

function parseJSON(response) {
  return response.json();
}

function processData(data) {
  if (typeof data.success === 'boolean') {
    return data;
  }
  return {
    data,
    success: true,
  };
}

function catchError(e) {
  return {
    message: e,
    success: false,
  };
}

function getFetchLib() {
  return fetchlib;
}

function getPriveteHeader() {
  return {
    'Content-Type': 'application/json',
  };
}

const fetchPrivate = {
  post(url, data, options = {}, form = false) {
    let body;
    if (form) {
      body = data;
    } else {
      body = JSON.stringify({
        // utf8: '✓',
        ...data,
      });
    }
    return getFetchLib()(url, {
      headers: getPriveteHeader(),
      ...options,
      body,
      method: 'POST',
      credentials: 'include',
    })
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  patch(url, data, options = {}, form = false) {
    let body;
    if (form) {
      body = data;
    } else {
      body = JSON.stringify({
        // utf8: '✓',
        ...data,
      });
    }
    return getFetchLib()(url, {
      headers: getPriveteHeader(),
      ...options,
      body,
      method: 'PATCH',
      credentials: 'include',
    })
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  put(url, data, options = {}, form = false) {
    let body;
    if (form) {
      body = data;
    } else {
      body = JSON.stringify({
        // utf8: '✓',
        ...data,
      });
    }
    return getFetchLib()(url, {
      headers: getPriveteHeader(),
      ...options,
      body,
      method: 'PUT',
      credentials: 'include',
    })
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  delete(url, options = {}) {
    return getFetchLib()(url, {
      headers: getPriveteHeader(),
      ...options,
      method: 'DELETE',
      credentials: 'include',
    })
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  get(url, data, options = {}) {
    let queryUrl = url;
    if (data) {
      const params = qs.stringify({ ...data });
      queryUrl += `?${params}`;
    }
    return getFetchLib()(queryUrl, {
      headers: getPriveteHeader(),
      credentials: 'include',
      ...options,
      method: 'GET',
    })
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
};

function getHeader() {
  return {
    'Content-Type': 'application/json',
  };
}

const fetch = {
  private: fetchPrivate,
  post(url, data, options = {}, form = false) {
    let body;
    if (form) {
      body = data;
    } else {
      body = JSON.stringify({
        // utf8: '✓',
        ...data,
      });
    }
    return getFetchLib()(url, {
      headers: getHeader(),
      ...options,
      body,
      method: 'POST',
      credentials: 'include',
    })
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  patch(url, data, options = {}, form = false) {
    let body;
    if (form) {
      body = data;
    } else {
      body = JSON.stringify({
        // utf8: '✓',
        ...data,
      });
    }
    return getFetchLib()(url, {
      headers: getHeader(),
      ...options,
      body,
      method: 'PATCH',
      credentials: 'include',
    })
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  put(url, data, options = {}, form = false) {
    let body;
    if (form) {
      body = data;
    } else {
      body = JSON.stringify({
        // utf8: '✓',
        ...data,
      });
    }
    return getFetchLib()(url, {
      headers: getHeader(),
      ...options,
      body,
      method: 'PUT',
      credentials: 'include',
    })
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  delete(url, options = {}) {
    return getFetchLib()(url, {
      headers: getHeader(),
      ...options,
      method: 'DELETE',
      credentials: 'include',
    })
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  get(url, data, options = {}) {
    let queryUrl = url;
    if (data) {
      const params = qs.stringify({ ...data });
      queryUrl += `?${params}`;
    }
    return getFetchLib()(queryUrl, {
      headers: getHeader(),
      credentials: 'include',
      ...options,
      method: 'GET',
    })
      .then(parseJSON)
      .then(processData)
      .catch(catchError);
  },
  cleanGet(url) {
    return getFetchLib()(url, {
      headers: {},
      method: 'GET',
    })
      .then(parseJSON);
  },
};

export default fetch;
