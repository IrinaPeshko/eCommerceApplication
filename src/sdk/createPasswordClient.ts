import {
  ClientBuilder,
  createAuthForPasswordFlow,
  createHttpClient,
} from "@commercetools/sdk-client-v2";
import { httpMiddlewareOptions } from "./commercetoolsApiRoot";
import { MyTokenCache } from "./token/TokenCache";

import {
  IAnonimeOptions,
  IpasswordAuthMiddlewareOptions,
} from "../types/APIClient/APIClient";
import {
  CTP_AUTH_URL,
  CTP_CLIENT_ID,
  CTP_CLIENT_SECRET,
  CTP_PROJECT_KEY,
} from "../../env";

export function createPasswordClient(
  email: string,
  password: string,
  tokenCache: MyTokenCache,
) {
  return {
    host: CTP_AUTH_URL,
    projectKey: CTP_PROJECT_KEY,
    credentials: {
      clientId: CTP_CLIENT_ID,
      clientSecret: CTP_CLIENT_SECRET,
      user: {
        username: email,
        password,
      },
    },
    scopes: [`manage_project:${CTP_PROJECT_KEY}`],
    tokenCache,
    fetch,
  };
}

export function createClient(
  passwordAuthMiddlewareOptions: IpasswordAuthMiddlewareOptions,
) {
  const client = new ClientBuilder()
    .withProjectKey(CTP_PROJECT_KEY)
    .withMiddleware(createAuthForPasswordFlow(passwordAuthMiddlewareOptions))
    .withMiddleware(createHttpClient(httpMiddlewareOptions))
    .withUserAgentMiddleware()
    .build();
  return client;
}

export function createAnonimusFlow(tokenCache: MyTokenCache) {
  return {
    host: CTP_AUTH_URL,
    projectKey: CTP_PROJECT_KEY,
    credentials: {
      clientId: CTP_CLIENT_ID,
      clientSecret: CTP_CLIENT_SECRET,
    },
    scopes: [`manage_project:${CTP_PROJECT_KEY}`],
    tokenCache,
    fetch,
  };
}
export function createAnonimusClient(anonimeOptions: IAnonimeOptions) {
  const anonimusClient = new ClientBuilder()
    .withAnonymousSessionFlow(anonimeOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();
  return anonimusClient;
}
