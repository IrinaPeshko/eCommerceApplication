import {
  ClientBuilder,
  createAuthForClientCredentialsFlow,
  createHttpClient,
} from "@commercetools/sdk-client-v2";
import {
  createApiBuilderFromCtpClient,
  ApiRoot,
} from "@commercetools/platform-sdk";

export const projectKey = "e-commerce-app";
export const authMiddlewareOptions = {
  host: "https://auth.us-east-2.aws.commercetools.com",
  projectKey: "e-commerce-app",
  credentials: {
    clientId: "bH_y4pxzkq8a8Ct-i3GnIa8t",
    clientSecret: "ACxqivGsGGfpqYEhBJDnrm3mE85ukSFn",
  },
  scopes: [`manage_project:${projectKey}`],
  // scopes: [
  //   "manage_project:e-commerce-app manage_api_clients:e-commerce-app view_api_clients:e-commerce-app view_audit_log:e-commerce-app",
  // ],
  fetch,
};

export const httpMiddlewareOptions = {
  host: "https://api.us-east-2.aws.commercetools.com",
  fetch,
};

const client = new ClientBuilder()
  .withProjectKey(projectKey)
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
