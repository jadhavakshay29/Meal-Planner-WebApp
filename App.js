const mealList = document.querySelector(".cards-container");
const generateBtn = document.getElementById("button");
//event listeners
//function for calcultion of bmr and daily calorie requirement
const ageIP = document.getElementById("age");
const heightIP = document.getElementById("height");
const weightIP = document.getElementById("weight");
const genderIP = document.getElementById("gender");
const activityIP = document.getElementById("activity-level");
let maleBMR;
let femaleBMR;
let lightAct;
let moderateAct;
let activeAct;
let calRequire;
let calories1;
let meal;

// let mealRecipe={};

function BMRCalculatn() {
  if (genderIP.value === "male") {
    maleBMR =
      66.47 +
      heightIP.value * 5.003 +
      weightIP.value * 13.75 -
      ageIP.value * 6.755;
    lightAct = maleBMR * 1.375;
    moderateAct = maleBMR * 1.55;
    activeAct = maleBMR * 1.725;
  } else {
    femaleBMR =
      655.1 +
      heightIP.value * 1.85 +
      weightIP.value * 9.563 -
      ageIP.value * 4.676;
    lightAct = femaleBMR * 1.375;
    moderateAct = femaleBMR * 1.55;
    activeAct = femaleBMR * 1.725;
  }
  //calories based on all inputs
  if (activityIP.value === "light") {
    calRequire = lightAct;
  } else if (activityIP.value === "moderate") {
    calRequire = moderateAct;
  } else if (activityIP.value === "active") {
    calRequire = activeAct;
  }
  return Math.floor(calRequire);
}
//calling function on click of generate button
// generateBtn.addEventListener('click',BMRCalculatn);
//API call function
// async function getRecipe(){
//     const response = await fetch('https://api.spoonacular.com/recipes/716429/information?apiKey=f7b12ec8f2bd4b03a28f6784d6738f8f&includeNutrition=true');
//     const data = await resonse.json();
//     console.log(data);
// }

//to call the api 
function getRecipe() {
  console.log("fetch recipe");   
  fetch(
    `https://api.spoonacular.com/recipes/mealplans/generate?apiKey=f7b12ec8f2bd4b03a28f6784d6738f8f&timeFrame=day&targetCalories=${calories1}`
  ).then(function(response) {
      if (response.status!==200){
            console.log("Error");     
        return ;
    }
    response.json().then(function(data){
        console.log(data);
        addMeal(data.meals);
        // alertData(data.meals)
     });
  })
}


//card creation using html
function getCard(meal) {
  return `<div class="cards" data-id="${meal.id}">
              <div class="meal-img">
                  <img src="https://spoonacular.com/recipeImages/${meal.id}-556x370.jpg" alt="food">
              </div>
              <div class="meal-name">
                    <h3>${meal.title}</h3>
                    <h4>calories: ${calories1}</h4>
                    <h4>cooking time: ${meal.readyInMinutes} minutes</h4>
               </div>
               <button class="getbtn" data-meal='${JSON.stringify(meal)}' type="submit">GET RECIPE</button>
          </div>`;
}

function addMeal(data) {
        const cardsContainer = document.querySelector('.cards-container');
        data.forEach(meal => {
          var html = getCard(meal);
          // console.log(html);
          cardsContainer.innerHTML += getCard(meal);
        });
        
        // console.log(cardsContainer);  // contains the html code for cards
}

//event listeners
mealList.addEventListener("click", getMealRecipe);
generateBtn.addEventListener("click", () => {
  try {
    calories1 = BMRCalculatn();
     getRecipe(); //api call function
    //  alertData();
    
    console.log();
  } catch {
    console.log("there's problem with API call");
  }
});

//get recipe of meal
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("getbtn")) {
    meal = JSON.parse(e.target.getAttribute("data-meal"));

    fetch(
      `https://api.spoonacular.com/recipes/${meal.id}/information?apiKey=f7b12ec8f2bd4b03a28f6784d6738f8f&includeNutrition=true`
    )
      .then((res) => res.json())
      .then((data) => {
        let recipeIngredients = document.getElementById("recipe-ingred");
        let recipeSteps = document.getElementById("recipe-steps");
        console.log(data);

        if (data.nutrition && data.nutrition.ingredients.length > 0) {
          let ingredientsHtml = `
            <table class="recipe-table">
              <tr>
                <th>INGREDIENT</th>
                <th>QUANTITY</th>
              </tr>
          `;
          data.nutrition.ingredients.forEach((ingredient) => {
            ingredientsHtml += `
              <tr>
                <td>${ingredient.name}</td>
                <td>${ingredient.amount} ${ingredient.unit}</td>
              </tr>
            `;
          });
          ingredientsHtml += "</table>";
          recipeIngredients.innerHTML = ingredientsHtml;
        }

        if (data.analyzedInstructions && data.analyzedInstructions.length > 0) {
          let stepsHtml = `
            <div>
              <h3>STEPS</h3>
              <ol>
          `;
          data.analyzedInstructions[0].steps.forEach((step) => {
            stepsHtml += `<li>${step.step}</li>`;
          });
          stepsHtml += "</ol></div>";
          recipeSteps.innerHTML = stepsHtml;
          recipeSteps.classList.remove("hidden"); // Show the steps div
        }
      })
      .catch((error) => {
        console.log("Error occurred while fetching recipe steps", error);
      });
  }
}
