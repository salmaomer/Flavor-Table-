const container = document.getElementById('favorites-container');

function loadFavorites() {
    const saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];

    container.innerHTML = ''; // تنظيف أي محتوى سابق

    if (!saved.length) {
        container.innerHTML = '<p style="text-align:center; font-size: 1.2rem;">No favorite recipes saved yet.</p>';
        return;
    }

    saved.forEach(element => {
        const card = document.createElement("div");
        card.className = "cards";

        const allIngredients = element.analyzedInstructions?.flatMap(instruction =>
            instruction.steps?.flatMap(step =>
                step.ingredients?.map(ing => ing.name) || []
            ) || []
        ) || [];

        const uniqueIngredients = [...new Set(allIngredients)];

        card.innerHTML = `
            <button class="delete-btn" title="Remove from Favorites">❌</button>
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
            </div>
        `;

        // حذف عند الضغط على الزر
        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            removeFromLocalStorage(element.id);
            card.remove(); // إزالة البطاقة من الواجهة
        });

        container.appendChild(card);
    });
}

function removeFromLocalStorage(id) {
    let saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    saved = saved.filter(recipe => recipe.id !== id);
    localStorage.setItem("savedRecipes", JSON.stringify(saved));
}

loadFavorites();
