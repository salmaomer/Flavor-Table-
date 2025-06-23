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
    // منع التكرار
    if (!MissUsed.includes(inputValue)) {
      MissUsed.push(inputValue);
    }
  } else {
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

  } catch (e) {
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
// ✅ تفعيل الزر بعد إنشاء الـ HTML
        const saveButton = card.querySelector('.save-btn');
        saveButton.addEventListener('click', () => {
            saveToLocalStorage(element);
            saveButton.classList.add('saved'); // تغيير لون القلب
            saveButton.innerHTML = "❤️"; // تغيير شكل القلب
        });

container.appendChild(card);

  });
}

//local storage
function saveToLocalStorage(recipe) {
    const saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];

    const alreadySaved = saved.some(item => item.id === recipe.id);
    if (alreadySaved) {
        alert("This recipe is already saved.");
        return;
    }

    saved.push({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        instructions: recipe.instructions,
        analyzedInstructions: recipe.analyzedInstructions
    });

    localStorage.setItem("savedRecipes", JSON.stringify(saved));
    alert("Recipe saved!");
}

FetchData();
