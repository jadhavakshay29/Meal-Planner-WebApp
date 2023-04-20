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
//     const mealAPI = await fetch('https://api.spoonacular.com/recipes/716429/information?apiKey=f7b12ec8f2bd4b03a28f6784d6738f8f&includeNutrition=true');
//     const mealAPI1 = await mealAPI.json();
//     console.log(mealAPI1);
// }

//to call the api 
function getRecipe() {
  console.log("fetch recipe");   
  fetch(
    `https://api.spoonacular.com/recipes/mealplans/generate?apiKey=f7b12ec8f2bd4b03a28f6784d6738f8f&timeFrame=day&targetCalories=${calories1}`
  ).then(function(response) {
      if (response.status!==200){
            console.log("Error");     
        return;
    }
    response.json().then(function(data){
        console.log(data);
        addMeal(data.meals);
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
  } catch {
    console.log("there's problem with API call");
  }
});

//get recipe of meal
function getMealRecipe(e) {
  e.preventDefault();
  // console.log(e.target);
  if (e.target.classList.contains("getbtn")) {
    const meal = JSON.parse(e.target.getAttribute("data-meal")); // get the meal object from the button
    fetch(
      `https://api.spoonacular.com/recipes/${meal.id}/information?apiKey=f7b12ec8f2bd4b03a28f6784d6738f8f&includeNutrition=true&timeFrame=day`
    )
      .then((res) => res.json())//to extract the json data 
      .then((data) => {   //to access json data
        let recipeList1 = document.getElementById("recipe-ingred");
        if (data.nutrition) {
          let html = "";
          html += `
              <table class="recipe-table">
           <tr>
              <th>INGREDIENT</th>
              <th>QUANTITY</th>
           </tr>`
          data.nutrition.ingredients.forEach((ingredient) => {
            html += `
            <tr id="recipeList">
                <td>${ingredient.name}</td>
                <td>${ingredient.amount} ${ingredient.unit}</td>
            </tr>
          `;
          });
          html += `</table>`;
          recipeList1.innerHTML = html;
        }
        console.log(data.nutrition);
      });
  }
}
