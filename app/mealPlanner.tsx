'use client';

import React, { useState, useEffect } from 'react';
import { DinnerDishes, LunchDishes, ingredientMap } from './DISHES';

interface Dish {
  name: string;
  ingredients: number[];
}

const MealPlanner: React.FC = () => {
  const [lunchPlan, setLunchPlan] = useState<Dish[]>([]);
  const [dinnerPlan, setDinnerPlan] = useState<Dish[]>([]);
  const [totalIngredients, setTotalIngredients] = useState<number[]>([]);

  useEffect(() => {
    generateMealPlan();
  }, []);

  const generateMealPlan = () => {
    // Function to shuffle an array
    const shuffleArray = (array: Dish[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // Generate random meal plan
    const generateDayPlan = (dishes: Dish[]) => {
      const shuffledDishes = shuffleArray([...dishes]);
      return shuffledDishes[0]; // Select a random dish
    };

    const newLunchPlan = [...Array(7)].map(() => generateDayPlan(LunchDishes));
    const newDinnerPlan = [...Array(7)].map(() =>
      generateDayPlan(DinnerDishes)
    );

    setLunchPlan(newLunchPlan);
    setDinnerPlan(newDinnerPlan);

    // Calculate total ingredients without duplicates
    const allIngredientsSet: Set<number> = new Set<number>();

    newLunchPlan.forEach((dish) => {
      dish.ingredients.forEach((ingredient) => {
        allIngredientsSet.add(ingredient);
      });
    });

    newDinnerPlan.forEach((dish) => {
      dish.ingredients.forEach((ingredient) => {
        allIngredientsSet.add(ingredient);
      });
    });

    const allIngredients: number[] = Array.from(allIngredientsSet);
    setTotalIngredients(allIngredients);
  };

  const downloadMealPlan = () => {
    const markdownContent = `# Meal Plan\n\n## Lunch\n\n${lunchPlan
      .map((dish, index) => `### Day ${index + 1}\n- ${dish.name}\n`)
      .join('\n')}## Dinner\n\n${dinnerPlan
      .map((dish, index) => `### Day ${index + 1}\n- ${dish.name}\n`)
      .join('\n')}## Total Ingredients\n\n${totalIngredients
      .map((ingredient) => ingredientMap[ingredient])
      .join(', ')}`;

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meal_plan.md';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Meal Plan</h2>
      <button
        onClick={generateMealPlan}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Generate New Meal Plan
      </button>
      <button
        onClick={downloadMealPlan}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Download Meal Plan (.md)
      </button>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">Lunch</h3>
          <ul>
            {lunchPlan.map((dish, index) => (
              <li key={index} className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Day {index + 1}</h4>
                <p>{dish.name}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Dinner</h3>
          <ul>
            {dinnerPlan.map((dish, index) => (
              <li key={index} className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Day {index + 1}</h4>
                <p>{dish.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold">All Ingredients for the Week</h3>
        <ul>
          {totalIngredients.map((ingredient, index) => (
            <li key={index}>{ingredientMap[ingredient]}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MealPlanner;
