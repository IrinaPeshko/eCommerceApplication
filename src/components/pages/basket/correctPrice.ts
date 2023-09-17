export function correctPrice(price: number, fractiondigits: number): number {
    const formattedPrice = Number((price / 10 ** fractiondigits).toFixed(2));
    return formattedPrice;
}
export function totalPrice(price: number, fractiondigits: number, currencyCode: string) {
    const totalElem: HTMLSpanElement | null = document.querySelector(".cart__total-price");
    const formattedPrice = correctPrice(price, fractiondigits);
    if (totalElem) {
        totalElem.innerText = `${formattedPrice} ${currencyCode}`;
    }
}