class AuthService {
  getHeaders() {
    try {
      const headers = sessionStorage.getItem("headers");
      return headers && JSON.parse(headers);
    } catch {
      this.logout();
      return null;
    }
  }

  checkAuth() {
    return !!sessionStorage.getItem("loggedIn");
  }

  getUserInfo() {
    try {
      const userItem = sessionStorage.getItem("userInfo");
      return userItem && JSON.parse(userItem);
    } catch {
      this.logout();
      return null;
    }
  }

  login(loggedIn, token, headers, userInfo) {
    sessionStorage.setItem("loggedIn", loggedIn);
    sessionStorage.setItem("jwttoken", JSON.stringify(token));
    sessionStorage.setItem("headers", JSON.stringify(headers));
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
  }

  logout() {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.setItem("headers", "");
    sessionStorage.setItem("jwttoken", "");
    sessionStorage.setItem("userInfo", "");
    window.location.href = "/login";
  }

  hasAdminRole() {
    let userInfo = this.getUserInfo();
    if (!userInfo || !userInfo.roles) return false;
    let roles = userInfo.roles?.map((role) => role.roleName.toUpperCase());
    // if (roles.includes("ADMIN") || roles.includes("HR")) return true;
    if (roles.includes("ADMIN")) return true;
    else return false;
  }

  hasRecruiterRole() {
    let userInfo = this.getUserInfo();
    if (!userInfo || !userInfo.roles) return false;
    let roles = userInfo.roles.map((role) => role.roleName.toUpperCase());
    return roles.includes("RECRUITER") ? true : false;
  }

  hasHRRole() {
    let userInfo = this.getUserInfo();
    if (!userInfo || !userInfo.roles) return false;
    let roles = userInfo.roles.map((role) => role.roleName.toUpperCase());
    return roles.includes("HR") ? true : false;
  }

  hasBDManagerRole() {
    let userInfo = this.getUserInfo();
    if (!userInfo || !userInfo.roles) return false;
    let roles = userInfo.roles.map((role) => role.roleName.toUpperCase());
    return roles.includes("BUSINESS_DEV_MANAGER") ? true : false;
  }

  hasOperationsRole() {
    let userInfo = this.getUserInfo();
    if (!userInfo || !userInfo.roles) return false;
    let roles = userInfo.roles.map((role) => role.roleName.toUpperCase());
    return roles.includes("OPERATIONS") ? true : false;
  }

  isAdminOrOperations() {
    return this.hasAdminRole() || this.hasOperationsRole();
  }

  hasNoRoles() {
    let userInfo = this.getUserInfo();
    if (!userInfo || !userInfo.roles) return false;
    let roles = userInfo.roles.map((role) => role.roleName.toUpperCase());
    return roles.length === 0 ? true : false;
  }

  getUserId() {
    let userInfo = this.getUserInfo();
    return userInfo && userInfo.id;
  }

  // return disable flag: false to enable , true to disable
  canDelete(tabClassName) {
    if (this.hasAdminRole() || this.hasBDManagerRole()) return false;
    if (this.hasHRRole())
      return tabClassName === "onboardingTable" ? false : true;
    if (this.hasRecruiterRole())
      return tabClassName === "clientTable"
        ? true
        : tabClassName === "jobTable"
        ? true
        : false;

    return true;
  }

  canEdit(tabClassName) {
    if (this.hasAdminRole() || this.hasBDManagerRole()) return false;
    if (this.hasRecruiterRole())
      return tabClassName === "clientTable" ? true : "jobTable" ? true : false;
    if (this.hasHRRole())
      return tabClassName === "onboardingTable" ? false : true;
    if (this.hasOperationsRole())
      return tabClassName === "supplierTable"
        ? true
        : "visaTrackingTable"
        ? true
        : "rateCardTable"
        ? true
        : "workerTable"
        ? true
        : false;

    return true;
  }

  // token expiration check
  tokenValidity(token) {
    if (!token) return false;

    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) return false; // invalid structure

    const payloadBase64 = tokenParts[1];
    const payload = JSON.parse(atob(payloadBase64));
    if (payload.exp < Math.floor(Date.now() / 1000)) return false; // expired

    // Token is still valid
    return true;
  }
}



const auth = new AuthService();
export default auth;
