import { GitHub } from "arctic";

interface CreateGithubOauthArgs {
  clientId: string;
  clientSecret: string;
}

export function createGithubOauth(args: CreateGithubOauthArgs) {
  return new GitHub(args.clientId, args.clientSecret);
}
