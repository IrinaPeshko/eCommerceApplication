export default interface Ilink {
  name: string;
  classList?: string[];
  innerHTML?: string;
  href?: string;
  callback: () => void;
}
