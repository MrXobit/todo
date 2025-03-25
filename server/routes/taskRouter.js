
const Router = require('express');
const taskController = require('../controller/taskController');
const router = new Router();

router.post('/', taskController.createTask);

router.get('/', taskController.getTasks);

router.get('/:id', taskController.getTaskById);

router.put('/:id', taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

module.exports = router;
