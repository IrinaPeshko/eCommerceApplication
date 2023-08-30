export function createColorFilterStr() {
  const yellowCheckbox = document.getElementById("yellow__checkbox");
  const redCheckbox = document.getElementById("red__checkbox");
  const blueCheckbox = document.getElementById("blue__checkbox");
  const blackCheckbox = document.getElementById("black__checkbox");

  const str = "variants.attributes.color.key:";
  const paramsColor: string[] = [];
  if (
    yellowCheckbox instanceof HTMLInputElement &&
    redCheckbox instanceof HTMLInputElement &&
    blueCheckbox instanceof HTMLInputElement &&
    blackCheckbox instanceof HTMLInputElement
  ) {
    if (yellowCheckbox.checked) {
      paramsColor.push('"color-yellow"');
    }
    if (blackCheckbox.checked) {
      paramsColor.push('"color-black"');
    }
    if (redCheckbox.checked) {
      paramsColor.push('"color-red"');
    }
    if (blueCheckbox.checked) {
      paramsColor.push('"color-blue"');
    }
  }
  if (paramsColor.length !== 0) {
    const paramsStr = paramsColor.join(",");
    return str + paramsStr;
  }
  return undefined;
}

export function createBrendFilterStr() {
  const pradaCheckbox = document.getElementById("prada__checkbox");
  const diorCheckbox = document.getElementById("dior__checkbox");
  const chanelCheckbox = document.getElementById("chanel__checkbox");

  const str = "variants.attributes.brend.key:";
  const paramsColor: string[] = [];
  if (
    pradaCheckbox instanceof HTMLInputElement &&
    diorCheckbox instanceof HTMLInputElement &&
    chanelCheckbox instanceof HTMLInputElement
  ) {
    if (pradaCheckbox.checked) {
      paramsColor.push('"prada"');
    }
    if (diorCheckbox.checked) {
      paramsColor.push('"dior"');
    }
    if (chanelCheckbox.checked) {
      paramsColor.push('"chanel"');
    }
  }
  if (paramsColor.length !== 0) {
    const paramsStr = paramsColor.join(",");
    return str + paramsStr;
  }
  return undefined;
}

export function createSizeFilterStr() {
  const smallCheckbox = document.getElementById("small__checkbox");
  const mediumCheckbox = document.getElementById("medium__checkbox");
  const largeCheckbox = document.getElementById("large__checkbox");

  const str = "variants.attributes.size.key:";
  const paramsColor: string[] = [];
  if (
    smallCheckbox instanceof HTMLInputElement &&
    mediumCheckbox instanceof HTMLInputElement &&
    largeCheckbox instanceof HTMLInputElement
  ) {
    if (smallCheckbox.checked) {
      paramsColor.push('"CS-01-S"');
    }
    if (mediumCheckbox.checked) {
      paramsColor.push('"CS-01-M"');
    }
    if (largeCheckbox.checked) {
      paramsColor.push('"CS-01-L"');
    }
  }
  if (paramsColor.length !== 0) {
    const paramsStr = paramsColor.join(",");
    return str + paramsStr;
  }
  return undefined;
}

export function createPriceFilterStr() {
  const cheapCheckbox = document.getElementById("cheap__checkbox");
  const mediumCheckbox = document.getElementById("mediumPrice__checkbox");
  const expenciveCheckbox = document.getElementById("expencive__checkbox");

  const str = "variants.attributes.price.key:";
  const paramsColor: string[] = [];
  if (
    cheapCheckbox instanceof HTMLInputElement &&
    mediumCheckbox instanceof HTMLInputElement &&
    expenciveCheckbox instanceof HTMLInputElement
  ) {
    if (cheapCheckbox.checked) {
      paramsColor.push('"cheap"');
    }
    if (mediumCheckbox.checked) {
      paramsColor.push('"medium"');
    }
    if (expenciveCheckbox.checked) {
      paramsColor.push('"expencive"');
    }
  }
  if (paramsColor.length !== 0) {
    const paramsStr = paramsColor.join(",");
    return str + paramsStr;
  }
  return undefined;
}
