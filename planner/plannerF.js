document.getElementById("dietFormFemale").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const height = parseFloat(document.getElementById("heightFemale").value);
    const age = parseInt(document.getElementById("ageFemale").value);
    const weight = parseFloat(document.getElementById("weightFemale").value);
    const goal = document.getElementById("goalFemale"); 
    const bodyType = document.getElementById("bodyTypeFemale");

    const bmi = calculateBMIFemale(weight, height);
    const bmr = calculateBMRFemale(weight, height, age);
    const caloricNeeds = adjustCaloriesForGoal(bmr, selectedOption);
    const bgi = calculateBGI(selectedBodyType);

    const dietPlan = generateDietPlan(bgi, caloricNeeds);
    
    displayResults(dietPlan, caloricNeeds, bgi, bmi, bmr, "resultsFemale");
});

let selectedOption;
let selectedBodyType;

document.querySelectorAll('input[name="goal"]').forEach(radio => {
    radio.addEventListener('change', function() {
        selectedOption = document.querySelector('input[name="goal"]:checked').value;
        console.log('Selected option:', selectedOption);
    });
});

document.querySelectorAll('input[name="body-type"]').forEach(radio => {
    radio.addEventListener('change', function() {
        selectedBodyType = document.querySelector('input[name="body-type"]:checked').value;
        console.log('Selected BodyType:', selectedBodyType);
    });
});

function calculateBMIFemale(weight, height) {
    const heightInMeters = height * 0.0254; // Convert height from inches to meters
    const weightInKg = weight * 0.453592; // Convert weight from lbs to kg
    return (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
}

function calculateBMRFemale(weight, height, age) {
    return 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age); // BMR formula for females
}

function adjustCaloriesForGoal(bmr, selectedOption) {
    if (selectedOption === "weight loss") {
        return bmr - 500;
    } else if (selectedOption === "muscle gain") {
        return bmr + 500;
    } else {
        return bmr;
    }
}

function calculateBGI(selectedBodyType) {
    if (selectedBodyType === "ectomorph") {
        return 60;
    } else if (selectedBodyType === "mesomorph") {
        return 70;
    } else {
        return 80;
    }
}

function generateDietPlan(bgi, caloricIntake) {
    const foodItems = {
        eggs: { calories: 155, protein: 13, carbs: 1, bgi: 0 },
        oatmeal: { calories: 150, protein: 5, carbs: 27, bgi: 55 },
        chicken: { calories: 165, protein: 31, carbs: 0, bgi: 0 },
        salad: { calories: 33, protein: 2, carbs: 7, bgi: 10 },
        apple: { calories: 95, protein: 0.5, carbs: 25, bgi: 38 },
        rice: { calories: 130, protein: 2.7, carbs: 28, bgi: 73 },
        fish: { calories: 206, protein: 22, carbs: 0, bgi: 0 },
        chapati: { calories: 120, protein: 3, carbs: 24, bgi: 50 },
        kidneyBeans: { calories: 225, protein: 15, carbs: 40, bgi: 60 },
        paneer: { calories: 296, protein: 25, carbs: 4, bgi: 15 }
    };

    const meals = ["breakfast", "lunch", "dinner"];
    const totalCalories = caloricIntake;
    const mealCalories = [totalCalories * 0.3, totalCalories * 0.4, totalCalories * 0.3];

    return meals.map((meal, index) => chooseFoodsForMeal(mealCalories[index], bgi, foodItems));
}

function chooseFoodsForMeal(calorieTarget, targetBGI, foodItems) {
    let mealPlan = [];
    let remainingCalories = calorieTarget;
    let totalBGI = 0;
    const foodNames = Object.keys(foodItems);
    const shuffledFoodNames = foodNames.sort(() => 0.5 - Math.random());

    for (const foodName of shuffledFoodNames) {
        const foodInfo = foodItems[foodName];

        if (foodInfo.calories <= remainingCalories && totalBGI + foodInfo.bgi <= targetBGI) {
            const portionSize = remainingCalories / foodInfo.calories;
            mealPlan.push({
                food: foodName,
                quantity: `${(portionSize * 100).toFixed(0)}g`,
                calories: (foodInfo.calories * portionSize).toFixed(2),
                bgi: (foodInfo.bgi * portionSize).toFixed(2),
            });
            remainingCalories -= foodInfo.calories * portionSize;
            totalBGI += foodInfo.bgi * portionSize;
        }

        if (remainingCalories <= 0 || totalBGI >= targetBGI) {
            break;
        }
    }

    return mealPlan;
}

function displayResults(dietPlan, caloricNeeds, bgi, bmi, bmr) {
    const resultsDiv = document.getElementById("resultsFemale");
    
    let bmiCategory = "";
    if (bmi < 18.5) {
        bmiCategory = "Underweight";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        bmiCategory = "Normal weight";
    } else if (bmi >= 25 && bmi <= 29.9) {
        bmiCategory = "Overweight";
    } else {
        bmiCategory = "Obese";
    }

    resultsDiv.innerHTML = `<h2>Your BMR: ${bmr.toFixed(2)} calories/day</h2>
                            <h2>Your BMI: ${bmi} (${bmiCategory})</h2>
                            <h2>Your Daily Caloric Needs: ${caloricNeeds.toFixed(2)} calories</h2>
                            <h2>Your Target BGI: ${bgi}</h2>`;

    ["breakfast", "lunch", "dinner"].forEach((meal, index) => {
        const mealPlan = dietPlan[index];
        let mealHTML = `<h3>${meal.charAt(0).toUpperCase() + meal.slice(1)}:</h3><ul>`;
        
        mealPlan.forEach(food => {
            mealHTML += `<li>${food.quantity} of ${food.food} - ${food.calories} calories, BGI: ${food.bgi}</li>`;
        });

        mealHTML += "</ul>";
        resultsDiv.innerHTML += mealHTML;
    });
}