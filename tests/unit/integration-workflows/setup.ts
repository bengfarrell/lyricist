import { beforeEach } from 'vitest';

// Mock localStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

global.localStorage = localStorageMock as Storage;

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

// Mock navigator.clipboard for copy tests
Object.assign(navigator, {
  clipboard: {
    writeText: (text: string) => Promise.resolve(),
  },
});

// Mock URL.createObjectURL for export tests
global.URL.createObjectURL = () => 'mock-url';
global.URL.revokeObjectURL = () => {};

// Mock document.createElement for download links
const originalCreateElement = document.createElement.bind(document);
document.createElement = (tagName: string, ...args: any[]) => {
  const element = originalCreateElement(tagName, ...args);
  if (tagName === 'a') {
    element.click = () => {}; // Mock click for downloads
  }
  return element;
};

