function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function animateElement(element) {
    element.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-300', 'ease-out');
    setTimeout(() => {
        element.classList.remove('opacity-0', 'translate-y-4');
    }, 50);
}

function fetchToppings() {
    fetch('/toppings')
        .then(response => response.json())
        .then(toppings => {
            const toppingsList = document.getElementById('toppings-list');
            toppingsList.innerHTML = '';
            toppings.forEach(topping => {
                const toppingElement = createElementFromHTML(`
                    <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>${topping.name}</span>
                        <div>
                            <button onclick="editTopping(${topping.id}, '${topping.name}')" class="text-blue-500 hover:text-blue-700 mr-2">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteTopping(${topping.id})" class="text-red-500 hover:text-red-700">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `);
                toppingsList.appendChild(toppingElement);
                animateElement(toppingElement);
            });
            updatePizzaToppings(toppings);
        });
}

function fetchPizzas() {
    fetch('/pizzas')
        .then(response => response.json())
        .then(pizzas => {
            const pizzasList = document.getElementById('pizzas-list');
            pizzasList.innerHTML = '';
            pizzas.forEach(pizza => {
                const pizzaElement = createElementFromHTML(`
                    <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>${pizza.name} (${pizza.toppings.map(t => t.name).join(', ')})</span>
                        <div>
                            <button onclick="editPizza(${pizza.id}, '${pizza.name}', ${JSON.stringify(pizza.toppings)})" class="text-blue-500 hover:text-blue-700 mr-2">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deletePizza(${pizza.id})" class="text-red-500 hover:text-red-700">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `);
                pizzasList.appendChild(pizzaElement);
                animateElement(pizzaElement);
            });
        });
}

function updatePizzaToppings(toppings) {
    const pizzaToppings = document.getElementById('pizza-toppings');
    pizzaToppings.innerHTML = toppings.map(topping => 
        `<label class="flex items-center">
            <input type="checkbox" name="topping" value="${topping.id}" class="mr-2">
            <span>${topping.name}</span>
        </label>`
    ).join('');
}

document.getElementById('add-topping-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('topping-name').value;
    fetch('/toppings', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: name})
    }).then(response => response.json())
    .then(() => {
        fetchToppings();
        document.getElementById('topping-name').value = '';
    });
});

document.getElementById('add-pizza-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('pizza-name').value;
    const toppings = Array.from(document.querySelectorAll('input[name="topping"]:checked')).map(el => parseInt(el.value));
    fetch('/pizzas', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: name, toppings: toppings})
    }).then(response => response.json())
    .then(() => {
        fetchPizzas();
        document.getElementById('pizza-name').value = '';
        document.querySelectorAll('input[name="topping"]:checked').forEach(el => el.checked = false);
    });
});

function deleteTopping(id) {
    if (confirm('Are you sure you want to delete this topping?')) {
        fetch(`/toppings/${id}`, {method: 'DELETE'})
            .then(() => fetchToppings());
    }
}

function deletePizza(id) {
    if (confirm('Are you sure you want to delete this pizza?')) {
        fetch(`/pizzas/${id}`, {method: 'DELETE'})
            .then(() => fetchPizzas());
    }
}

function editTopping(id, currentName) {
    const newName = prompt('Enter new name for topping:', currentName);
    if (newName) {
        fetch(`/toppings/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: newName})
        }).then(() => fetchToppings());
    }
}

function editPizza(id, currentName, currentToppings) {
    const modal = document.getElementById('edit-pizza-modal');
    const form = document.getElementById('edit-pizza-form');
    const nameInput = document.getElementById('edit-pizza-name');
    const toppingsDiv = document.getElementById('edit-pizza-toppings');
    const pizzaIdInput = document.getElementById('edit-pizza-id');

    pizzaIdInput.value = id;
    nameInput.value = currentName;

    // Populate toppings
    fetch('/toppings')
        .then(response => response.json())
        .then(toppings => {
            toppingsDiv.innerHTML = toppings.map(topping => 
                `<label class="flex items-center">
                    <input type="checkbox" name="edit-topping" value="${topping.id}" 
                        ${currentToppings.some(ct => ct.id === topping.id) ? 'checked' : ''} class="mr-2">
                    <span>${topping.name}</span>
                </label>`
            ).join('');
        });

    modal.classList.remove('hidden');
}

document.getElementById('edit-pizza-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('edit-pizza-id').value;
    const name = document.getElementById('edit-pizza-name').value;
    const toppings = Array.from(document.querySelectorAll('input[name="edit-topping"]:checked')).map(el => parseInt(el.value));
    
    fetch(`/pizzas/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: name, toppings: toppings})
    }).then(response => response.json())
    .then(() => {
        fetchPizzas();
        document.getElementById('edit-pizza-modal').classList.add('hidden');
    });
});

document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('edit-pizza-modal').classList.add('hidden');
});

fetchToppings();
fetchPizzas();