export function createSubCategory(key: string, name: string) {
  const submenu = document.createElement("ul");
  submenu.classList.add("catalog__breadcrumbs__submenu");
  submenu.innerHTML = `
    <li class="catalog__breadcrumbs-item" key="${key}">
      <a class="catalog__breadcrumbs-link" key="${key}">${name}</a>
    </li>`;
  return submenu;
}
