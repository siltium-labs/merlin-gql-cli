export interface IDecodedToken {
  id: number;
  username: string;
  role: string;
}

export interface IGqlContext {
  user?: IDecodedToken;
}

export class GqlContext implements IGqlContext {
  user?: IDecodedToken;

  constructor(user?: IDecodedToken) {
    this.user = user;
  }
}
