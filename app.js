document.addEventListener("DOMContentLoaded",()=>{
    const storedTasks=JSON.parse(localStorage.getItem('tasks'));

    if (storedTasks){
        storedTasks.forEach(task=>tasks.push(task));
        updateTasksList();
        updateStats();
        showTasks();
     }

    const filters = document.querySelectorAll('.filter');
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Toggle the active state
            if (filter.classList.contains('active')) {
                filter.classList.remove('active');
                showTasks(); // Show all tasks if no filter is active
            } else {
                filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                showTasks();
            }
        });
    });

    // Event listener for delete all button
    const deleteAllButton = document.querySelector('.delete-all');
    deleteAllButton.addEventListener('click', () => {
        tasks = [];
        updateTasksList();
        updateStats();
        saveTasks();
        showTasks();
    });
});

let tasks=[];

//local storage
const saveTasks = () => {
    localStorage.setItem('tasks',JSON.stringify(tasks));    //stored in local storage with key: tasks
};

const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();

    if (text){
        tasks.push({text: text,completed: false});
        taskInput.value="";
        updateTasksList();
        updateStats();
        saveTasks();
        showTasks();
    };
};

const toggleTaskComplete=(index)=>{
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    saveTasks();
    showTasks();
};

const deleteTask=(index)=>{
    tasks.splice(index,1);
    updateTasksList();
    updateStats();
    saveTasks();
    showTasks();
};

const editTask=(index)=>{
    const taskInput = document.getElementById('taskInput');
    taskInput.value=tasks[index].text;

    tasks.splice(index,1);
    updateTasksList();
    updateStats();
    saveTasks();
    showTasks();
};

const showTasks=()=>{
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const activeFilter = document.querySelector('.filter.active');
    const filterStatus = activeFilter ? activeFilter.dataset.filter : '';

    const filteredTasks = tasks.filter(task => {
        if (filterStatus === 'completed') {
            return task.completed;
        } else if (filterStatus === 'pending') {
            return !task.completed;
        }
        return true; // No filter, show all tasks
    });
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '';
        emptyImage.style.display = 'block';
    } else {
        taskList.innerHTML = filteredTasks.map((task, index) => `
            <div class="taskItem">
                <div class="task ${task.completed ? "completed" : ""}">
                    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTaskComplete(${index})"/>
                    <p>${task.text}</p>
                </div>
                <div class="icons">
                    <img src="./edit.png" onClick="editTask(${index})" />
                    <img src="./bin.png" onClick="deleteTask(${index})"/>
                </div>
            </div>
        `).join('');
        emptyImage.style.display = 'none';
    }
};


const updateStats = () => {
    const completedTasks = tasks.filter(task=>task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const progressBar=document.getElementById('progress');
    progressBar.style.width=`${progress}%`;

    document.getElementById('numbers').innerText=`${completedTasks}/${totalTasks}`;
};

const updateTasksList = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML='';

    tasks.forEach((task,index)=>{
        const listItem = document.createElement('li');
        listItem.innerHTML=`
        <div class="taskItem">
            <div class="task ${task.completed ? "completed" : ""}">
                <input type="checkbox" class="checkbox" ${task.completed ? "checked" : "" } onchange="toggleTaskComplete(${index})"/>
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <img src="./edit.png" onClick="editTask(${index})" />
                <img src="./bin.png" onClick="deleteTask(${index})"/>
            </div>
        </div>
        `;
        taskList.append(listItem);
    });
};

document.getElementById('newTask').addEventListener('click',function(e){
    e.preventDefault();

    addTask();
})


