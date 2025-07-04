const container = document.getElementById('container');

async function FetchData() {
  try{
    const response = await fetch('/Recipes/Random');
    const data = await response.json();
    console.log(data);
    const recipe = await data.recipes; 
    console.log("res:",recipe);
    /*const element = await recipes.element; 
    console.log("element:",element);*/
    RenderData(recipe);
  }
  catch(e){
    console.error('Error fetching data:', e.message);
  }  
}

function RenderData(recipeS) {
  container.innerHTML = ''; 

  if (!recipeS.length) {
    container.innerHTML = '<p>No recipes found.</p>';
    return;
  }

  recipeS.forEach(element => {
    const card = document.createElement("div");
    card.className = "cards";
    
    const allIngredients = element.analyzedInstructions?.flatMap(instruction =>
      instruction.steps?.flatMap(step =>
        step.ingredients?.map(ing => ing.name) || []
      ) || []
    ) || [];
    const uniqueIngredients = [...new Set(allIngredients)];

    card.innerHTML = `
      <button class="save-btn" title="Save to Favorites">♡</button>
      <img src="${element.image}" alt="${element.title}">
      <div class="card-content">
        <h3>${element.title}</h3>

        <p><strong>Ingredients:</strong></p>
        <ul>
          ${uniqueIngredients.length
            ? uniqueIngredients.map(item => `<li>${item}</li>`).join('')
            : "<li>No ingredients listed.</li>"
          }
        </ul>
        <p><strong>Instructions:</strong></p>
        <p>${element.instructions || "No instructions provided."}</p>
        <p>${element.healthScore}</p>
      </div>
    `;

    const saveButton = card.querySelector('.save-btn');
      saveButton.addEventListener('click', async () => {
        await saveToDatabase(element);
        saveButton.classList.add('saved'); 
        saveButton.innerHTML = "❤️"; 
    });


    container.appendChild(card);
  });
}

//local storage
// function saveToLocalStorage(recipe) {
//     const saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];

//     const alreadySaved = saved.some(item => item.id === recipe.id);
//     if (alreadySaved) {
//         alert("This recipe is already saved.");
//         return;
//     }

//     saved.push({
//         id: recipe.id,
//         title: recipe.title,
//         image: recipe.image,
//         instructions: recipe.instructions,
//         analyzedInstructions: recipe.analyzedInstructions
//     });

//     localStorage.setItem("savedRecipes", JSON.stringify(saved));
//     alert("Recipe saved!");
// }

async function saveToDatabase(recipe) {
  try {
    const allIngredients = recipe.analyzedInstructions?.flatMap(instruction =>
      instruction.steps?.flatMap(step =>
        step.ingredients?.map(ing => ing.name) || []
      ) || []
    ) || [];

    const uniqueIngredients = [...new Set(allIngredients)];

    const response = await fetch("/recipes/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: recipe.title,
        image: recipe.image,
        instructions: recipe.instructions,
        ingredients: JSON.stringify(uniqueIngredients),
        readyin: recipe.healthScore
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Recipe saved to database!");
    } 
    else {
      alert("Failed to save recipe.");
      console.error(data);
    }
  } 
  catch (error) {
    console.error("Error saving to DB:", error.message);
    alert("An error occurred.");
  }
}

FetchData();