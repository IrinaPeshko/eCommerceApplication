interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

export function getCategoryPath(
  selectedCategoryId: string,
  categories: Record<string, Category>,
): string {
  const selectedCategory = categories[selectedCategoryId];

  if (!selectedCategory) {
    return "";
  }

  const path: Category[] = [selectedCategory];
  let { parentId } = selectedCategory;
  while (parentId) {
    const parentCategory = categories[parentId];
    if (parentCategory) {
      path.unshift(parentCategory);
      parentId = parentCategory.parentId;
    } else {
      break;
    }
  }

  return path.map((category) => category.name).join(" / ");
}
