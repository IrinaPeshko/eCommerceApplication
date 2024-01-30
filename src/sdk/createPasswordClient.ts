import {
  ClientBuilder,
  createAuthForPasswordFlow,
  createHttpClient,
} from "@commercetools/sdk-client-v2";
import { projectKey, httpMiddlewareOptions } from "./commercetoolsApiRoot";
import { MyTokenCache } from "./token/TokenCache";

import {
  IAnonimeOptions,
  IpasswordAuthMiddlewareOptions,
} from "../types/APIClient/APIClient";

export function createPasswordClient(
  email: string,
  password: string,
  tokenCache: MyTokenCache
) {
  return {
    host: "https://auth.us-east-2.aws.commercetools.com",
    projectKey: "e-commerce-app",
    credentials: {
      clientId: "vYFp38vqtvN7tDsiIhRV9GOB",
      clientSecret: "KfKjtdbrjrOJPO4FsdmkJSRTNcnU4evW",
      user: {
        username: email,
        password,
      },
    },
    scopes: [`manage_project:${projectKey}`],
    // scopes: [
    //   "manage_project:e-commerce-app manage_api_clients:e-commerce-app view_api_clients:e-commerce-app view_audit_log:e-commerce-app",
    // ],
    tokenCache,
    fetch,
  };
}

export function createClient(
  passwordAuthMiddlewareOptions: IpasswordAuthMiddlewareOptions
) {
  const client = new ClientBuilder()
    .withProjectKey(projectKey)
    .withMiddleware(createAuthForPasswordFlow(passwordAuthMiddlewareOptions))
    .withMiddleware(createHttpClient(httpMiddlewareOptions))
    .withUserAgentMiddleware()
    .build();
  return client;
}

export function createAnonimusFlow(tokenCache: MyTokenCache) {
  return {
    host: "https://auth.us-east-2.aws.commercetools.com",
    projectKey: "e-commerce-app",
    credentials: {
      clientId: "vYFp38vqtvN7tDsiIhRV9GOB",
      clientSecret: "KfKjtdbrjrOJPO4FsdmkJSRTNcnU4evW",
    },
    scopes: [`manage_project:${projectKey}`],
    // scopes: [
    //   "manage_project:e-commerce-app manage_api_clients:e-commerce-app view_api_clients:e-commerce-app view_audit_log:e-commerce-app",
    // ],
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
