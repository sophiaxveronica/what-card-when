export const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  export const isFormValid = (selectedCategories: string[], cards: any[], isValidEmail: boolean, name: string) => {
    return (
      selectedCategories.length > 0 &&
      cards.length > 0 &&
      isValidEmail &&
      name.trim() !== ''
    );
  };