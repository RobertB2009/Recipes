let recipe = null;


// =========================
// GET RECIPE ID
// =========================

const params = new URLSearchParams(window.location.search);

const recipeId = params.get("id");


// =========================
// LOAD RECIPE
// =========================

async function loadRecipe() {

    try {

        const response =
            await fetch("data/recipes.json");

        if (!response.ok) {
            throw new Error("Could not load recipes.");
        }

        const recipes =
            await response.json();


        recipe =
            recipes.find(item => item.id === recipeId);


        if (!recipe) {

            showError("Recipe not found.");

            return;
        }


        displayRecipe(recipe);


    } catch (error) {

        console.error(error);

        showError("Something went wrong loading this recipe.");

    }
}


// =========================
// DISPLAY RECIPE
// =========================

function displayRecipe(recipe) {

    const recipePage =
        document.getElementById("recipePage");


    document.title =
        `${recipe.name} • RecipeVault`;


    const totalTime =
        recipe.prepTime + recipe.cookTime;


    recipePage.innerHTML = `

        <a href="index.html" class="back-button">
            ← Back to recipes
        </a>


        <section class="recipe-header">

            <div class="recipe-header-content">

                <span class="recipe-category">
                    ${recipe.category}
                </span>

                <h1>${recipe.name}</h1>

                <p class="recipe-description">
                    ${recipe.description}
                </p>


                <div class="recipe-details">

                    <div>
                        <span>⏱️</span>
                        <strong>${totalTime} min</strong>
                        <small>Total Time</small>
                    </div>

                    <div>
                        <span>🔥</span>
                        <strong>${recipe.prepTime} min</strong>
                        <small>Prep</small>
                    </div>

                    <div>
                        <span>🍳</span>
                        <strong>${recipe.cookTime} min</strong>
                        <small>Cook</small>
                    </div>

                    <div>
                        <span>🍽️</span>
                        <strong>${recipe.servings}</strong>
                        <small>Servings</small>
                    </div>

                </div>

            </div>

        </section>


        <section class="recipe-content">

            <div class="ingredients-section">

                <div class="section-header">

    <div>
        <h2>Ingredients</h2>

        <div class="serving-control">

            <button id="decreaseServings">
                −
            </button>

            <span>
                <strong id="servingsDisplay">
                    ${recipe.servings}
                </strong>
                servings
            </span>

            <button id="increaseServings">
                +
            </button>

        </div>
    </div>

    <button id="cookingModeButton" class="cooking-mode-button">
        👨‍🍳 Cooking Mode
    </button>

</div>
                </div>


                <ul id="ingredientList" class="ingredient-list"></ul>

            </div>


            <div class="instructions-section">

                <h2>Instructions</h2>

                <ol id="instructionList" class="instruction-list"></ol>

            </div>


            ${
                recipe.notes
                    ? `
                        <div class="notes-section">

                            <h2>Notes</h2>

                            <div class="notes-box">
                                ${recipe.notes}
                            </div>

                        </div>
                    `
                    : ""
            }


            ${
                recipe.tags && recipe.tags.length
                    ? `
                        <div class="tags-section">

                            ${recipe.tags.map(tag => `
                                <span class="recipe-tag">
                                    #${tag}
                                </span>
                            `).join("")}

                        </div>
                    `
                    : ""
            }

        </section>
    `;


    displayIngredients(recipe.servings);

    displayInstructions(recipe);


    setupServingControls();

}


// =========================
// DISPLAY INGREDIENTS
// =========================

function displayIngredients(servings) {

    const ingredientList =
        document.getElementById("ingredientList");


    const multiplier =
        servings / recipe.servings;


    ingredientList.innerHTML = "";


    recipe.ingredients.forEach((ingredient) => {

        const amount =
            ingredient.amount * multiplier;


        const li =
            document.createElement("li");


        li.innerHTML = `

            <span class="ingredient-amount">
                ${formatAmount(amount)}
            </span>

            <span class="ingredient-unit">
                ${ingredient.unit}
            </span>

            <span>
                ${ingredient.name}
            </span>

        `;


        ingredientList.appendChild(li);

    });


    document.getElementById("servingsDisplay").textContent =
        servings;

}


// =========================
// FORMAT FRACTIONS
// =========================

