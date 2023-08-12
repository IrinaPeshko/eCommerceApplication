export default interface Ilink {
  name: string;
  classList?: string[];
  innerHTML?: string;
  callback: () => void;
}
