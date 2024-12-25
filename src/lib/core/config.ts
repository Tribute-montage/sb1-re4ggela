export const APP_CONFIG = {
  siteUrl: 'https://warm-bienenstitch-5f26b3.netlify.app',
  maxUploadSize: 10 * 1024 * 1024, // 10MB
  supportedFileTypes: {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    video: ['video/mp4', 'video/quicktime']
  },
  routes: {
    auth: {
      login: '/login',
      register: '/register',
      resetPassword: '/reset-password',
      adminLogin: '/admin/login'
    },
    client: {
      dashboard: '/dashboard',
      orders: '/orders'
    },
    admin: {
      dashboard: '/admin',
      orders: '/admin/orders'
    }
  }
};