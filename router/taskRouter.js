const express = require("express");
const { TaskModel } = require("../model/taskModel");
const { Validator } = require("../middleware/validator");
const jwt = require("jsonwebtoken");
const taskRouter = express.Router();
require("dotenv").config();

taskRouter.use(Validator);

// Create a new task
taskRouter.post("/add", async (req, res) => {
    try {
        await TaskModel.create(req.body);
        res.send({
            message: "Task added",
            status: 1,
            error: false,
        });
    } catch (error) {
        res.send({
            message: "Something went wrong: " + error.message,
            status: 0,
            error: true,
        });
    }
});

// Retrieve all tasks
taskRouter.get("/", async (req, res) => {
    try {
        const tasks = await TaskModel.find();
        res.send({
            message: "Retrieve all tasks",
            status: 1,
            error: false,
            tasks,
        });
    } catch (error) {
        res.send({
            message: "Something went wrong",
            status: 0,
            error: true,
        });
    }
});

// Retrieve user-specific tasks
taskRouter.get("/user", async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.key);
        const { userId: user } = decoded;
        const data = await TaskModel.find({ user });
        res.send({
            message: "User data retrieved",
            status: 1,
            error: false,
            data,
        });
    } catch (error) {
        res.send({
            message: "Something went wrong: " + error.message,
            status: 0,
            error: true,
        });
    }
});

// Update a task by ID
taskRouter.patch("/:id", async (req, res) => {
    const taskId = req.params.id;
    const updateData = req.body;

    try {
        const data = await TaskModel.findByIdAndUpdate(taskId, updateData,{new : true});
        res.send({
            message: "Task updated",
            status: 1,
            error: false,
            data,
        });
    } catch (error) {
        res.send({
            message: "Something went wrong: " + error.message,
            status: 0,
            error: true,
        });
    }
});

// Delete a task by ID
taskRouter.delete("/:id", async (req, res) => {
    const taskId = req.params.id;
    try {
        await TaskModel.findByIdAndDelete(taskId);
        res.send({
            message: "Task deleted successfully",
            status: 1,
            error: false,
        });
    } catch (error) {
        res.send({
            message: "Something went wrong: " + error.message,
            status: 0,
            error: true,
        });
    }
});

// Retrieve a specific task by ID
taskRouter.get("/:id", async (req, res) => {
    const taskId = req.params.id;
    try {
        const data = await TaskModel.findById(taskId);
        res.send({
            message: "Task details",
            status: 1,
            error: false,
            data,
        });
    } catch (error) {
        res.send({
            message: "Something went wrong: " + error.message,
            status: 0,
            error: true,
        });
    }
});

app.post('/assign-task/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        const { assignedMembers, assignedBy } = req.body; // Include the ID of the user who assigned the task

        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId },
            {
                $addToSet: { checklists: assignedMembers },
                assignedBy: assignedBy, // Store the ID of the user who assigned the task
            },
            { new: true }
        );

        res.json({ message: 'Task assigned successfully', task: updatedTask });
    } catch (error) {
        console.error('Error assigning task:', error);
        res.status(500).json({ message: 'Error assigning task', error: error.message });
    }
});

app.get('/tasks-assigned-to/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find tasks assigned to the specified user and populate the assignedBy field
        const assignedTasks = await Task.find({ checklist: userId })
            .populate('assignedBy', 'name') // Assuming the User model has a 'name' field
            .exec();

        res.json({ tasks: assignedTasks });
    } catch (error) {
        console.error('Error retrieving assigned tasks:', error);
        res.status(500).json({ message: 'Error retrieving assigned tasks', error: error.message });
    }
});


module.exports = {
    taskRouter
};