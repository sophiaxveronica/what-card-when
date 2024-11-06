export const capitalizeWords = (str: string) => {
    return str
      .replace(/_/g, ' ') // Replace underscores with spaces
      .split(' ')
      .map((word, index) => index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word) // Capitalize only the first word
      .join(' ');
  };