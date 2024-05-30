const validateToken = (token: any) => {
  const payload = token.split(".")[1];
  if (payload) {
    try {
      const exp = JSON.parse(atob(payload)).exp;
      const now = new Date().getTime() / 1000;
      if (exp > now) {
        return true;
      }
      localStorage.removeItem("token");
      return false;
    } catch (error) {
      localStorage.removeItem("token");
      return false;
    }
  } else {
    localStorage.removeItem("token");
    return false;
  }
};

export { validateToken };
