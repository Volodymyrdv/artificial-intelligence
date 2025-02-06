import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let tasks = [];

app.get('/tasks', (req, res) => {
	res.json({ tasks });
});

app.put('/tasks', (req, res) => {
	const { tasks: updatedTasks } = req.body;
	tasks = updatedTasks;
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
	res.status(201).json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
	const { id } = req.params;
	tasks = tasks.filter((task) => task.id != id);
	res.status(200).json({ message: 'Task deleted' });
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
