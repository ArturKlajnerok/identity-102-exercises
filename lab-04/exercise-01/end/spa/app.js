const content = document.getElementById('content');
const navbar = document.getElementById('navbar-container');
const loadingIndicator = document.getElementById('loading-indicator');

// configuring the Auth0 library
const auth0Client = new Auth0Login({
  domain: 'labs102-bk.auth0.com',
  client_id: 'AT6YZLCKQu1llsqoE55TfEBHsITyvZIf'
});

window.onload = async function() {
  let requestedView = window.location.hash;

  if (requestedView === '#callback') {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, '/');
  } else {
    await auth0Client.init();
  }

  const authenticated = await auth0Client.isAuthenticated();
  await loadView('#navbar', navbar);

  if (requestedView === '' && !authenticated) requestedView = '#sign-in';
  if (requestedView === '' && authenticated) requestedView = '#profile';
  if (requestedView === '#sign-in' && authenticated) requestedView = '#profile';
  if (requestedView === '#callback' && authenticated) requestedView = '#profile';
  if (requestedView === '#callback' && !authenticated) requestedView = '#profile';
  await loadView(requestedView, content);
};

async function loadView(viewName, container) {
  container.innerHTML = '';
  viewName = viewName.substring(1);
  window.history.replaceState({}, document.title, `/#${viewName}`);
  const response = await fetch(`/views/${viewName}.html`);
  container.innerHTML = await response.text();

  var scriptTag = document.createElement('script');
  scriptTag.src = `/scripts/${viewName}.js`;

  container.appendChild(scriptTag);

  loadingIndicator.style.display = 'none';
  container.style.display = 'block';
}

async function restrictAccess() {
  if (!await auth0Client.isAuthenticated()) {
    await loadView('#sign-in');
    return false;
  }
  return true;
}
