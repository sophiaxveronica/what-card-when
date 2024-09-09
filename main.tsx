import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2 } from 'lucide-react'

type CreditCard = {
  company: string
  type: string
}

type SpendingCategory = {
  name: string
  bestCard: string
  cashback: number
}

export default function Component() {
  const [cards, setCards] = useState<CreditCard[]>([{ company: '', type: '' }])
  const [showResults, setShowResults] = useState(false)

  const addCard = () => {
    if (cards.length < 6) {
      setCards([...cards, { company: '', type: '' }])
    }
  }

  const removeCard = (index: number) => {
    const newCards = cards.filter((_, i) => i !== index)
    setCards(newCards)
  }

  const updateCard = (index: number, field: 'company' | 'type', value: string) => {
    const newCards = [...cards]
    newCards[index][field] = value
    setCards(newCards)
  }

  const generateResults = () => {
    // This is where you'd implement the logic to determine the best card for each category
    // For now, we'll use dummy data
    setShowResults(true)
  }

  const dummyResults: SpendingCategory[] = [
    { name: 'Groceries', bestCard: 'Chase Sapphire Preferred', cashback: 3 },
    { name: 'Dining', bestCard: 'Amex Gold', cashback: 4 },
    { name: 'Travel', bestCard: 'Capital One Venture', cashback: 2 },
    { name: 'Gas', bestCard: 'Citi Premier', cashback: 3 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Credit Card Advisor</h1>
          <div className="space-y-6">
            {cards.map((card, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-grow">
                  <Label htmlFor={`company-${index}`} className="text-sm font-medium text-gray-700">
                    Card Company
                  </Label>
                  <Input
                    id={`company-${index}`}
                    value={card.company}
                    onChange={(e) => updateCard(index, 'company', e.target.value)}
                    className="mt-1"
                    placeholder="e.g. Chase, Amex"
                  />
                </div>
                <div className="flex-grow">
                  <Label htmlFor={`type-${index}`} className="text-sm font-medium text-gray-700">
                    Card Type
                  </Label>
                  <Input
                    id={`type-${index}`}
                    value={card.type}
                    onChange={(e) => updateCard(index, 'type', e.target.value)}
                    className="mt-1"
                    placeholder="e.g. Sapphire Preferred, Gold"
                  />
                </div>
                {index > 0 && (
                  <Button
                    onClick={() => removeCard(index)}
                    variant="destructive"
                    size="icon"
                    className="mt-6"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {cards.length < 6 && (
            <Button onClick={addCard} className="mt-6 bg-green-500 hover:bg-green-600">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Card
            </Button>
          )}
          <Button onClick={generateResults} className="mt-6 w-full bg-blue-500 hover:bg-blue-600">
            Generate Results
          </Button>
        </div>
        {showResults && (
          <div className="bg-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Best Cards for Each Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dummyResults.map((category, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 transform transition duration-500 hover:scale-105">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{category.name}</h3>
                  <p className="text-lg text-blue-600 font-medium">{category.bestCard}</p>
                  <p className="text-sm text-gray-600">{category.cashback}% cashback</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}