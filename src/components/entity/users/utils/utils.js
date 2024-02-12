export const filterUsersByRole = (users, role) => {
  return users.filter((user) => user.roles[0].roleName.toLowerCase() === role);
};
