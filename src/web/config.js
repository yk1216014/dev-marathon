const getApiUrl = () => {
  const path = window.location.pathname;
  // If we are in a subdirectory (customer, case, negotiation), go up one level
  if (path.includes('/customer/') || path.includes('/case/') || path.includes('/negotiation/')) {
    return '..';
  }
  // Otherwise (root), use current directory
  return '.';
};

const config = {
  apiUrl: getApiUrl()
};

export default config;