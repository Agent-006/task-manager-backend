import mongoose, { Schema } from "mongoose";
import { Task } from "../models/task.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTask = asyncHandler(async (req, res) => {
    const { title, description, content } = req.body;

    if ([title, description, content].some((field) => field.trim()) === "") {
        throw new ApiError(402, "title, description and content are required");
    }

    const task = await Task.create({
        title,
        description,
        content,
        owner: new mongoose.Types.ObjectId(req.user?._id),
    });

    if (!task) {
        throw new ApiError(
            500,
            "Something went wrong while saving the task to database"
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task created successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!taskId?.trim()) {
        throw new ApiError(400, "VideoId is missing");
    }

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task doesn't exists");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Successfully fetch task"));
});

const getAllUserTasks = asyncHandler(async (req, res) => {
    const allTasks = await Task.find({
        owner: req.user?._id,
    });

    if (!allTasks) {
        throw new ApiError(
            500,
            "Something went wrong while fetching the tasks"
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, allTasks, "Successfully fetched all tasks"));
});

const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!taskId?.trim()) {
        throw new ApiError(400, "TaskId is missing");
    }

    await Task.findByIdAndDelete(taskId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, content } = req.body;

    if (!taskId?.trim()) {
        throw new ApiError(400, "TaskId is missing");
    }

    if ([title, description, content].some((field) => field.trim()) === "") {
        throw new ApiError(402, "title, description and content are required");
    }

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
            $set: {
                title,
                description,
                content,
            },
        },
        {
            new: true,
        }
    );

    if (!updatedTask) {
        throw new ApiError(500, "Something went wrong while updating the task");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateTask, "Updated task successfully"));
});

export { createTask, getTaskById, getAllUserTasks, deleteTask, updateTask };
