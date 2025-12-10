class UserSession {
  info = $state<{
    authorized: boolean;
  }>({
    authorized: false,
  });

  parseInfoFromLocalStorage() {
    const data = localStorage.getItem("ssh_token");
    if (!data) return;
    this.info.authorized = true;
  }
}

const userSession = new UserSession();
export default userSession;
