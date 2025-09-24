export const register = async (payload) => {
  return { message: "register ok", payload };
};

export const login = async (payload) => {
  return { message: "login ok", token: "fake.jwt.token", payload };
};

export const logout = async () => {
  return { message: "logout ok" };
};
