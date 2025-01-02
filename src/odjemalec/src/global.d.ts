declare global {
  interface Window {
    hj: (type: string, action: string) => void;
  }
}
