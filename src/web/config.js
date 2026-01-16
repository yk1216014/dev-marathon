const getApiUrl = () => {
  const host = window.location.hostname;
  const path = window.location.pathname;

  // Local environment (Docker/localhost)
  if (host === 'localhost' || host === '127.0.0.1') {
    return '';
  }

  // Staging environment: Path is like /kento_yokoyama/customer/...
  // We need to construct the API URL as /api_kento_yokoyama
  const parts = path.split('/');
  if (parts.length > 1 && parts[1]) {
    const username = parts[1];
    return `/api_${username}`;
  }

  // Fallback
  return '';
};

const config = {
  apiUrl: getApiUrl()
};

export default config;