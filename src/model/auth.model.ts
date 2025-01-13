export interface AuthFormData {
  username: string;
  password: string;
}

interface TokenDTO {
  token: string;
  expiresIn: string;
}

export interface AuthResponseData {
  access_token: TokenDTO;
  refresh_token: TokenDTO;
}