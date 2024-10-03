let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;

        let mealTotals = {
            breakfast: { calories: 0, protein: 0, carbs: 0 },
            lunch: { calories: 0, protein: 0, carbs: 0 },
            dinner: { calories: 0, protein: 0, carbs: 0 }
        };

        function toggleQuantityInput() {
            const foodItemSelect = document.getElementById('food-item');
            const selectedFood = foodItemSelect.value;

            // Show quantity input for specific items
            if ([ "rice", "chicken", "paneer", "soybean", "peas", "kidney-beans"].includes(selectedFood)) {
                document.getElementById('quantity-container').style.display = 'block';
            } else {
                document.getElementById('quantity-container').style.display = 'none';
            }

            // Show number of items input for eggs and chapati
            if (["eggs", "chapati"].includes(selectedFood)) {
                document.getElementById('quantity-amount').style.display = 'block';
            } else {
                document.getElementById('quantity-amount').style.display = 'none';
            }
        }

        function addFoodItem() {
            const mealType = document.getElementById('meal-type').value;
            const foodItemSelect = document.getElementById('food-item');
            const foodItemText = foodItemSelect.options[foodItemSelect.selectedIndex].text;
            const caloriesPer100g = parseFloat(foodItemSelect.options[foodItemSelect.selectedIndex].dataset.calories);
            const proteinPer100g = parseFloat(foodItemSelect.options[foodItemSelect.selectedIndex].dataset.protein);
            const carbsPer100g = parseFloat(foodItemSelect.options[foodItemSelect.selectedIndex].dataset.carbs);

            let calories, protein, carbs, quantity = 100;
            let numberItems = 1; // Default number of items

            // Check if number of items input should be used
            if (["eggs", "chapati"].includes(foodItemSelect.value)) {
                numberItems = parseFloat(document.getElementById('number-items').value);
                calories = caloriesPer100g * numberItems;
                protein = proteinPer100g * numberItems;
                carbs = carbsPer100g * numberItems;
                quantity = numberItems; // Display quantity as the number of items
            } else if (["rice", "chicken", "paneer", "soybean", "peas", "kidney-beans"].includes(foodItemSelect.value)) {
                quantity = parseFloat(document.getElementById('quantity').value);
                calories = (caloriesPer100g / 100) * quantity;
                protein = (proteinPer100g / 100) * quantity;
                carbs = (carbsPer100g / 100) * quantity;
            } else {
                // For other items, use fixed values
                calories = caloriesPer100g;
                protein = proteinPer100g;
                carbs = carbsPer100g;
                quantity = '-'; // No quantity for items other than the specified ones
            }

            // Update totals for the selected meal type
            mealTotals[mealType].calories += calories;
            mealTotals[mealType].protein += protein;
            mealTotals[mealType].carbs += carbs;

            // Update the table for the specific meal type
            document.getElementById(`${mealType}-items`).innerHTML += `${foodItemText} (${quantity === '-' ? '' : quantity + (["eggs", "chapati"].includes(foodItemSelect.value) ? '' : 'g')})<br>`;
            document.getElementById(`${mealType}-calories`).textContent = mealTotals[mealType].calories.toFixed(2);
            document.getElementById(`${mealType}-protein`).textContent = mealTotals[mealType].protein.toFixed(2);
            document.getElementById(`${mealType}-carbs`).textContent = mealTotals[mealType].carbs.toFixed(2);

            // Update overall totals
            totalCalories += calories;
            totalProtein += protein;
            totalCarbs += carbs;
            document.getElementById('total-calories').textContent = totalCalories.toFixed(2);
            document.getElementById('total-protein').textContent = totalProtein.toFixed(2);
            document.getElementById('total-carbs').textContent = totalCarbs.toFixed(2);
        }