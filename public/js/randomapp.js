const container = document.getElementById('container');

const token = localStorage.getItem("token");

if (token) {
  const payloadBase64 = token.split('.')[1];
  const payload = JSON.parse(atob(payloadBase64));
  console.log("Token payload:", payload);
  const expDate = new Date(payload.exp * 1000);
  console.log("Token expires at:", expDate.toLocaleString());
} else {
  console.log("No token in localStorage");
}

function isTokenExpired(token) {
  if (!token) return true;
  const payloadBase64 = token.split('.')[1];
  const payload = JSON.parse(atob(payloadBase64));
  const exp = payload.exp;
  const now = Math.floor(Date.now() / 1000);
  return exp < now;
}

if (!token || isTokenExpired(token)) {
  alert("⚠️ Your session has expired. Please login again.");
  window.location.href = "login.html";
} else {
  console.log("Token valid, fetching recipes...");
  FetchData();
}

async function FetchData() {
  try {
    console.log("Sending token:", token);

    const response = await fetch('/Recipes/Random', {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    console.log("Response status:", response.status);

    if (response.status === 401 || response.status === 403) {
      const errorText = await response.text();
      console.warn("Auth error response text:", errorText);

      alert("⚠️ Your session has expired. Please login again.");
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();
    console.log("Full data:", data);

    const recipeList = data.data.recipes;
    console.log("data.data.recipes:", recipeList);

    RenderData(recipeList);
  } catch (e) {
    console.error('Error fetching data:', e.message);
    alert("⚠️ Failed to load recipes.");
  }
}

function RenderData(recipeS) {
  container.innerHTML = '';
  console.log("recipeS :", recipeS);

  if (!recipeS || !recipeS.length) {
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
        <p><strong>Health Score:</strong> ${element.healthScore ?? 'N/A'}</p>
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
