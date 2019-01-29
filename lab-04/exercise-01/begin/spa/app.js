const content = document.getElementById('content');
const navbar = document.getElementById('navbar-container');
const loadingIndicator = document.getElementById('loading-indicator');

window.onload = async function() {
  let requestedView = window.location.hash;

  const authenticated = false;
  await loadView('#navbar', navbar);

  if (requestedView === '' && !authenticated) requestedView = '#home';
  if (requestedView === '' && authenticated) requestedView = '#profile';
  if (requestedView === '#home' && authenticated) requestedView = '#profile';
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

async function allowAccess() {
  await loadView('#home', content);
  return false;
}
