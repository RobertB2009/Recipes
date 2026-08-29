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

    <select class="ingredient-unit">
        <option value="">Unit</option>

        <optgroup label="Volume">
            <option value="tsp">tsp</option>
            <option value="tbsp">tbsp</option>
            <option value="cup">cup</option>
            <option value="fl oz">fl oz</option>
            <option value="pint">pint</option>
            <option value="quart">quart</option>
            <option value="gallon">gallon</option>
            <option value="mL">mL</option>
            <option value="L">L</option>
        </optgroup>

        <optgroup label="Weight">
            <option value="oz">oz</option>
            <option value="lb">lb</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
        </optgroup>

        <optgroup label="Other">
            <option value="whole">whole</option>
            <option value="pinch">pinch</option>
            <option value="dash">dash</option>
            <option value="package">package</option>
            <option value="can">can</option>
            <option value="jar">jar</option>
            <option value="bunch">bunch</option>
            <option value="slice">slice</option>
        </optgroup>

        <option value="custom">Custom...</option>
    </select>

    <input
        type="text"
        class="ingredient-custom-unit"
        placeholder="Custom unit"
        hidden
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

    // Get basic recipe information
    const name = document.getElementById("recipeName").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;
    const servings = Number(document.getElementById("servings").value);
    const prepTime = Number(document.getElementById("prepTime").value) || 0;
    const cookTime = Number(document.getElementById("cookTime").value) || 0;
    const notes = document.getElementById("notes").value.trim();


    // =========================
    // GET INGREDIENTS
    // =========================

    const ingredientRows =
        ingredientsContainer.querySelectorAll(".ingredient-row");

    const ingredients = [];

    ingredientRows.forEach((row) => {

        const amount =
            row.querySelector(".ingredient-amount").value;

        const unit =
            row.querySelector(".ingredient-unit").value.trim();

        const ingredientName =
            row.querySelector(".ingredient-name").value.trim();

        // Ignore completely empty ingredient rows
        if (!amount && !unit && !ingredientName) {
            return;
        }

        ingredients.push({
            amount: Number(amount) || 0,
            unit: unit,
            name: ingredientName
        });
    });


    // =========================
    // GET INSTRUCTIONS
    // =========================

    const instructionElements =
        instructionsContainer.querySelectorAll(".instruction");

    const instructions = [];

    instructionElements.forEach((element) => {

        const instruction =
            element.value.trim();

        if (instruction) {
            instructions.push(instruction);
        }
    });


    // =========================
    // CREATE RECIPE ID
    // =========================

    const id = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");


    // =========================
    // CREATE RECIPE OBJECT
    // =========================

    const recipe = {

        id: id,

        name: name,

        description: description,

        category: category,

        prepTime: prepTime,

        cookTime: cookTime,

        servings: servings,

        ingredients: ingredients,

        instructions: instructions,

        tags: [],

        favorite: false,

        notes: notes

    };


    // =========================
    // SHOW GENERATED JSON
    // =========================

  const jsonResult = document.getElementById("jsonResult");
const jsonOutput = document.getElementById("jsonOutput");
const copyJsonButton = document.getElementById("copyJson");

const formattedJson = JSON.stringify(recipe, null, 4);

jsonOutput.value = formattedJson;
jsonResult.hidden = false;

jsonResult.scrollIntoView({
    behavior: "smooth",
    block: "start"
});


// =========================
// COPY JSON
// =========================

copyJsonButton.onclick = async () => {

    try {

        await navigator.clipboard.writeText(formattedJson);

        copyJsonButton.textContent = "✓ Copied!";

        setTimeout(() => {
            copyJsonButton.textContent = "📋 Copy JSON";
        }, 2000);

    } catch (error) {

        jsonOutput.select();

        document.execCommand("copy");

        copyJsonButton.textContent = "✓ Copied!";

        setTimeout(() => {
            copyJsonButton.textContent = "📋 Copy JSON";
        }, 2000);
    }
};

});