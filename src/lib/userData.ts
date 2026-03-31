export const getUserDataParsed = () => {
  const data = localStorage.getItem('user_data');
  return data ? JSON.parse(data) : null;
};

export const setUserData = (data: any) => {
  localStorage.setItem('user_data', JSON.stringify(data));
};

export const getCurrentUsername = () => {
  const user = getUserDataParsed();
  return user?.username || 'admin';
};
