const EXPIRES=8;
class Session{
  #name;
  #token;
  #role;
  constructor(){
    this.#name=$.cookie('name');
    this.#role=$.cookie('role');
    this.#token=$.cookie('token');
  }

  set name(name){
    this.#name=name;
    $.cookie('name', name,{expires: EXPIRES});
  }

  set role(role){
    this.#role=role;
    $.cookie('role', role,{expires: EXPIRES});
  }

  set token(token){
    this.#token=token;
    $.cookie('tokenv', token,{expires: EXPIRES});
  }

  logout(){
    this.#name=undefined;
    this.#role=undefined;
    this.#token=undefined;
    $.removeCookie('name');
    $.removeCookie('role');
    $.removeCookie('token');
    axios.defaults.headers.common['Authorization'] = '';
  }
}

export default new Session();