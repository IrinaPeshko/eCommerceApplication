export default interface Param {
  tag: string;
  classNames: string[];
  textContent: string;
  callback?: (params: MouseEvent) => void;
}
