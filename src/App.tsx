import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Label } from '@radix-ui/react-label';
import React from 'react';
import './index.css';

type SpendingCategory = {
  category: string;
  bestCard: {
    company: string;
    type: string;
    percentage: number;
  } | null;
};

const categories = [
  'dining',
  'lyft',
  'uber',
  'public transport',
  'groceries',
  'gas',
  'hotels',
  'flights'
];

const capitalizeWords = (str: string) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function Component() {
  const [cards, setCards] = useState<{ company: string; type: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SpendingCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [cardCompanies, setCardCompanies] = useState<string[]>([]);
  const [cardOptions, setCardOptions] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');


  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
    setFormError('');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setFormError('');
  };

  const isFormValid = () => {
    return (
      selectedCategories.length > 0 &&
      cards.length > 0 &&
      isValidEmail &&
      name.trim() !== ''
    );
  };

  function generateResultsEmail(results: SpendingCategory[], name: string, cards: { company: string; type: string }[]): string {
    const cardList = cards.map(card => `${card.company} ${card.type}`).join(', ');

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f8f0;">
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f8f0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #006400; font-size: 18px; margin: 0;">Hi ${name}!</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #006400; font-size: 18px; margin: 0;">Thanks for using WhatCardWhen.</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #006400; font-size: 18px; margin: 0;">Here's what we recommend for you given these inputted cards:<br>${cardList}.</p>
          </td>
        </tr>
      </table>      
      <h2 style="color: #006400; font-size: 24px; margin-bottom: 20px;">Your Optimal Card Usage:</h2>
      ${results.map((category, index) => `
        <div style="background-color: #ffffff; border: 2px solid #006400; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
          <h3 style="color: #00ff00; font-size: 18px; margin-top: 0; margin-bottom: 10px;">${capitalizeWords(category.category)}</h3>
          ${category.bestCard
        ? `
              <p style="color: #006400; margin: 5px 0;">Best Card: <strong>${category.bestCard.company} - ${category.bestCard.type}</strong></p>
              <p style="color: #006400; margin: 5px 0;">Cashback: <strong>${category.bestCard.percentage}%</strong></p>
            `
        : `<p style="color: #ff0000; margin: 5px 0;">No card available for this category</p>`
      }
        </div>
      `).join('')}
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f8f0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #006400; font-size: 18px; margin: 0;">We're actively building WhatCardWhen.</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #006400; font-size: 18px; margin: 0;">Let us know what you think!</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #006400; font-size: 18px; margin: 0;">Best,<br>the WCW team</p>
          </td>
        </tr>
      </table>
    </div>
  `;
  }

  useEffect(() => {
    const fetchCardCompanies = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/cards/companies');
        const data = await response.json();
        setCardCompanies(data);
      } catch (error) {
        console.error('Error fetching card companies:', error);
      }
    };

    fetchCardCompanies();
  }, []);

  const addCard = (type: string) => {
    if (cards.length < 6) {
      setCards([...cards, { company: selectedCompany, type }]);
    }
    setFormError('');
  };

  const removeCard = (index: number) => {
    const newCards = cards.filter((_, i) => i !== index);
    setCards(newCards);
    setFormError('');
  };

  const handleGenerateResults = () => {
    if (!isFormValid()) {
      let errorMessage = '';
      if (selectedCategories.length === 0) errorMessage += 'Please select at least one category. ';
      if (cards.length === 0) errorMessage += 'Please add at least one card. ';
      if (!isValidEmail) errorMessage += 'Please enter a valid email address. ';
      if (name.trim() === '') errorMessage += 'Please fill in your name. ';
      setFormError(errorMessage.trim());
    } else {
      setFormError('');
      generateResults();
    }
  };

  const generateResults = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/cards/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cards, categories: selectedCategories }),
      });
      const data = await response.json();
      setResults(data);
      setShowResults(true);

      const htmlString = generateResultsEmail(data, name, cards);
      console.log(htmlString);
      // Call the new endpoint to trigger email sending
      const emailResponse = await fetch('http://localhost:5001/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: email, name: name, subject: 'HI THERE', html: htmlString }),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send results email');
      }

      console.log('Results email sent successfully');
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  return (
    <div className="min-h-screen bg-lightGreen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-darkGreen">
        <div className="p-8">
          <h1 className="text-5xl font-bold mb-8 text-center gradient-text">
            What Card When?
          </h1>
          <div className="space-y-8">
            <div>
              <Label htmlFor="category-select" className="text-lg font-medium text-darkGreen">
                Select Categories
              </Label>
              <div className="grid grid-cols-2 gap-4 mt-2 border border-darkGreen rounded-lg p-4 bg-gray-50">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={category}
                      value={category}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category]);
                        } else {
                          setSelectedCategories(selectedCategories.filter((c) => c !== category));
                        };
                        setFormError('');
                      }}
                      className="form-checkbox h-5 w-5 text-neonGreen border-gray-300 rounded focus:ring-neonGreen"
                    />
                    <label htmlFor={category} className="ml-2 text-lg text-darkGreen hover:text-neonGreen transition duration-200">
                      {capitalizeWords(category)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="company-select" className="text-lg font-medium text-darkGreen">
                Select Card Company
              </Label>
              <div className="space-y-8">
                <select
                  id="company-select"
                  value={selectedCompany}
                  onChange={async (e) => {
                    const company = e.target.value;
                    setSelectedCompany(company);
                    try {
                      const response = await fetch(`http://localhost:5001/api/cards/options/${company}`);
                      const data = await response.json();
                      setCardOptions(data);
                    } catch (error) {
                      console.error('Error fetching card options:', error);
                    }
                  }}
                  className="mt-2 block w-full p-3 border-2 border-darkGreen rounded-xl focus:border-neonGreen focus:ring focus:ring-neonGreen transition duration-200"
                >
                  <option value="">Select a company</option>
                  {cardCompanies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {selectedCompany && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-darkGreen">Select Cards:</h2>
                <div className="flex flex-wrap gap-3">
                  {Array.isArray(cardOptions) ? (
                    cardOptions.map((card: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => addCard(card)}
                        className={`px-6 py-3 ${cards.some(c => c.type === card) ? 'bg-darkGreen' : 'bg-neonGreen'} text-white rounded-full hover:bg-darkGreen transform hover:scale-105 transition duration-200 shadow-md`}
                        disabled={cards.length >= 6}
                      >
                        {card}
                      </button>
                    ))
                  ) : (
                    <p>No card options available</p>
                  )}
                </div>
              </div>
            )}
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4 text-darkGreen">Selected Cards:</h2>
              <div className="space-y-3">
                {cards.map((card, index) => (
                  <div key={index} className="flex items-center justify-between bg-neonGreen p-4 rounded-xl shadow-sm">
                    <span className="text-lg text-darkGreen font-medium">{`${card.company} - ${card.type}`}</span>
                    <button
                      onClick={() => removeCard(index)}
                      className="text-darkGreen hover:text-neonGreen transform hover:scale-110 transition duration-200"
                    >
                      <Trash2 className="h-6 w-6" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name-input" className="text-lg font-medium text-darkGreen">
                Enter your name
              </Label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={handleNameChange}
                className="mt-2 block w-full p-3 border-2 border-darkGreen rounded-xl focus:ring focus:ring-neonGreen transition duration-200"
                placeholder="Your Name"
              />
            </div>
            <div>
              <Label htmlFor="email-input" className="text-lg font-medium text-darkGreen">
                Enter your email to receive results
              </Label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`mt-2 block w-full p-3 border-2 ${isValidEmail ? 'border-neonGreen' : 'border-darkGreen'
                  } rounded-xl focus:ring focus:ring-neonGreen transition duration-200`}
                placeholder="your@email.com"
              />
              {email && !isValidEmail && (
                <p className="mt-1 text-red-500">Please enter a valid email address</p>
              )}
            </div>
          </div>
          <div className="mt-8">
            <button
              onClick={handleGenerateResults}
              className={`w-full py-4 rounded-full text-xl font-bold shadow-lg transform transition duration-200 
            ${isFormValid()
                  ? 'bg-darkGreen hover:bg-neonGreen text-white hover:scale-105'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
            >
              Generate and Email Results
            </button>
            {formError && (
              <p className="mt-2 text-red-500 text-center">
                {formError}
              </p>
            )}
          </div>
        </div>
        {showResults && (
          <div className="bg-white p-8 rounded-t-3xl mt-8 ">
            <h2 className="text-3xl font-bold mb-6 text-darkGreen">Your Optimal Card Usage:</h2>
            <div className="space-y-4">
              {results.map((category, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-md border-2 border-darkGreen">
                  <h3 className="text-xl font-semibold text-neonGreen mb-2">{capitalizeWords(category.category)}</h3>
                  {category.bestCard ? (
                    <>
                      <p className="text-darkGreen">Best Card: <span className="font-medium">{`${category.bestCard.company} - ${category.bestCard.type}`}</span></p>
                      <p className="text-darkGreen">Cashback: <span className="font-medium">{category.bestCard.percentage}%</span></p>
                    </>
                  ) : (
                    <p className="text-red-500">No card available for this category</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}