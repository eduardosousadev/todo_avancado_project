// Seleção de elementos
const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const editForm = document.querySelector('#edit-form');
const editInput = document.querySelector('#edit-input');
const cancelEditBtn = document.querySelector('#cancel-edit-btn');
const searchInput = document.querySelector('#search-input');
const eraseBtn = document.querySelector('#erase-button');
const filterBtn = document.querySelector('#filter-select');
const options = document.querySelectorAll('option');

let oldInputValue;

// Funções
const saveTodo = (text, done = 0, save = 1) => {
    const todo = document.createElement('div');
    todo.classList.add('todo');

    const todoTitle = document.createElement('h3');
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement('button');
    doneBtn.classList.add('finish-todo');
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-todo');
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('remove-todo');
    deleteBtn.innerHTML = '<i class="fa-solid fa-x"></i>';
    todo.appendChild(deleteBtn);

    // Utilizando dados da local storage
    if(done) {
        todo.classList.add('done');
    }

    if(save) {
        saveTodoLocalStorage({text, done: 0});
    }

    todoList.appendChild(todo);

    todoInput.value = '';
    todoInput.focus();
};

const toggleForms = () => {
    editForm.classList.toggle('hide');
    todoForm.classList.toggle('hide');
    todoList.classList.toggle('hide');
}

const updateTodo = (text) => {
    const todos = document.querySelectorAll('.todo');
    todos.forEach((todo) => {
        let todoTitle = todo.querySelector('h3');

        if(todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
            // Utilizando dados da localStorage
            updateTodoLocalStorage(oldInputValue, text);
        };
    });
};

const getSearchTodos = (search) => {
    const todos = document.querySelectorAll('.todo');
    todos.forEach((todo) => {
        // Padronizando os caracteres para minúsculo
        let todoTitle = todo.querySelector('h3').innerText.toLocaleLowerCase();

        todo.style.display = 'flex';

        // Pegando os valores diferentes do search
        if(!todoTitle.includes(search)) {
            todo.style.display = 'none';
        };
    });
};

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll('.todo');
    const todoDone = document.querySelectorAll('.todo.done');
    switch(filterValue) {
        case 'all': 
            todos.forEach((todo) => (todo.style.display = 'flex'));
            todos.length > 2 ? todoList.classList.add('overflow') : todoList.classList.remove('overflow');
        break;
        case 'done':
            todos.forEach((todo) => 
            todo.classList.contains('done') 
            ? (todo.style.display = 'flex') 
            : (todo.style.display = 'none')
        );
        todoDone.length > 2 ? todoList.classList.add('overflow') : todoList.classList.remove('overflow');
        break;
        case 'todo':
            let todosQuant = 0;
            todos.forEach((todo) => {
                if(todo.classList.contains('done')) {
                    todo.style.display = 'none';
                }else if(todo.style.display = 'none') {
                    todo.style.display = 'flex';
                    todosQuant++;
                };
            });
            console.log(todosQuant);
            todosQuant > 2 ? todoList.classList.add('overflow') : todoList.classList.remove('overflow');
        break;

        default:
        break;
    };
};

const getScrollbar = () => {
    const todo = document.querySelectorAll('.todo');
    
    if(todo.length > 3) {
        // console.log('entrou');
        todoList.classList.add('overflow');
    } else {
        // console.log('saiu');
        todoList.classList.remove('overflow');
    }
}

// Eventos
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if(inputValue) {
        saveTodo(inputValue);
    };

    getScrollbar();
});

document.addEventListener('click', (e) => {
    // Pegando o elemento atual
    const targetEl = e.target;

    // Pegando o elemento div mais próximo(pai) do elemento atual
    const parentEl = targetEl.closest('div');

    let todoTitle;

    // Verificando se o elemento pai verificado tem um h3
    if(parentEl && parentEl.querySelector('h3')) {
        todoTitle = parentEl.querySelector('h3').innerText || '';
    }

    if(targetEl.classList.contains('finish-todo')) {
        parentEl.classList.toggle('done');

        updateTodoStatusLocalStorage(todoTitle);
    }
    if(targetEl.classList.contains('edit-todo')) {
        toggleForms();

        // Colocando o novo valor preenchido, já editado
        editInput.value = todoTitle;

        // Armazenando o valor antigo
        oldInputValue = todoTitle;
    }
    if(targetEl.classList.contains('remove-todo')) {
        parentEl.remove();

        getScrollbar()
        // Utilizando dados da localStorage
        removeTodoLocalStorage(todoTitle);
    };
});

todoInput.addEventListener('click', () => {
    options.forEach((select) => {
        if(select.value === 'all') {
            select.selected = true;
        }
    })
    const todos = document.querySelectorAll('.todo');
    
    todos.forEach((todo) => {
        todo.style.display = 'flex';
    });
    getScrollbar();
});

editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Armazenando o valor editado
    const editInputValue = editInput.value; 

    if(editInputValue) {
        updateTodo(editInputValue);
    };

    toggleForms();
});

cancelEditBtn.addEventListener('click', (e) => {
    e.preventDefault();

    toggleForms();
})

// Ativado quando uma tecla for solta
searchInput.addEventListener('keyup', (e) => {
    // Pegando o valor da tecla
    const search = e.target.value.toLowerCase();

    getSearchTodos(search);
});


eraseBtn.addEventListener('click', (e) => {
    e.preventDefault();

    searchInput.value = '';

    // Disparando um evento de keyup para fazer com que os todos aparecam após limpar a pesquisa
    searchInput.dispatchEvent(new Event('keyup'));

    searchInput.focus();
});

filterBtn.addEventListener('change', (e) => {

    // Pegando o valor do filtro selecionado
    const filterValue = e.target.value;

    filterTodos(filterValue);
})



// Local Storage
const getTodosLocalStorage = () => {
    // Pegando os dados da localStorage e convertendo de JSON para objeto, se não tiver nada, traga um array vazio
    const todos = JSON.parse(localStorage.getItem('todos')) || [];

    return todos;
}

// const loadTodos = () => {
//     const todos = getTodosLocalStorage();

//     todos.forEach((todo) => {
//         saveTodo(todo.text, todo.done, 0);
//     });
// };

const loadTodos = () => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0);
    });
    getScrollbar();
};

const saveTodoLocalStorage = (todo) => {
    // Pegar todos os todos da local storage
    const todos = getTodosLocalStorage();

    // Adicionar o novo todo no array recebido no local storage
    todos.push(todo);

    // Salvar tudo no local storage novamente
    localStorage.setItem('todos', JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text != todoText);
    
    localStorage.setItem('todos', JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    // Map não retorna dados, ele modifica os dados originais
    todos.map((todo) => 
        todo.text === todoText ? (todo.done = !todo.done) : null
    );

    localStorage.setItem('todos', JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();

    // Map não retorna dados, ele modifica os dados originais
    todos.map((todo) => 
        todo.text === todoOldText ? (todo.text = todoNewText) : null
    );

    localStorage.setItem('todos', JSON.stringify(todos));
};

loadTodos();