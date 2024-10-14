const API_BASE_URL = 'http://localhost:5001/api';

export const fetchCardCompanies = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/companies`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching card companies:', error);
    throw error;
  }
};

export const fetchCardCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/categories`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching card companies:', error);
    throw error;
  }
};

export const fetchCardOptions = async (company: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/options/${company}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching card options:', error);
    throw error;
  }
};

export const calculateRecommendations = async (card_names: string[], selected_categories: string[]) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/filter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ card_names, selected_categories }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
};

export const sendEmail = async (email: string, name: string, htmlContent: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/emails/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        name: name,
        subject: 'Recommendations for What Card When?',
        html: htmlContent
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to send results email');
    }
    console.log('Results email sent successfully');
  } catch (error) {
    console.error('Error sending results email:', error);
    throw error;
  }
};

export const addContact = async (email: string, name: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/emails/add-contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to add contact');
    }
    console.log('Added contact successfully');
  } catch (error) {
    console.error('Error adding contact:', error);
    throw error;
  }
};