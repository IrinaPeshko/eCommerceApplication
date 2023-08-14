import fetch from "node-fetch";
import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from "@commercetools/sdk-client-v2";

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: "https://auth.europe-west1.gcp.commercetools.com",
  projectKey: "ecommerceapplication",
  credentials: {
    clientId: "nAc-S1gTUvsGohvKH7geDjN8",
    clientSecret: "CJSx--7V5xWFjSlGFZgo1BIeCCV3-zFS",
  },
  scopes: [
    "view_product_selections:ecommerceapplication manage_my_shopping_lists:ecommerceapplication view_cart_discounts:ecommerceapplication view_types:ecommerceapplication view_attribute_groups:ecommerceapplication view_categories:ecommerceapplication view_products:ecommerceapplication create_anonymous_token:ecommerceapplication manage_my_payments:ecommerceapplication view_discount_codes:ecommerceapplication view_shipping_methods:ecommerceapplication manage_my_orders:ecommerceapplication manage_my_profile:ecommerceapplication view_standalone_prices:ecommerceapplication view_stores:ecommerceapplication",
  ],
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: "https://api.europe-west1.gcp.commercetools.com",
  fetch,
};

// Export the ClientBuilder
export const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();
