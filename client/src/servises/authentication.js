const authentication = {
  async loginReq() {
    const res = await fetch(`http://localhost:3000/login`);
    console.log(res);
  },
};

export default authentication;
