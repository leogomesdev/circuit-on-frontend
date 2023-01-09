export const environment = {
  production: false,
  envVar: {
    NG_APP_BACKEND_BASE_URL:
      process.env['NG_APP_BACKEND_BASE_URL'] || 'http://localhost:3000',
    NG_APP_IMAGE_CATEGORIES:
      process.env['NG_APP_IMAGE_CATEGORIES'] ||
      'CrossFit,Zumba,Glute Camp,HIIT Fitness,Sweat -40,CrossFit Kids,Private Session,Other',
    NG_APP_OKTA_ISSUER: process.env['NG_APP_OKTA_ISSUER'] || '',
    NG_APP_OKTA_CLIENT_ID: process.env['NG_APP_OKTA_CLIENT_ID'] || '',
    NG_APP_OKTA_REDIRECT_URI: process.env['NG_APP_OKTA_REDIRECT_URI'] || '',
    NG_APP_VIEW_PAGE_FUTURE_ITEMS:
      process.env['NG_APP_VIEW_PAGE_FUTURE_ITEMS'] || '4',
    NG_APP_LIST_PAGE_FUTURE_ITEMS:
      process.env['NG_APP_LIST_PAGE_FUTURE_ITEMS'] || '15',
    NG_APP_SCHEDULES_LIST_DISPLAY_ONLY_FUTURE:
      process.env['NG_APP_SCHEDULES_LIST_DISPLAY_ONLY_FUTURE'] || 'false',
  },
};
