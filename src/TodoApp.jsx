import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import './TodoApp.css';

const TodoApp = () => {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState('');

	const API_URL = 'https://api.jsonbin.io/v3/b/6799767de41b4d34e4805b21';

	useEffect(() => {
		axios
			.get(API_URL)
			.then((response) => setTasks(response.data.record.tasks || []))
			.catch((error) => console.error('Error fetching tasks:', error));
	}, []);

	const addTask = () => {
		if (newTask.trim()) {
			const task = { id: Date.now(), title: newTask, completed: false };
			const updatedTasks = [...tasks, task].sort((a, b) => b.completed - a.completed);

			axios
				.put(API_URL, { record: { tasks: updatedTasks } })
				.then(() => {
					setTasks(updatedTasks);
					setNewTask('');
				})
				.catch((error) => console.error('Error updating tasks:', error));
		}
	};

	const toggleTaskCompletion = (id) => {
		const updatedTasks = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
		const sortedTasks = [...updatedTasks].sort((a, b) => b.completed - a.completed);

		axios
			.put(API_URL, { record: { tasks: sortedTasks } })
			.then(() => setTasks(sortedTasks))
			.catch((error) => console.error('Error updating task:', error));
	};

	const deleteTask = (id) => {
		const updatedTasks = tasks.filter((t) => t.id !== id);
		const sortedTasks = [...updatedTasks].sort((a, b) => b.completed - a.completed);

		axios
			.put(API_URL, { record: { tasks: sortedTasks } })
			.then(() => setTasks(sortedTasks))
			.catch((error) => console.error('Error deleting task:', error));
	};

	return (
		<div className='app-container'>
			<h1 className='app-title'>To-Do List</h1>
			<div className='card'>
				<div className='card-content'>
					<div className='input-group'>
						<input
							className='task-input'
							placeholder='Add a new task...'
							value={newTask}
							onChange={(e) => setNewTask(e.target.value)}
						/>
						<button onClick={addTask} className='add-button'>
							Add
						</button>
					</div>
					<ul className='task-list'>
						<AnimatePresence>
							{tasks.map((task) => (
								<motion.li
									key={task.id}
									className={`task-item ${task.completed ? 'completed' : ''}`}
									layout
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.3 }}
								>
									<span onClick={() => toggleTaskCompletion(task.id)} className='task-title'>
										{task.completed ? '👍 ' : '👎 '}
										{task.title}
									</span>
									<button className='delete-button' onClick={() => deleteTask(task.id)}>
										Delete
									</button>
								</motion.li>
							))}
						</AnimatePresence>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default TodoApp;
