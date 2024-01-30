import {
  ClientBuilder,
  createAuthForClientCredentialsFlow,
  createHttpClient,
} from "@commercetools/sdk-client-v2";
import {
  createApiBuilderFromCtpClient,
  ApiRoot,
} from "@commercetools/platform-sdk";
import {
  CTP_API_URL,
  CTP_AUTH_URL,
  CTP_CLIENT_ID,
  CTP_CLIENT_SECRET,
  CTP_PROJECT_KEY,
} from "../../env";

export const projectKey = CTP_PROJECT_KEY;
export const authMiddlewareOptions = {
  host: CTP_AUTH_URL,
  projectKey: CTP_PROJECT_KEY,
  credentials: {
    clientId: CTP_CLIENT_ID,
    clientSecret: CTP_CLIENT_SECRET,
  },
  scopes: [`manage_project:${CTP_PROJECT_KEY}`],
  fetch,
};

export const httpMiddlewareOptions = {
  host: CTP_API_URL,
  fetch,
};

const client = new ClientBuilder()
  .withProjectKey(CTP_PROJECT_KEY)
  .withMiddleware(createAuthForClientCredentialsFlow(authMiddlewareOptions))
  .withMiddleware(createHttpClient(httpMiddlewareOptions))
  .withUserAgentMiddleware()
  .build();

const anonimusClient = new ClientBuilder()
  .withAnonymousSessionFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();
export const apiRoot: ApiRoot = createApiBuilderFromCtpClient(client);
export const anonimusApiRoot: ApiRoot =
  createApiBuilderFromCtpClient(anonimusClient);
