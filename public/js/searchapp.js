const addButton = document.getElementById('addButton');
const container = document.getElementById('container');
const form = document.getElementById('ingredients');

const MissUsed = [];
require("dotenv").config(); 
const API_KEY = process.env.API_KEY;

form.addEventListener('submit', function (e) {
  e.preventDefault();
  FetchData();
});

async function FetchData() {    
  const Input = document.getElementById('insart');
  const MUIngredients = Input.value.trim();

  if (!MUIngredients) {
        alert("Please fill the fields.");
        return;
  }

  MissUsed.push(MUIngredients);
  console.log("All Miss:", MissUsed);


  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=${process.env.API_KEY}?include-tags=${MissUsed.join(',')}`)
    .then(response => {
      response.json()
      console.log("Response:", response);
    })
    
    .catch(error => {
      console.error('Error:', error);
    });

    

  } 
  catch (error) {
        console.error('Error fetching data:', error);
  }

}

function RenderData(recipeS) {
  container.innerHTML = ''; // clear previous results

  recipeS.forEach(element => {
    const card = document.createElement("div");
    card.className = "cards";
    card.innerHTML = `
      <h2>${element.title}</h2>
      <img src="${element.image}" width="200">
      <p><strong>Used Ingredients:</strong></p>
      <ul>${element.usedIngredients.map(item => `<li>${item.name}</li>`).join('')}</ul>
      <p><strong>Missed Ingredients:</strong></p>
      <ul>${element.missedIngredients.map(item => `<li>${item.name}</li>`).join('')}</ul>
    `;
    container.appendChild(card);
  });
}
