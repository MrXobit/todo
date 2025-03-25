const ApiError = require('../error/ApiError');
const User = require('../models/User');
const Task = require('../models/Task');  
const getUserFromToken = require('../utils/getUserFromToken');
const jwt = require('jsonwebtoken')

const generateJwt = (id, email, role, tasks) => {
    return jwt.sign(
        {id, email, role, tasks},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class TaskController {
    async createTask(req, res, next) {
        try {
            const userData = getUserFromToken(req);
            if (userData.error) {
                return next(ApiError.forbidden('Пользователь не авторизован'));
            }
    
            const { title, description, status } = req.body;
            if (!title) {
                return next(ApiError.badRequest('Заголовок задачи обязателен'));
            }
    
            const task = new Task({
                title,
                description: description || '', 
                status: status || 'pending',     
                createdAt: Date.now(),
                updatedAt: Date.now(),
                createdBy: userData.id
            });
            await task.save();
            const updatedUser = await User.findByIdAndUpdate(
                userData.id, 
                { $push: { tasks: task._id } },  
                { new: true }
            );
            const newToken = generateJwt(updatedUser._id, updatedUser.email, updatedUser.role, updatedUser.tasks);
            
            return res.status(201).json({ task, token: newToken });
        } catch (e) {
            console.log(e);
            return next(ApiError.internal('Что-то пошло не так'));
        }
    }
    

    
    async getTasks(req, res, next) {
        try {
            const userData = getUserFromToken(req);
            if (userData.error) {
                return next(ApiError.forbidden('Пользователь не авторизован'));
            }

            if (userData.role === 'user') {
                const tasks = await Task.find({ _id: { $in: userData.tasks } });
                if (!tasks) {
                    return res.json([]);
                }
                return res.json({ tasks });
            } else {
                const tasks = await Task.find(); 
                return res.json({ tasks });
            }
        } catch(e) {
            return next(ApiError.internal('Что-то пошло не так'))
        }
    }

   
    async getTaskById(req, res, next) {
        try {
            const userData = getUserFromToken(req);
            console.log("userData: ", userData);
            
            if (userData.error) {
              console.log(userData.error)
              return next(ApiError.forbidden('Пользователь не авторизован'));
            }
            
            const taskId = req.params.id;
            console.log('taskId: ', taskId);
            
            if (userData.role === 'admin') {
              const task = await Task.findOne({ _id: taskId });
              
              if (!task) {
                return next(ApiError.notFound('Завдання не знайдено'));
              }
              
              return res.json({ task });
            } else {
              if (userData.tasks.map(task => task.toString()).includes(taskId.toString())) {
                const task = await Task.findOne({ _id: taskId });
                
                if (!task) {
                  return next(ApiError.notFound('Завдання не знайдено'));
                }
                
                return res.json({ task });
              } else {
                return next(ApiError.forbidden('У вас немає доступу до цього завдання'));
              }
            }
            
            
        } catch (e) {
            console.log(e)
            return next(ApiError.internal('Что-то пошло не так'));
        }
    }
    

   
    async updateTask(req, res, next) {
        try {
            const userData = getUserFromToken(req);
            if (userData.error) {
                return next(ApiError.forbidden('Пользователь не авторизован'));
            }
    
            const { title, description, status } = req.body;
            let updateFields = {};
    
            if (title) updateFields.title = title;
            if (description) updateFields.description = description;
            if (status) updateFields.status = status;
            
            updateFields.updatedAt = Date.now();
    
            if (!title && !description && !status) {
                return next(ApiError.badRequest('Принаймні одне поле (title, description, status) повинно бути заповнене'));
            }
            const taskId = req.params.id;
    
            if (userData.role === 'admin') {
                const task = await Task.findOneAndUpdate(
                    { _id: taskId },
                    updateFields,
                    { new: true }
                );
    
                if (!task) {
                    return next(ApiError.notFound('Завдання не знайдено'));
                }
                return res.json({ task });
            } else {
                if (userData.tasks.includes(taskId)) {
                    const task = await Task.findOneAndUpdate(
                        { _id: taskId },
                        updateFields,
                        { new: true }
                    );
    
                    if (!task) {
                        return next(ApiError.notFound('Завдання не знайдено'));
                    }
                    return res.json({ task });
                }
            }
            return next(ApiError.forbidden('У вас немає доступу до цього завдання'));
    
        } catch (e) {
            return next(ApiError.internal('Щось пішло не так'));
        }
    }
    
   
    async deleteTask(req, res, next) {
        try {
            const userData = getUserFromToken(req);
            if (userData.error) {
                return next(ApiError.forbidden('Пользователь не авторизован'));
            }
            const taskId = req.params.id;
        
            if (userData.role === 'admin') {
                const task = await Task.findOneAndDelete({ _id: taskId });

                if (!task) {
                    return next(ApiError.notFound('Завдання не знайдено'));
                }
                const user = await User.findOneAndUpdate(
                    { _id: task.createdBy },  
                    { $pull: { tasks: taskId } }, 
                    { new: true }
                );
                if (!user) {
                    return next(ApiError.notFound('Користувач не знайдений'));
                }

                const newToken = generateJwt(user._id, user.email, user.role, user.tasks);

                return res.json({ message: 'Завдання успішно видалено', token: newToken });
            } else {
                if (userData.tasks.includes(taskId)) {
                    const task = await Task.findOneAndDelete({ _id: taskId });

                    if (!task) {
                        return next(ApiError.notFound('Завдання не знайдено'));
                    }
                    const user = await User.findOneAndUpdate(
                        { _id: task.createdBy },  
                        { $pull: { tasks: taskId } }, 
                        { new: true }
                    );
                    if (!user) {
                        return next(ApiError.notFound('Користувач не знайдений'));
                    }

                    const newToken = generateJwt(user._id, user.email, user.role, user.tasks);

                    return res.json({ message: 'Завдання успішно видалено', token: newToken });
                }
            }
    
            return next(ApiError.forbidden('У вас немає доступу до цього завдання'));
            
        } catch (e) {
            return next(ApiError.internal('Что-то пошло не так'));
        }
    }
}

module.exports = new TaskController();
