//dom elements
const search = document.querySelector(".search");
const submit = document.querySelector("#submit");
const random = document.querySelector(".random__btn");
const mealsElement = document.querySelector(".meals");
const resultHeading = document.querySelector(".result__heading");
const singleMealElement = document.querySelector(".meals__single");

//functions

//search meal and fetch api data
const searchMeal = (event) => {
	event.preventDefault();

	//clear single meal
	singleMealElement.innerHTML = "";

	//get Search term
	const term = search.value.toLowerCase();

	//check for empty
	if (term.trim()) {
		fetch(`
        https://www.themealdb.com/api/json/v1/1/search.php?s=${term}
        `)
			.then((response) => response.json())
			.then((data) => {
				resultHeading.innerHTML = `<h2 class="center-align">Search Results for "${term}"</h2>`;

				if (data.meals === null) {
					resultHeading.innerHTML = `<p>No results found</p>`;
					//focus on input regained
					search.focus();
					//empty search value
					search.value = "";
				} else {
					mealsElement.innerHTML = data.meals
						.map(
							(meal) => `
                        <div class="meal meal__info col s12 m6 l4 xl3" data-mealID="${meal.idMeal}">  
                            <div class="card">
                            <div class="card-image">
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                                <a class="btn-floating halfway-fab waves-effect waves-light light-blue accent-4"><i class="fal fa-info "></i></a>
                                <span class="card-title">${meal.strMeal}</span>

                            </div>
                            </div>
                        </div>
                    `
						)
						.join("");
				}
			});
		//clear search
		search.value = "";
	} else {
		resultHeading.innerHTML = `<p data-error="wrong">Please insert a search term</p>`;
		search.focus();
	}
};

//fetchmeal by id
const getMealById = (mealID) => {
	fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
		.then((response) => response.json())
		.then((data) => {
			const meal = data.meals[0];

			addMealToDom(meal);
		});
};

//randomize meal
const randomMeal = () => {
	//clear dom
	mealsElement.innerHTML = "";
	resultHeading.innerHTML = "";

	fetch("https://www.themealdb.com/api/json/v1/1/random.php")
		.then((response) => response.json())
		.then((data) => {
			const meal = data.meals[0];

			addMealToDom(meal);
		});
};

//add meal to dom
const addMealToDom = (meal) => {
	mealsElement.innerHTML = "";
	resultHeading.innerHTML = "";
	const ingredients = [];
	for (let i = 1; i <= 20; i++) {
		if (meal[`strIngredient${i}`]) {
			ingredients.push(
				`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
			);
		} else {
			break;
		}
	}

	console.log(singleMealElement);

	singleMealElement.innerHTML = `
        <div class="single__meal">
            <div class="card single-card">
                <div class="card-image single-card-image">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                    <span class="card-title">${meal.strMeal}</span>
                </div>
                <div class="card-content single-card-content">
                    <p>${meal.strInstructions}</p>
                    <h3>Ingredients</h3>
                    <ul class="collection">
                        ${ingredients
													.map(
														(ingredient) =>
															`<li class="collection-item">${ingredient}</li>`
													)
													.join("")}
                    </ul>
                <div class="single__meal-info card-action">
                    ${
											meal.strCategory
												? `<span class="chip">${meal.strCategory}</span>`
												: ""
										} 
                    ${
											meal.strArea
												? `<span class="chip">${meal.strArea}</span>`
												: ""
										} 
                </div>
                </div>
            </div>
        </div>
    `;
};

//event listeners
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", randomMeal);

mealsElement.addEventListener("click", (event) => {
	const mealInfo = event.path.find((item) => {
		if (item.classList) {
			return item.classList.contains("meal__info");
		} else {
			false;
		}
	});

	if (mealInfo) {
		const mealID = mealInfo.getAttribute("data-mealID");
		getMealById(mealID);
	}
});
