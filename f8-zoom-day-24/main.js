import { getDataFromLocalStorage, saveDataToLocalStorage } from './utils/localStorage.js';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const addButton = $('#add-task-btn');
const modalClose = $('.modal-close');
const cancelTaskButton = $('.cancel-task-btn');
const addTaskModal = $('#add-task-modal');
const taskTitle = $('#taskTitle');
const todoAppForm = $('.todo-app-form');
const taskGrid = $('.task-grid');
const modalTitle = $('.modal-title');
const submitBtn = $('.create-task-btn');
const searchInput = $('.search-input');
const filterList = $('.tab-list');

const defaultTodoTasks = getDataFromLocalStorage('tasks') || []

// load intital data
let todoTasks = defaultTodoTasks;

const initalTask = {
	title: '',
	description: '',
	category: '',
	priority: '',
	startTime: null,
	endTime: null,
	dueDate: null,
	cardColor: 'green',
	isCompletete: false,
}

let formMode = null;
let taskFilterMode = null;

const closeFrom = function () {
	// close form
	addTaskModal.classList.remove('show');

	// reset form data
	resetForm();

	// scroll to top
	setTimeout(() => window.scrollTo(0, 0), 100);
}

const openForm = function (mode = 'create') {
	const formItemIndex = todoAppForm.dataset.index;

	// set form mode
	formMode = mode;

	if (mode === 'create') {
		// change text in create mode modal
		modalTitle.textContent = 'Add New Task';
		submitBtn.textContent = 'Create Task';

		// clear item index if exist
		if (formItemIndex) {
			delete todoAppForm.dataset.index;
		}
	}

	// change text in edit modal
	if (mode === 'edit') {
		modalTitle.textContent = 'Edit Task';
		submitBtn.textContent = 'Edit';
	}

	// open modal
	addTaskModal.classList.add('show');

	// focus on the first element after a small delay to ensure modal is visible
	setTimeout(() => {
		taskTitle.focus();
	}, 100);
}

const submitForm = function (event, formMode) {
	// prevent form default behavior
	event.preventDefault();
	const formData = Object.fromEntries(new FormData(todoAppForm).entries());

	// if create mode
	if (formMode === 'create') {
		const newTask = { ...initalTask, ...formData };

		// add new task
		todoTasks.push(newTask);
	}

	// if edit mode
	if (formMode === 'edit') {
		const itemIndex = todoAppForm.dataset.index;

		// edit data with index
		todoTasks[itemIndex] = { ...formData };
	}


	// retset form after load
	resetForm();

	// close form
	closeFrom();

	// save tasks to local storage
	saveDataToLocalStorage('tasks', todoTasks);

	// re-render task grid UI
	renderTask();
}

const resetForm = function () {
	todoAppForm.reset();
}

// This only can open in edit mode
const openTodoItemMenu = function (event) {
	const editBtn = event.target.closest('.edit-btn');
	const deleteBtn = event.target.closest('.delete-btn');
	const completeBtn = event.target.closest('.active-btn');
	const itemIndex = event.target.dataset?.index;

	if (editBtn) {
		const editData = todoTasks[itemIndex];

		// add item index to form data set, use for submit
		todoAppForm.dataset.index = itemIndex;

		// load data to form
		for (const key in editData) {
			const input = $(`[name=${key}]`);
			const value = editData[key];
			if (input) {
				input.value = value;
			}
		}

		// open form
		openForm('edit');
	}

	if (deleteBtn) {
		if (confirm('Do you want to delete this todo')) {
			// remove task
			todoTasks.splice(itemIndex, 1);

			// save tasks to local storage
			saveDataToLocalStorage('tasks', todoTasks);

			// re-render task
			renderTask();
		}
	}

	if (completeBtn) {
		const task = todoTasks[itemIndex];
		task.isCompletete = !task.isCompletete;

		// save tasks to local storage
		saveDataToLocalStorage('tasks', todoTasks);

		// re-render task
		renderTask();
	}
}

const renderTask = function () {
	// if no data
	if (!todoTasks.length) {
		taskGrid.innerHTML = `
            <p>Chưa có công việc nào.</p>
        `;
		return;
	}

	const tasks = todoTasks.map(({ title, description, category, priority, startTime, endTime, dueDate, cardColor, isCompletete }, index) => {
		return `
			<div class="task-card ${cardColor} ${isCompletete ? 'completed' : ''}">
				<div class="task-header">
					<h3 class="task-title">${title}</h3>
					<button class="task-menu">
						<i class="fa-solid fa-ellipsis fa-icon"></i>
						<div class="dropdown-menu">
							<div class="dropdown-item edit-btn" data-index="${index}">
								<i class="fa-solid fa-pen-to-square fa-icon"></i>
								Edit
							</div>
							<div class="dropdown-item complete active-btn" data-index="${index}">
								<i class="fa-solid fa-check fa-icon"></i>
								${isCompletete ? 'Mark as Active' : 'Mark as Complete'}
							</div>
							<div class="dropdown-item delete delete-btn" data-index="${index}">
								<i class="fa-solid fa-trash fa-icon"></i>
								Delete
							</div>
						</div>
					</button>
				</div>
				<p class="task-description">${description}</p>
				<div class="task-time">${startTime} - ${endTime}</div>
			</div>
		`;
	});

	taskGrid.innerHTML = tasks.join('');
}

const onSearch = function (event) {
	const searchValue = event.target.value;
	let searchedTasks = defaultTodoTasks;

	// blank value return all data
	if (searchValue.trim() !== '') {
		// filter search results
		searchedTasks = searchedTasks.filter(task => {
			if (task.title.trim() !== "" && task.title.toLowerCase().includes(searchValue.toLowerCase())) return true;
			if (task.description.trim() !== "" && task.description.toLowerCase().includes(searchValue.toLowerCase())) return true;

			return false;
		});
	}

	todoTasks = searchedTasks;

	// re-render task
	renderTask();
}

const handleTaskFilter = function (event) {
	const clickedActiveButton = event.target.closest('.active-filter-btn');
	const clickedCompleteButton = event.target.closest('.completed-filter-btn');
	const activeButton = $('.active-filter-btn');
	const completedButton = $('.completed-filter-btn');
	// fetch data from local storage
	let filterTasks = defaultTodoTasks;

	// filter acitve task
	if (clickedActiveButton) {
		// handle toggle for display active filter button
		clickedActiveButton.classList.toggle("active");
		completedButton.classList.remove("active");

		const isActiveFilter = clickedActiveButton.classList.contains('active');
		if (isActiveFilter) {
			filterTasks = filterTasks.filter(task => !task.isCompletete);
		}
	}

	// filter complete task
	if (clickedCompleteButton) {
		// handle toggle for display complete filter button
		clickedCompleteButton.classList.toggle("active");
		activeButton.classList.remove("active");

		const isCompletedFilter = clickedCompleteButton.classList.contains('active');
		if (isCompletedFilter) {
			filterTasks = filterTasks.filter(task => task.isCompletete)
		}
	}

	todoTasks = filterTasks;

	renderTask();
}

// bind event
addButton.onclick = () => openForm('create');

modalClose.onclick = closeFrom;

cancelTaskButton.onclick = closeFrom;

todoAppForm.onsubmit = (event) => submitForm(event, formMode);

taskGrid.onclick = openTodoItemMenu;

searchInput.oninput = onSearch;

filterList.onclick = handleTaskFilter;

// render task at first time
renderTask();


