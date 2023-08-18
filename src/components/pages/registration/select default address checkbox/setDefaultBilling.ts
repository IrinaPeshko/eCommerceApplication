export default function setBillingDefault(): void {
  const defaultBillingCheckbox = document.getElementById(
    "default_billing_checkbox",
  ) as HTMLInputElement;
  const defaultShippingCheckbox = document.getElementById(
    "default_shipping_checkbox",
  ) as HTMLInputElement;
  const billingStreet = document.getElementById(
    "billing_street",
  ) as HTMLInputElement;
  const billingBuilding = document.getElementById(
    "billing_building",
  ) as HTMLInputElement;
  const billingApartment = document.getElementById(
    "billing_apartment",
  ) as HTMLInputElement;
  const billingCity = document.getElementById(
    "billing_city",
  ) as HTMLInputElement;
  const billingPostalCode = document.getElementById(
    "billing_postal_code",
  ) as HTMLInputElement;
  const billingCountry = document.getElementById(
    "billing_country",
  ) as HTMLSelectElement;
  const shippingStreet = document.getElementById(
    "shipping_street",
  ) as HTMLInputElement;
  const shippingBuilding = document.getElementById(
    "shipping_building",
  ) as HTMLInputElement;
  const shippingApartment = document.getElementById(
    "shipping_apartment",
  ) as HTMLInputElement;
  const shippingCity = document.getElementById(
    "shipping_city",
  ) as HTMLInputElement;
  const shippingPostalCode = document.getElementById(
    "shipping_postal_code",
  ) as HTMLInputElement;
  const shippingCountry = document.getElementById(
    "shipping_country",
  ) as HTMLSelectElement;

  if (
    defaultBillingCheckbox instanceof HTMLInputElement &&
    defaultShippingCheckbox instanceof HTMLInputElement &&
    shippingStreet instanceof HTMLInputElement &&
    shippingBuilding instanceof HTMLInputElement &&
    shippingApartment instanceof HTMLInputElement &&
    shippingCity instanceof HTMLInputElement &&
    shippingPostalCode instanceof HTMLInputElement &&
    shippingCountry instanceof HTMLSelectElement &&
    billingStreet instanceof HTMLInputElement &&
    billingBuilding instanceof HTMLInputElement &&
    billingApartment instanceof HTMLInputElement &&
    billingCity instanceof HTMLInputElement &&
    billingPostalCode instanceof HTMLInputElement &&
    billingCountry instanceof HTMLSelectElement
  ) {
    if (defaultBillingCheckbox.checked) {
      shippingStreet.value = billingStreet.value;
      shippingBuilding.value = billingBuilding.value;
      shippingApartment.value = billingApartment.value;
      shippingCity.value = billingCity.value;
      shippingPostalCode.value = billingPostalCode.value;
      shippingCountry.value = billingCountry.value;

      shippingStreet.disabled = true;
      shippingBuilding.disabled = true;
      shippingApartment.disabled = true;
      shippingCity.disabled = true;
      shippingPostalCode.disabled = true;
      shippingCountry.disabled = true;

      defaultShippingCheckbox.disabled = true;
    } else {
      shippingStreet.disabled = false;
      shippingBuilding.disabled = false;
      shippingApartment.disabled = false;
      shippingCity.disabled = false;
      shippingPostalCode.disabled = false;
      shippingCountry.disabled = false;

      defaultShippingCheckbox.disabled = false;
    }
  }
}
