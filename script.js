let tasks = JSON.parse(localStorage.getItem('tdl_v2') || '[]');

  const taskInput  = document.getElementById('taskInput');
  const addBtn     = document.getElementById('addBtn');
  const taskList   = document.getElementById('taskList');

  function save() { localStorage.setItem('tdl_v2', JSON.stringify(tasks)); }

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
      taskInput.style.color = '#fc8181';
      setTimeout(() => taskInput.style.color = '', 600);
      return;
    }
    tasks.unshift({ id: Date.now(), text, completed: false, starred: false });
    save(); render();
    taskInput.value = '';
    taskInput.focus();
  }

  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keydown', e => e.key === 'Enter' && addTask());

  function render() {
    const sorted = [...tasks].sort((a,b) => b.starred - a.starred);
    const total  = tasks.length;
    const done   = tasks.filter(t => t.completed).length;
    document.getElementById('totalCount').textContent = total;
    document.getElementById('doneCount').textContent  = done;
    document.getElementById('leftCount').textContent  = total - done;

    if (!sorted.length) {
      taskList.innerHTML = '<div class="empty-msg">No tasks yet — add one below 🎯</div>';
      return;
    }

    taskList.innerHTML = '';
    sorted.forEach(task => {
      const row = document.createElement('div');
      row.className = `task-row${task.starred?' starred':''}${task.completed?' completed':''}`;

      row.innerHTML = `
        <div class="col-star">
          <button class="icon-btn star-btn" title="Star">⭐</button>
        </div>
        <div class="col-text">${escHtml(task.text)}</div>
        <div class="col-delete">
          <button class="icon-btn del-btn" title="Delete">🗑️</button>
        </div>
        <div class="col-status">
          <button class="icon-btn status-btn" title="Toggle">${task.completed ? '❤️' : '😡'}</button>
        </div>`;

      row.querySelector('.star-btn').addEventListener('click', () => {
        const idx = tasks.findIndex(t => t.id === task.id);
        tasks[idx].starred = !tasks[idx].starred;
        save(); render();
      });

      row.querySelector('.del-btn').addEventListener('click', () => {
        row.style.transition = 'opacity 0.22s, transform 0.22s';
        row.style.opacity = '0';
        row.style.transform = 'translateX(16px)';
        setTimeout(() => { tasks = tasks.filter(t => t.id !== task.id); save(); render(); }, 230);
      });

      row.querySelector('.status-btn').addEventListener('click', e => {
        const idx = tasks.findIndex(t => t.id === task.id);
        tasks[idx].completed = !tasks[idx].completed;
        e.currentTarget.classList.remove('pop');
        void e.currentTarget.offsetWidth;
        e.currentTarget.classList.add('pop');
        save(); render();
      });

      taskList.appendChild(row);
    });
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  render();