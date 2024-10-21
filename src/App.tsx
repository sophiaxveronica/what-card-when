import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Label } from '@radix-ui/react-label';
import React from 'react';
import './index.css';
import { capitalizeWords } from './utils/stringUtils';
import { validateEmail, isFormValid, createFormErrorMessage } from './utils/validationUtils';
import { fetchCardCompanies, fetchCardCategories, fetchCardOptions, calculateRecommendations } from './utils/apiUtils';
import { CategoryWithBestCreditCard } from './types';

const timeoutPromise = (ms: number) => new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms));

const SELECTED_CARD_LIMIT = 6;

export default function Component() {
  const [cards, setCards] = useState<{ company: string; card_name: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<CategoryWithBestCreditCard[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [cardCompanies, setCardCompanies] = useState<string[]>([]);
  const [cardCategories, setCardCategories] = useState<string[]>([]);
  const [cardOptions, setCardOptions] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const companies = await fetchCardCompanies();
      setCardCompanies(companies);
      const categories = await fetchCardCategories();
      setCardCategories(categories);
      setSelectedCategories(categories); // Set selectedCategories to all fetched categories
    };
    fetchData();
  }, []);

  // Form validation for email field
  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
    setFormError('');
  };

  // Form validation for name field
  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setFormError('');
  };

  // Helper for selecting card
  const addCard = (card_name: string) => {
    if (!cards.some(card => card.company === selectedCompany && card.card_name === card_name)) {
      setCards([...cards, { company: selectedCompany, card_name }]);
    }
    setFormError('');
  };

  // Helper for removing card
  const removeCard = (index: number) => {
    const newCards = cards.filter((_, i) => i !== index);
    setCards(newCards);
    setFormError('');
  };

  // Main function
  const handleGenerateAndEmailResults = async () => {
    // Only allow user to click generate results if they've inputted all the info we need
    if (!isFormValid(selectedCategories, cards, isValidEmail, name)) {
      setFormError(createFormErrorMessage(selectedCategories, cards, isValidEmail, name));
    } else {
      setFormError('');
      setErrorMessage('');
      setSuccessMessage('');
      try {
        const timeoutDuration = 3000; // 3 second timeout, TODO: is this too short?

        // First we calculate the recommendations and display them
        const card_names :string[] = cards.map(card => card.card_name)
        const data = await Promise.race([
          calculateRecommendations(card_names, selectedCategories),
          timeoutPromise(timeoutDuration)
        ]);
        setResults(data);
        setShowResults(true);

        // Then we create and send the email 
        // const htmlString = generateEmail(data, name, cards);
        // await Promise.race([
        //   sendEmail(email, name, htmlString),
        //   timeoutPromise(timeoutDuration)
        // ]);

        setSuccessMessage("Great! We've sent your results. Check your email!");
      } catch (error) {
        // TODO: what's an easy way to get alerted about something like this?
        console.error('Error generating or sending results:', error);
        setErrorMessage("Hmm, something went wrong, sorry about that!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-lightGreen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-darkGreen">
        <div className="p-8">
          <h1 className="text-5xl font-bold mb-8 text-center gradient-text">
            What Card When?
          </h1>

          {/* SPENDING CATEGORY CHECKBOX SECTION */}
          <div className="space-y-8">
            <div>
              <Label htmlFor="category-select" className="text-xl font-semibold font-medium text-darkGreen">
                Select categories
              </Label>
              <div className="grid grid-cols-2 gap-4 mt-2 border border-darkGreen rounded-lg p-4 bg-gray-50">
                {cardCategories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={category}
                      value={category}
                      checked={selectedCategories.includes(category)} // Check if the category is selected
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category]);
                        } else {
                          setSelectedCategories(selectedCategories.filter((c) => c !== category));
                        };
                        setFormError('');
                      }}
                      className="form-checkbox h-5 w-5 text-lightGreen border-gray-300 rounded focus:ring-lightPink"
                    />
                    <label htmlFor={category} className="ml-2 text-lg text-darkGreen hover:text-lightGreen transition duration-200">
                      {capitalizeWords(category)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* CREDIT CARD COMPANY DROPDOWN */}
            <div>
              <Label htmlFor="company-select" className="text-xl font-semibold font-medium text-darkGreen">
                Select card company
              </Label>
              <div className="space-y-8">
                <select
                  id="company-select"
                  value={selectedCompany}
                  onChange={async (e) => {
                    const company = e.target.value;
                    setSelectedCompany(company);
                    try {
                      const data = await fetchCardOptions(company);
                      setCardOptions(data);
                    } catch (error) {
                      console.error('Error fetching card options:', error);
                    }
                  }}
                  className="mt-2 block w-full p-3 border-2 border-darkGreen rounded-xl focus:border-lightGreen focus:ring focus:ring-lightPink transition duration-200"
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
            {/* CARD SELECTION FOR A SPECIFIC COMPANY */}
            {selectedCompany && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-darkGreen">Select cards:</h2>
                <div className="flex flex-wrap gap-3">
                  {Array.isArray(cardOptions) ? (
                    cardOptions.map((card: string, index: number) => {
                      const isCardSelected = cards.some(c => c.company === selectedCompany && c.card_name === card);
                      const isMaxCardsSelected = cards.length >= SELECTED_CARD_LIMIT;
                      return (
                        <button
                          key={index}
                          onClick={() => addCard(card)}
                          className={`px-6 py-3 text-white rounded-full transform transition duration-200 shadow-md ${isCardSelected
                            ? 'bg-gray-700 cursor-not-allowed' // Dark gray for selected cards
                            : isMaxCardsSelected
                              ? 'bg-gray-400 cursor-not-allowed' // Light gray for max limit reached
                              : 'bg-darkGreen hover:bg-lightGreen hover:scale-105'
                            }`}
                          disabled={isCardSelected || isMaxCardsSelected}
                        >
                          {card}
                        </button>
                      );
                    })
                  ) : (
                    <p>No card options available</p>
                  )}
                </div>
              </div>
            )}

            {/* CURRENTLY SELECTED CARDS VIEW */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4 text-darkGreen">Selected cards:</h2>
              {cards.length === SELECTED_CARD_LIMIT ? (
                <p className="mb-4 text-yellow-600 font-medium">
                  You can select up to {SELECTED_CARD_LIMIT} cards.
                </p>
              ) : cards.length === 0 ? (
                <p className="mb-4 text-gray-600 font-medium">
                  No cards selected.
                </p>
              ) : null}
              <div className="flex flex-wrap gap-4">
                {cards.map((card, index) => (
                  <div key={index} className="bg-lightGreen rounded-xl shadow-sm" style={{ width: '180px', aspectRatio: '1.586' }}>
                    <div className="h-full p-4 flex flex-col justify-between">
                      <div className="flex-grow flex flex-col items-center justify-center text-center relative">
                        <p className="text-lg text-darkGreen font-medium">{card.company}</p>
                        <p className="text-md text-darkGreen truncate" title={card.card_name}>{card.card_name}</p>
                      </div>
                      <button
                        onClick={() => removeCard(index)}
                        className="self-end text-darkGreen hover:text-white transform hover:scale-110 transition duration-200"
                      >
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FORM INPUTS FOR THE EMAIL */}
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name-input" className="text-xl font-semibold font-medium text-darkGreen">
                Enter your name
              </Label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={handleNameInputChange}
                className="mt-2 block w-full p-3 border-2 border-darkGreen rounded-xl focus:ring focus:ring-lightGreen transition duration-200"
                placeholder="Your Name"
              />
            </div>
            <div>
              <Label htmlFor="email-input" className="text-xl font-semibold font-medium text-darkGreen">
                Enter your email to receive results
              </Label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={handleEmailInputChange}
                className={`mt-2 block w-full p-3 border-2 ${isValidEmail ? 'border-lightGreen' : 'border-darkGreen'
                  } rounded-xl focus:ring focus:ring-lightGreen transition duration-200`}
                placeholder="your@email.com"
              />
              {email && !isValidEmail && (
                <p className="mt-1 text-red-500">Please enter a valid email address</p>
              )}
            </div>
          </div>

          {/* GENERATE RECOMMENDATIONS BUTTON */}
          <div className="mt-8">
            <button
              // TODO: should we disable the button once it's been clicked until the user changes 
              // something, like adds a card, unchecks a category, or changes their email? 
              onClick={handleGenerateAndEmailResults}
              className={`w-full py-4 rounded-full text-xl font-bold shadow-lg transform transition duration-200 
            ${isFormValid(selectedCategories, cards, isValidEmail, name)
                  ? 'bg-darkGreen text-white hover:bg-lightGreen hover:text-darkGreen hover:scale-105'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
            >
              Get your results!
            </button>
            {formError && (
              <p className="mt-2 text-red-500 text-center">
                {formError}
              </p>
            )}
            {errorMessage && (
              <p className="mt-2 text-red-500 text-center">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="mt-2 text-green-500 text-center">
                {successMessage}
              </p>
            )}
          </div>
        </div>

        {/* RECOMMENDATIONS VIEW */}
        {showResults && (
          <div className="bg-white p-8 rounded-t-3xl -mt-2 ">
            <h2 className="text-3xl font-bold mb-6 gradient-text text-darkGreen">Your Optimal Card Usage:</h2>
            <div className="space-y-4">
              {results.map((category, index) => {
                console.log(category);
                console.log();
              return (
                  <div key={index} className="bg-white p-4 rounded-xl shadow-md border-2 border-darkGreen">
                    <h3 className="text-xl font-semibold text-darkGreen mb-2">{capitalizeWords(category.category)}</h3>
                    {category.bestCards && category.bestCards.length > 0 ? ( // Check if bestCards exist and have items
                      <>
                        {category.bestCards.map((bestCard, cardIndex) => (
                          <div key={cardIndex}>
                            <p className="text-darkGreen">Best Card: <span className="font-medium text-green-500">{`${bestCard.company} - ${bestCard.card_name}`}</span></p>
                            <p className="text-darkGreen">
                              {bestCard.cash_back_pct 
                                ? 'Cash back: ' 
                                : 'Points per dollar: '}
                              <span className="font-medium text-green-500">
                                {bestCard.cash_back_pct 
                                  ? `${bestCard.cash_back_pct}%` 
                                  : bestCard.points_per_dollar}
                              </span>
                            </p>
                            <p className="text-darkGreen">Fine Print: <span className="font-small text-green-500">{bestCard.fine_print}</span></p>
                            {category.bestCards && cardIndex < category.bestCards.length - 1 && <br />} {/* Add line break except for the last card */}
                          </div>
                        ))}
                      </>
                    ) : (
                    <>
                    <p className="text-red-500">No card available for this category</p>
                    </>
                  )}
                </div>
              )})}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}