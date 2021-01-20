export interface IDecodedToken {
  [key: string]: any;
  id: number | string;
  username: string;
  roles: [string];
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
