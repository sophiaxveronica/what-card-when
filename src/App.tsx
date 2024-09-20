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

export default function Component() {
  const [cards, setCards] = useState<{ company: string; type: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SpendingCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [cardCompanies, setCardCompanies] = useState<string[]>([]);
const [cardOptions, setCardOptions] = useState<string[]>([]);


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
  };

  const removeCard = (index: number) => {
    const newCards = cards.filter((_, i) => i !== index);
    setCards(newCards);
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
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-5xl font-bold mb-8 text-center text-pink-600 animate-pulse">WHAT CARD WHEN?</h1>
          <div className="space-y-8">
          <div>
  <Label htmlFor="category-select" className="text-lg font-medium text-green-700">
    Select Categories
  </Label>
  <div className="space-y-8">
    {categories.map((category) => (
      <div key={category}>
        <input
          type="checkbox"
          id={category}
          value={category}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedCategories([...selectedCategories, category]);
            } else {
              setSelectedCategories(selectedCategories.filter((c) => c !== category));
            }
          }}
        />
        <label htmlFor={category} className="ml-2">{category}</label>
      </div>
    ))}
  </div>
</div>
            
            <div>
              <Label htmlFor="company-select" className="text-lg font-medium text-green-700">
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
                  className="mt-2 block w-full p-3 border-2 border-pink-300 rounded-xl focus:border-green-500 focus:ring focus:ring-green-200 transition duration-200"
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
                <h2 className="text-2xl font-semibold mb-4 text-green-600">Select Cards:</h2>
                <div className="flex flex-wrap gap-3">
  {Array.isArray(cardOptions) ? (
    cardOptions.map((card: string, index: number) => (
      <button
        key={index}
        onClick={() => addCard(card)}
        className={`px-6 py-3 ${cards.some(c => c.type === card) ? 'bg-green-500' : 'bg-pink-500'} text-white rounded-full hover:bg-pink-600 transform hover:scale-105 transition duration-200 shadow-md`}
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
              <h2 className="text-2xl font-semibold mb-4 text-green-600">Selected Cards:</h2>
              <div className="space-y-3">
                {cards.map((card, index) => (
                  <div key={index} className="flex items-center justify-between bg-green-100 p-4 rounded-xl shadow-sm">
                    <span className="text-lg text-pink-700 font-medium">{`${card.company} - ${card.type}`}</span>
                    <button
                      onClick={() => removeCard(index)}
                      className="text-pink-500 hover:text-pink-700 transform hover:scale-110 transition duration-200"
                    >
                      <Trash2 className="h-6 w-6" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button 
            onClick={generateResults} 
            className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-full text-xl font-bold shadow-lg transform hover:scale-105 transition duration-200"
            disabled={cards.length === 0}
          >
            Generate Results
          </button>
        </div>
        {showResults && (
          <div className="bg-pink-100 p-8 rounded-t-3xl mt-8">
            <h2 className="text-3xl font-bold mb-6 text-green-700">Your Optimal Card Usage:</h2>
            <div className="space-y-4">
              {results.map((category, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-pink-600 mb-2">{category.category}</h3>
                  {category.bestCard ? (
                    <>
                      <p className="text-green-700">Best Card: <span className="font-medium">{`${category.bestCard.company} - ${category.bestCard.type}`}</span></p>
                      <p className="text-green-700">Cashback: <span className="font-medium">{category.bestCard.percentage}%</span></p>
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