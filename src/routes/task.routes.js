import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createTask,
    deleteTask,
    getAllUserTasks,
    getTaskById,
    updateTask,
} from "../controllers/task.controller.js";

const router = Router();

router.use(verifyJWT);

router
    .route("/")
    .get(getAllUserTasks)
    .post(createTask);

router
    .route("/:taskId")
    .get(getTaskById)
    .delete(deleteTask)
    .patch(updateTask);

export default router;