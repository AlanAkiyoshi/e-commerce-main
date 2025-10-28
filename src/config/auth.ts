const object = {
  secret_token: process.env.JWT_SECRET,
  expire_in_token: "10m",
};

export default object;
