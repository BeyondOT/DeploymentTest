export interface UserLogin {
  email: string;
  password: string;
}

export interface IUserLoginResponse {
  token: string;
  emailFr: string;
  emailEn: string;
  passwordFr: string;
  passwordEn: string;
  error: boolean;
  message: string;
}

export interface UserRegister {
  pseudo: string;
  email: string;
  password: string;
}

export interface IUserRegisterResponse{
  pseudoFr: string;
  pseudoEn: string;
  emailFr: string;
  emailEn: string;
  passwordFr: string;
  passwordEn: string;
  error: boolean;
  message: string;
}
