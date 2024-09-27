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

  export const createFormErrorMessage = (selectedCategories: string[], cards: any[], isValidEmail: boolean, name: string): string => {
    let errorMessage = '';
    if (selectedCategories.length === 0) errorMessage += 'Please select at least one category. ';
    if (cards.length === 0) errorMessage += 'Please add at least one card. ';
    if (!isValidEmail) errorMessage += 'Please enter a valid email address. ';
    if (name.trim() === '') errorMessage += 'Please fill in your name. ';
    return errorMessage.trim();
  }
  