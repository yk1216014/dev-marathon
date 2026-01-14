const getApiUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Use current origin (e.g. http://127.0.0.1:5465) to ensure port matching
    return window.location.origin;
  }
  // Staging environment: extract username from path
  const pathParts = window.location.pathname.split('/');
  // Expected path format: /username/customer/... -> username is at index 1
  const username = pathParts[1];
  return `/api_${username}`;
};

const config = {
  apiUrl: getApiUrl()
};

export default config;