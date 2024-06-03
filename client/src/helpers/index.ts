const validateToken = (token: string): boolean => {
  const payload = token.split(".")[1];
  if (payload) {
    try {
      const decodedPayload = JSON.parse(atob(payload));
      const exp = decodedPayload.exp;
      const now = new Date().getTime() / 1000;
      if (exp > now) {
        return true;
      } else {
        console.error("Token has expired.");
      }
    } catch (error) {
      console.error("Error parsing token payload:", error);
    }
  }
  localStorage.removeItem("token");
  return false;
};

export { validateToken };
