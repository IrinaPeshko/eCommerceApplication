import { apiRoot, projectKey } from "./commercetoolsApiRoot";

export function getProjectDetails() {
  return apiRoot.withProjectKey({ projectKey }).get().execute();
}

export function getCustomers() {
  return apiRoot.withProjectKey({ projectKey }).customers().get().execute();
}
