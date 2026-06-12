export const ROLES = {
  USER: 'user',
  THEATRE_OWNER: 'theatre_owner',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  user: 'User',
  theatre_owner: 'Theatre Owner',
  admin: 'Administrator',
};

export const isUserRole = (role) => role === ROLES.USER;
export const isTheatreOwner = (role) => role === ROLES.THEATRE_OWNER;
export const isAdmin = (role) => role === ROLES.ADMIN;

export const getDashboardPath = (role) => {
  switch (role) {
    case ROLES.USER:
      return '/user/dashboard';
    case ROLES.THEATRE_OWNER:
      return '/theatre/dashboard';
    case ROLES.ADMIN:
      return '/admin/dashboard';
    default:
      return '/login';
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const truncateText = (text, length = 100) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
