import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import './TodoApp.css';

const TodoApp = () => {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState('');

	const API_URL = 'http://localhost:5000/tasks';

	useEffect(() => {
		axios
			.get(API_URL)
			.then((response) => {
				setTasks(response.data.tasks);
			})
			.catch((error) => console.error('Error fetching tasks:', error));
	}, []);

	const updateTasks = (updatedTasks) => {
		axios
			.put(API_URL, { tasks: updatedTasks })
			.then(() => setTasks(updatedTasks))
			.catch((error) => console.error('Error updating tasks:', error));
	};

	const addTask = () => {
		if (newTask.trim()) {
			const task = { title: newTask };
			axios
				.post(API_URL, task)
				.then((response) => {
					setTasks((prevTasks) => [...prevTasks, response.data]);
					setNewTask('');
				})
				.catch((error) => console.error('Error adding task:', error));
		}
	};

	const toggleTaskCompletion = (id) => {
		const updatedTasks = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
		updateTasks(updatedTasks);
	};

	const deleteTask = (id) => {
		axios
			.delete(`${API_URL}/${id}`)
			.then(() => {
				setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
			})
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
