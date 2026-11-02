export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api', // Local development ASP.NET Core Web API base URL
  authEnabled: false, // Centralized feature flag: Login and Registration disabled for now
  useMockData: true // Serves mock data matching database seed until API endpoints are connected
};