function formatAmount(amount) {

    const whole =
        Math.floor(amount);

    const fraction =
        amount - whole;


    const fractions = [

        { value: 1 / 8, symbol: "⅛" },
        { value: 1 / 6, symbol: "⅙" },
        { value: 1 / 4, symbol: "¼" },
        { value: 1 / 3, symbol: "⅓" },
        { value: 3 / 8, symbol: "⅜" },
        { value: 1 / 2, symbol: "½" },
        { value: 5 / 8, symbol: "⅝" },
        { value: 2 / 3, symbol: "⅔" },
        { value: 3 / 4, symbol: "¾" },
        { value: 5 / 6, symbol: "⅚" },
        { value: 7 / 8, symbol: "⅞" }
    ];


    for (const item of fractions) {

        if (Math.abs(fraction - item.value) < 0.01) {

            if (whole === 0) {
                return item.symbol;
            }

            return `${whole}${item.symbol}`;
        }
    }


    if (Number.isInteger(amount)) {
        return amount.toString();
    }


    return amount
        .toFixed(2)
        .replace(/0+$/, "")
        .replace(/\.$/, "");
}


// =========================
// DISPLAY INSTRUCTIONS
// =========================

function displayInstructions(recipe) {

    const instructionList =
        document.getElementById("instructionList");


    recipe.instructions.forEach((instruction) => {

        const li =
            document.createElement("li");


        li.textContent =
            instruction;


        instructionList.appendChild(li);

    });

}


// =========================
// SERVING CONTROLS
// =========================

function setupServingControls() {

    let currentServings =
        recipe.servings;


    document
        .getElementById("decreaseServings")
        .addEventListener("click", () => {

            if (currentServings <= 1) {
                return;
            }

            currentServings--;

            displayIngredients(currentServings);

        });


    document
        .getElementById("increaseServings")
        .addEventListener("click", () => {

            currentServings++;

            displayIngredients(currentServings);

        });

}


// =========================
// ERROR
// =========================

function showError(message) {

    document.getElementById("recipePage").innerHTML = `

        <section class="error-message">

            <h1>Oops!</h1>

            <p>${message}</p>

            <a href="index.html">
                ← Back to recipes
            </a>

        </section>
    `;
}

// =========================
// COOKING MODE
// =========================

function setupCookingMode() {

    const button =
        document.getElementById("cookingModeButton");


    if (!button) {
        return;
    }


    button.addEventListener("click", () => {

        startCookingMode();

    });

}

function startCookingMode() {

    let currentStep = 0;

    const instructions =
        recipe.instructions;


    const overlay =
        document.createElement("div");

    overlay.className = "cooking-mode";


    document.body.appendChild(overlay);


    function showStep() {

        const instruction =
            instructions[currentStep];


        const text =
            typeof instruction === "string"
                ? instruction
                : instruction.text;


        overlay.innerHTML = `

            <div class="cooking-mode-inner">

                <button
                    class="close-cooking-mode"
                    id="closeCookingMode"
                >
                    ✕
                </button>


                <div class="cooking-progress">
                    STEP ${currentStep + 1}
                    OF ${instructions.length}
                </div>


                <h1>
                    ${recipe.name}
                </h1>


                <div class="cooking-step">

                    <div class="step-number">
                        ${currentStep + 1}
                    </div>

                    <p>
                        ${text}
                    </p>

                </div>


                <div class="cooking-navigation">

                    <button
                        id="previousStep"
                        ${currentStep === 0 ? "disabled" : ""}
                    >
                        ← Previous
                    </button>


                    ${
                        currentStep === instructions.length - 1
                            ? `
                                <button id="finishCooking">
                                    ✓ Finish
                                </button>
                            `
                            : `
                                <button id="nextStep">
                                    Next →
                                </button>
                            `
                    }

                </div>

            </div>
        `;


        // =========================
        // CLOSE COOKING MODE
        // =========================

        document
            .getElementById("closeCookingMode")
            .addEventListener("click", () => {

                overlay.remove();

            });


        // =========================
        // PREVIOUS STEP
        // =========================

        const previous =
            document.getElementById("previousStep");


        if (previous) {

            previous.addEventListener("click", () => {

                currentStep--;

                showStep();

            });

        }


        // =========================
        // NEXT STEP
        // =========================

        const next =
            document.getElementById("nextStep");


        if (next) {

            next.addEventListener("click", () => {

                currentStep++;

                showStep();

            });

        }


        // =========================
        // FINISH
        // =========================

        const finish =
            document.getElementById("finishCooking");


        if (finish) {

            finish.addEventListener("click", () => {

                overlay.remove();

            });

        }

    }


    showStep();

}


// =========================
// START
// =========================

loadRecipe();