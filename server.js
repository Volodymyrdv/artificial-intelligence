import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const tasksFilePath = 'tasks.json';

const loadTasksFromFile = () => {
	if (fs.existsSync(tasksFilePath)) {
		const rawData = fs.readFileSync(tasksFilePath);
		return JSON.parse(rawData);
	}
	return [];
};

const saveTasksToFile = () => {
	fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

let tasks = loadTasksFromFile();

app.get('/tasks', (req, res) => {
	res.json({ tasks });
});

app.put('/tasks', (req, res) => {
	const { tasks: updatedTasks } = req.body;
	tasks = updatedTasks;
	saveTasksToFile();
	res.status(200).json({ message: 'Tasks updated' });
});

app.post('/tasks', (req, res) => {
	const { title } = req.body;
	const newTask = {
		id: Date.now(),
		title,
		completed: false
	};
	tasks.push(newTask);
	saveTasksToFile();
	res.status(201).json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
	const { id } = req.params;
	tasks = tasks.filter((task) => task.id != id);
	saveTasksToFile();
	res.status(200).json({ message: 'Task deleted' });
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
