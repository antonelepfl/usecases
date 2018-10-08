
import { JSO } from 'jso';

import store from './store';

const clientId = '74b1a180-3646-45ac-b53c-ebd905cec418';
const authUrl = 'https://services.humanbrainproject.eu/oidc/authorize';

const client = new JSO({
  client_id: clientId,
  redirect_uri: `${window.location.href}/`,
  authorization: authUrl,
  response_type: 'id_token token',
});

function init() {
  client.callback();

  const authorization = client.getToken();
  authorization.then((session) => {
    store.setToken(session.access_token);
    redirectToUseCases();
  });

  return authorization;
}

function redirectToUseCases() {
  if (window.location.href.includes('access_token')) {
    const urlParts = window.location.href.split('/');
    urlParts.splice(-1,1);
    window.location.href = urlParts.join('/');
  }
}

export default {
  init,
};
