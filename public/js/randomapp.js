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

    }catch(e){
        console.error('Error fetching data:', e.message);
    }   

}

function RenderData(recipeS) {
    recipeS.forEach(element => {
        const card = document.createElement("div");
        card.className = "cards";

        const ingredientsList = element.analyzedInstructions?.flatMap(i =>
            i.steps?.flatMap(s =>
                s.ingredients?.map(ing => `• ${ing.name}`) || []
            ) || []
        ).join("<br>") || "No ingredients listed.";

        card.innerHTML = ` 
            <img src="${element.image}" alt="${element.title}">    
            <div class="card-content">
                <h3>${element.title}</h3>
                <p>${element.instructions || "No instructions provided."}</p>
                <p><strong>Ingredients:</strong><br>${ingredientsList}</p>
            </div>
        `;

        container.appendChild(card);
    });
}

FetchData();