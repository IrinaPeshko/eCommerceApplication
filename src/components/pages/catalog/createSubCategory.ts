export function createSubCategory(key: string, name: string) {
  const subItem = document.createElement("li");
  subItem.classList.add("catalog__breadcrumbs-item");
  subItem.setAttribute("key", key);
  subItem.innerHTML = `<a class="catalog__breadcrumbs-link" key="${key}">${name}</a>`;
  return subItem;
}
