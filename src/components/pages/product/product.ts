import Swiper from "swiper";
import { getProduct } from "../../../sdk/sdk";
import Popap from "../../popap/popap";
import {
  productPageSwiperMainSetting,
  productPageSwiperPopapSetting,
} from "../../slider/swiper";
import { productPopap } from "./productPopap";
import { ProductControl } from "./productControl";
import { ProductData } from "./productData";

export class Product {
  private static DOM = {
    get quantityMinus() {
      return document.querySelector(".product_quantity__minus");
    },
    get quantityPlus() {
      return document.querySelector(".product_quantity__plus");
    },
    get quantityNum() {
      return document.querySelector(".product_quantity__num");
    },
    get currentSku() {
      const skuBox = document.querySelector(".sku_value");
      if (!skuBox) throw new Error("skuBox is not found");
      const value = skuBox.textContent;
      return value;
    },
  };

  public static async init(keyData = "") {
    let key = keyData;
    if (key === "") {
      key = Product.checkURL();
    }

    const resp = (await getProduct(key)).body;
    const DOM = {
      imgs: document.querySelector(".product_page__slider-main"),
      sliderMain: document.querySelector(".product_page__slider-main"),
      productBreadcrumbs: document.querySelector(".breadcrumbs li:last-child"),
      name: document.querySelector(".product_page__name"),
      brend: document.querySelector(".product_page__brand .value"),
      colorBox: document.querySelector(".product_page__color"),
      color: document.querySelector(
        ".product_page__color .product_item__value",
      ),
      sizes: document.querySelector(".product_page__items.sizes"),
      quantityNum: document.querySelector(".product_quantity__num"),
      startPrise: document.querySelector(".sizes__item.product_page__prise"),
      salePrise: document.querySelector(".product_page__sale_prise"),
      description: document.querySelector(".product_deail__description"),
      sku: document.querySelector(".sku_value"),
      addBagBtn: document.querySelector(".product_page__btn.bag"),
    };

    const data = new ProductData(resp);

    const productPageSwiperMain = new Swiper(
      ".product_page__swiper-main",
      productPageSwiperMainSetting,
    );
    Product.createSlides(data.slides, productPageSwiperMain);

    Product.clickSlide(DOM.sliderMain, data.slidesPopap, productPageSwiperMain);

    Product.showContent(DOM.name, data.name);
    Product.showContent(DOM.productBreadcrumbs, data.name);

    Product.showContent(DOM.brend, data.mainAttrubutes.brend);

    Product.showContent(DOM.color, data.mainAttrubutes.color);
    if (
      data.mainAttrubutes.color === "" &&
      DOM.colorBox &&
      DOM.colorBox instanceof HTMLElement
    ) {
      DOM.colorBox.style.display = "none";
    }
    Product.createSizes(
      DOM.sizes,
      data.mainAttrubutes,
      data.variantAttrubutes,
      data.skuArr,
    );
    Product.clickSizes(DOM.sizes, DOM.sku);
    Product.showContent(DOM.startPrise, data.startPrice);
    Product.showContent(DOM.salePrise, data.salePrice);
    Product.checkPrice(DOM.startPrise, DOM.salePrise);
    Product.showContent(DOM.description, data.description);
    Product.showContent(DOM.sku, data.skuArr[0]);
    Product.clickAddBagBtn(DOM.addBagBtn, DOM.quantityNum);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const productControl = new ProductControl(
      this.DOM.quantityPlus,
      this.DOM.quantityNum,
      this.DOM.quantityMinus,
      this.DOM.currentSku,
    );
  }

  private static checkURL() {
    const value = window.location.href.split("/").slice(-1).join("");
    if (value.startsWith("product__")) {
      return value.replace("product__", "");
    }
    return "";
  }

  private static createSlides(
    slideContent: HTMLElement[] | undefined,
    slider: Swiper,
  ) {
    if (slideContent === undefined) return;
    const slides = slideContent?.map((el) => {
      const box = document.createElement("div");
      box.classList.add("swiper-slide");
      box.append(el);
      return box;
    });
    if (slides !== undefined) {
      slider.appendSlide(slides);
    }
  }

  private static clickSlide(
    slider: Element | null,
    data: HTMLElement[] | undefined,
    mainSlider: Swiper | Swiper[] | undefined,
  ) {
    slider?.addEventListener("click", (e) => {
      if (
        e.target instanceof HTMLElement &&
        e.target.classList.contains("product_page__img") &&
        mainSlider !== undefined &&
        mainSlider instanceof Swiper
      ) {
        const activeSlide = mainSlider.activeIndex;
        productPageSwiperPopapSetting.initialSlide = activeSlide;

        Popap.open(productPopap);
        const productPageSwiperPopap = new Swiper(
          ".product_page__swiper-popap",
          productPageSwiperPopapSetting,
        );
        productPageSwiperPopap.update();
        Product.createSlides(data, productPageSwiperPopap);
        productPageSwiperPopap.controller.control = mainSlider;
      }
    });
  }

  private static showContent(domEl: Element | null, data: string | undefined) {
    if (!(domEl instanceof HTMLElement) || !domEl) return;
    if (data === undefined) {
      domEl.textContent = "";
      return;
    }
    domEl.textContent = data;
  }

  private static createSizes(
    box: Element | null,
    main: { color: string; size: string; brend: string; prise: string },
    variant: { color: string; size: string; brend: string; prise: string }[],
    skuArr: (string | undefined)[],
  ) {
    if (!box) return;
    const elements = [main, ...variant];
    if (elements.length === 0 && box.parentElement instanceof HTMLElement) {
      box.parentElement.style.display = "none";
    }
    elements.forEach((attributes, index) => {
      const el = document.createElement("li");
      if (skuArr[index] !== undefined) {
        el.setAttribute("sku", `${skuArr[index]}`);
      }
      el.classList.add("sizes__item");
      if (index === 0) {
        el.classList.add("active");
      }
      el.textContent = attributes.size;
      box.append(el);
    });
  }

  private static checkPrice(priseBox: Element | null, saleBox: Element | null) {
    if (!priseBox && !saleBox) return;
    if (saleBox?.textContent === "" && priseBox?.classList.contains("sale")) {
      priseBox?.classList.remove("sale");
    } else if (!priseBox?.classList.contains("sale")) {
      priseBox?.classList.add("sale");
    }
  }

  private static clickSizes(box: Element | null, skuBox: Element | null) {
    if (!(box instanceof HTMLElement)) return;
    box.addEventListener("click", (e) => {
      if (
        !box ||
        !(e.target instanceof HTMLElement) ||
        !e.target.classList.contains("sizes__item") ||
        !(box instanceof HTMLElement)
      )
        return;
      Array.from(box.getElementsByClassName("sizes__item")).forEach((el) => {
        if (el.classList.contains("active")) el.classList.remove("active");
      });
      if (!e.target.classList.contains("active"))
        e.target.classList.add("active");
      const skuValue = e.target.getAttribute("sku");
      if (skuBox && skuValue) {
        skuBox.textContent = skuValue;
      }
    });
  }

  private static clickAddBagBtn(
    btn: Element | null,
    quantityNum: Element | null,
  ) {
    if (!btn || !(quantityNum instanceof HTMLInputElement)) return;
    btn.addEventListener("click", () => {
      if (quantityNum && btn.classList.contains("remove")) {
        quantityNum.value = `0`;
      }
      btn.classList.toggle("remove");
    });
  }

  private static getElemText(box: Element | null) {
    if (box) {
      return box.textContent;
    }
    return "";
  }
}
