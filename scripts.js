document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('add-task');
    const newTaskInput = document.getElementById('new-task');
    const tasksList = document.getElementById('tasks');
    let tasks = [];

    function addTask(event) {
        event.preventDefault();
        if (newTaskInput.value.trim() === '') {
            return;
        }
        const task = {
            id: Date.now(),
            label: newTaskInput.value.trim()
        };
        tasks.push(task);
        newTaskInput.value = '';
        renderTasks();
    }

    function removeTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }

    function renderTasks() {
        tasksList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.id = task.id;
            li.textContent = task.label;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => removeTask(li.id));
            li.appendChild(removeButton);
            tasksList.appendChild(li);
        });
    }

    addTaskButton.addEventListener('click', addTask);
    renderTasks();
});