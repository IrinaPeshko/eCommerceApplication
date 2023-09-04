import {
  ClientBuilder,
  createAuthForPasswordFlow,
  createHttpClient,
} from "@commercetools/sdk-client-v2";
import { projectKey, httpMiddlewareOptions } from "./commercetoolsApiRoot";
import { MyTokenCache } from "./token/TokenCache";

import { IpasswordAuthMiddlewareOptions } from "../types/APIClient/APIClient";

export function createPasswordClient(
  email: string,
  password: string,
  tokenCache: MyTokenCache,
) {
  return {
    host: "https://auth.europe-west1.gcp.commercetools.com",
    projectKey: "ecommerceapplication",
    credentials: {
      clientId: "xWGHs96wClja2WK4pTe4sHuL",
      clientSecret: "ygIfusxYt5nEp1dB-K4Y-rcCMEReoCFG",
      user: {
        username: email,
        password,
      },
    },
    scopes: [`manage_project:${projectKey}`],
    tokenCache,
    fetch,
  };
}

export function createClient(
  passwordAuthMiddlewareOptions: IpasswordAuthMiddlewareOptions,
) {
  const client = new ClientBuilder()
    .withProjectKey(projectKey)
    .withMiddleware(createAuthForPasswordFlow(passwordAuthMiddlewareOptions))
    .withMiddleware(createHttpClient(httpMiddlewareOptions))
    .withUserAgentMiddleware()
    .build();
  return client;
}
