import React, { useEffect, useState } from 'react';
import { type Task, getTasks, createTask, updateTask, deleteTask } from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const newTask = await createTask({ title, description });
      setTasks([...tasks, newTask]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      const updatedTask = await updateTask(task.id, { ...task, completed: !task.completed });
      setTasks(tasks.map(t => (t.id === task.id ? updatedTask : t)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Task Master</h1>
        <p>Stay organized, focused, and productive.</p>
      </header>

      <main className="main-content">
        <form className="task-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-title"
            required
          />
          <input
            type="text"
            placeholder="Details (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-desc"
          />
          <button type="submit" className="add-btn">Add Task</button>
        </form>

        <div className="task-list">
          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">No tasks yet. Enjoy your day!</div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-content" onClick={() => handleToggle(task)}>
                  <div className={`checkbox ${task.completed ? 'checked' : ''}`}></div>
                  <div className="task-text">
                    <h3>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                  </div>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(task.id)} aria-label="Delete Task">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Task Master. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
