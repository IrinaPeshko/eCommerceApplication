import {
  ClientBuilder,
  createAuthForClientCredentialsFlow,
  createHttpClient,
} from "@commercetools/sdk-client-v2";
import {
  createApiBuilderFromCtpClient,
  ApiRoot,
} from "@commercetools/platform-sdk";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const projectKey = process.env.CTP_PROJECT_KEY || "";
const authMiddlewareOptions = {
  host: process.env.CTP_AUTH_URL || "",
  projectKey,
  credentials: {
    clientId: process.env.CTP_CLIENT_ID || "",
    clientSecret: process.env.CTP_CLIENT_SECRET || "",
  },
  oauthUri: process.env.adminAuthUrl || "",
  scopes: [`manage_project:${projectKey}`],
  fetch,
};

const httpMiddlewareOptions = {
  host: process.env.CTP_API_URL || "",
  fetch,
};

const client = new ClientBuilder()
  .withProjectKey(projectKey)
  .withMiddleware(createAuthForClientCredentialsFlow(authMiddlewareOptions))
  .withMiddleware(createHttpClient(httpMiddlewareOptions))
  .withUserAgentMiddleware()
  .build();

const apiRoot: ApiRoot = createApiBuilderFromCtpClient(client);

export { apiRoot, projectKey, ApiRoot };
