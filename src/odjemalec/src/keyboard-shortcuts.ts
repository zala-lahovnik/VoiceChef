const navigateTo = (url: string) => {
  window.location.href = url;
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.altKey) {
    switch (event.key.toLowerCase()) {
      case 'l':
        navigateTo('/recipes');
        break;
      case 'n':
        navigateTo('/add-recipe');
        break;
      case 'h':
        navigateTo('/');
        break;
      case 'p':
        navigateTo('/pick-and-choose')
        break
      default:
        break;
    }
  }
};

export const initKeyboardShortcuts = () => {
  window.addEventListener('keydown', handleKeyDown);
};

export const cleanupKeyboardShortcuts = () => {
  window.removeEventListener('keydown', handleKeyDown);
};
