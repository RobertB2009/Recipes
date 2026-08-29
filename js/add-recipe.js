const ingredientsContainer = document.getElementById("ingredients");
const instructionsContainer = document.getElementById("instructions");

const addIngredientButton = document.getElementById("addIngredient");
const addInstructionButton = document.getElementById("addInstruction");


// =========================
// ADD INGREDIENT
// =========================

addIngredientButton.addEventListener("click", () => {

    const row = document.createElement("div");

    row.className = "ingredient-row";

    row.innerHTML = `
        <input
            type="number"
            class="ingredient-amount"
            placeholder="1"
            step="any"
        >

        <input
            type="text"
            class="ingredient-unit"
            placeholder="cup"
        >

        <input
            type="text"
            class="ingredient-name"
            placeholder="ingredient"
        >
    `;

    ingredientsContainer.appendChild(row);
});


// =========================
// ADD INSTRUCTION
// =========================

addInstructionButton.addEventListener("click", () => {

    const stepNumber =
        instructionsContainer.querySelectorAll(".instruction-row").length + 1;

    const row = document.createElement("div");

    row.className = "instruction-row";

    row.innerHTML = `
        <span>${stepNumber}</span>

        <textarea
            class="instruction"
            placeholder="Describe this step..."
            required
        ></textarea>
    `;

    instructionsContainer.appendChild(row);
});


// =========================
// FORM SUBMISSION
// =========================

const recipeForm = document.getElementById("recipeForm");

recipeForm.addEventListener("submit", (event) => {

    event.preventDefault();

    console.log("Recipe form submitted!");

});