import { apiRoot, projectKey } from "./commercetoolsApiRoot";

function getProjectDetails() {
  return apiRoot.withProjectKey({ projectKey }).get().execute();
}

getProjectDetails().then((response) => console.log(response));

function getCustomers() {
  return apiRoot.withProjectKey({ projectKey }).customers().get().execute();
}

getCustomers().then((response) => console.log(response));
