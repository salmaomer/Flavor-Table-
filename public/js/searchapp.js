const container = document.getElementById('container');
const form = document.getElementById('ingredients');
const MissUsed = [];

form.addEventListener('submit', function (e) {
  e.preventDefault();
  FetchData();
});

async function FetchData() {
  const inputElement = document.getElementById('insart');
  const inputValue = inputElement.value.trim();

  if (inputValue !== '') {
    if (!MissUsed.includes(inputValue)) {
      MissUsed.push(inputValue);
    }
  } 
  else {
    alert('Please enter an ingredient.');
    return;
  }
  inputElement.value = '';

  const q = MissUsed.join(',');
  try {
    const response = await fetch(`/Recipe/Search?q=${encodeURIComponent(q)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    RenderData(data);
  } 
  catch (e) {
    console.error('Error fetching data:', e.message);
    container.innerHTML = `<p>Error: ${e.message}</p>`;
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

    card.innerHTML = `
        <button class="save-btn" title="Save to Favorites">♡</button>
      <img src="${element.image}" alt="${element.title}">
      <div class="card-content">
        <h3>${element.title}</h3>

        <p><strong>Used Ingredients:</strong></p>
        <ul>
          ${element.usedIngredients.map(item => `<li>${item.name}</li>`).join('')}
        </ul>

        <p><strong>Missed Ingredients:</strong></p>
        <ul>
          ${element.missedIngredients.map(item => `<li>${item.name}</li>`).join('')}
        </ul>
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
    const token = localStorage.getItem("token");

    const allIngredients = recipe.analyzedInstructions?.flatMap(instruction =>
      instruction.steps?.flatMap(step =>
        step.ingredients?.map(ing => ing.name) || []
      ) || []
    ) || [];

    const uniqueIngredients = [...new Set(allIngredients)];

    const response = await fetch("/recipes/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
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
      alert("✅ Recipe saved to database!");
    } else {
      alert("❌ Failed to save recipe.");
      console.error("Save error:", data);
    }
  } catch (error) {
    console.error("Error saving to DB:", error.message);
    alert("❌ An error occurred while saving.");
  }
}

FetchData();
