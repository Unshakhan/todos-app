import supabase from "./supabase.js";
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById("logout-btn");
    const taskInput = document.getElementById("task-input")
    const addTaskBtn = document.getElementById("add-task-btn")
    const taskList = document.getElementById("task-list");
    const emptyImg = document.querySelector('.empty-img');
    const todoscontainer = document.querySelector('.todos-container')
    const progressBar = document.getElementById('progress')
    const progressNum = document.getElementById('numbers')

    const toggleEmptyState = () => {
        emptyImg.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todoscontainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    }
    const updateProgress = () => {
        const totalTasks = taskList.querySelectorAll('li').length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;

        progressBar.style.width = totalTasks
            ? `${(completedTasks / totalTasks) * 100}%`
            : '0%';

        progressNum.textContent = `${completedTasks} / ${totalTasks}`;

        if( totalTasks > 0 && completedTasks === totalTasks){
            launchConfetti()
        }
    }

    const addTask = async (text, completed = false, id = null) => {
        // event.preventDefault()
        const taskText = text || taskInput.value.trim();
        if (!taskText) {
            return;
        }
          // 🔥 INSERT only if id not provided
    if (!id) {
        const { data, error } = await supabase
            .from('todos')
            .insert([{ text: taskText, is_completed: false }])
            .select();

        if (error) {
            console.log(error);
            return;
        }

        id = data[0].id;
    }

        const li = document.createElement('li');
        li.innerHTML = `
<input type ="checkbox" class="checkbox" ${completed ? 'checked' : ''} />
<span>${taskText}</span>
 <div class="task-buttons">
                <button class="edit-btn">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
`;

        const checkbox = li.querySelector('.checkbox')


        const editBtn = li.querySelector('.edit-btn')

        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5'
            editBtn.style.pointerEvents = 'none'
        }

        checkbox.addEventListener('change', async () => {
            const isChecked = checkbox.checked;
            
        await supabase
            .from('todos')
            .update({ is_completed: isChecked })
            .eq('id', id);

            li.classList.toggle('completed', isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
            isChecked ? 'none' : 'auto';
            updateProgress()
        })
        // editBtn.addEventListener('click', () => {
        //     if (!checkbox.checked) {
        //         taskInput.value = li.querySelector('span').textContent;
        //         li.remove();
        //         toggleEmptyState();
        //         updateProgress(false)
        //     }
        // })
        editBtn.addEventListener('click', async () => {
        const newText = prompt("Edit your task:", taskText);
        if (newText) {
            await supabase
                .from('todos')
                .update({ text: newText })
                .eq('id', id);

            li.querySelector('span').textContent = newText;
        }
    });

        li.querySelector('.delete-btn').addEventListener('click', async () => {
           
           
        await supabase
            .from('todos')
            .delete()
            .eq('id', id);

            li.remove()
            toggleEmptyState();
            updateProgress()
        })
        // li.textContent = taskText;
        taskList.appendChild(li);
        taskInput.value = ""
        toggleEmptyState();
        updateProgress()
    }
    // addTaskBtn.addEventListener('click', () => addTask());
    const form = document.querySelector('.input-area');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask();
});
    taskInput.addEventListener('keypress', (e) => {

        if (e.key === 'Enter') {
            e.preventDefault();
            addTask()
        }
    })
    const fetchTasks = async () => {
    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.log(error);
        return;
    }

    taskList.innerHTML = "";

    data.forEach(task => {
        addTask(task.text, task.is_completed, task.id);
    });
};

fetchTasks();

logoutBtn.addEventListener("click", async () => {

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.log(error);
        alert("Logout failed");
    } else {
        alert("Logged out successfully");
        window.location.href = "index.html"; // login page
    }

});


})

const launchConfetti = () =>{
    const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
  spread: 60,
});

fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});
}
