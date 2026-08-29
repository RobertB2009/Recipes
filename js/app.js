let recipes = [];


// =========================
// LOAD RECIPES
// =========================

async function loadRecipes() {

    try {

        const response = await fetch("data/recipes.json");

        if (!response.ok) {
            throw new Error("Could not load recipes.");
        }

        recipes = await response.json();

        displayRecipes(recipes);

    } catch (error) {

        console.error("Error loading recipes:", error);

    }
}


// =========================
// DISPLAY RECIPES
// =========================

function displayRecipes(recipeList) {

    const recipeGrid =
        document.getElementById("recipeGrid");

    if (!recipeGrid) {
        return;
    }

    recipeGrid.innerHTML = "";


    if (recipeList.length === 0) {

        recipeGrid.innerHTML = `
            <p class="empty-message">
                No recipes found.
            </p>
        `;

        return;
    }


    recipeList.forEach((recipe) => {

        const card = document.createElement("article");

        card.className = "recipe-card";

        card.innerHTML = `
            <div class="recipe-image">
    ${recipe.image || "🍴"}
</div>

            <div class="recipe-info">

                <span class="recipe-category">
                    ${recipe.category}
                </span>

                <h3>${recipe.name}</h3>

                <p>
                    ${recipe.description}
                </p>

                <div class="recipe-meta">
                    <span>
                        ⏱️ ${recipe.prepTime + recipe.cookTime} min
                    </span>

                    <span>
                        🍽️ ${recipe.servings} servings
                    </span>
                </div>

            </div>
        `;


        card.addEventListener("click", () => {

            window.location.href =
                `recipe.html?id=${recipe.id}`;

        });


        recipeGrid.appendChild(card);

    });
}


// =========================
// SEARCH
// =========================

const searchInput =
    document.getElementById("searchInput");


if (searchInput) {

    searchInput.addEventListener("input", () => {

        const searchTerm =
            searchInput.value.toLowerCase().trim();


        const filteredRecipes =
            recipes.filter((recipe) => {

                const searchableText = [

                    recipe.name,

                    recipe.description,

                    recipe.category,

                    ...(recipe.tags || []),

                    ...(recipe.ingredients || []).map(
                        ingredient => ingredient.name
                    )

                ]
                .join(" ")
                .toLowerCase();


                return searchableText.includes(searchTerm);

            });


        displayRecipes(filteredRecipes);

    });

}


// =========================
// START APP
// =========================

loadRecipes();