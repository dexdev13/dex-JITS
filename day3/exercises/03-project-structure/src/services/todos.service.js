/**
 * Business logic layer cho todos
 *
 * Quy tắc:
 * - Service chứa TOÀN BỘ business logic
 * - Service throw Error khi gặp lỗi (kèm .statusCode)
 * - Service KHÔNG biết về req/res
 * - Controller gọi service, bắt lỗi, trả response
 */

const store = require('../data/todos.store');

function createHttpError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function assertPositiveInteger(id) {
  const todoId = Number(id);
  if (!Number.isInteger(todoId) || todoId <= 0) {
    throw createHttpError('Invalid todo ID', 400);
  }
  return todoId;
}

/**
 * TODO: Implement getAllTodos(filter)
 *
 * - Gọi store.getAll(filter)
 * - Return array todos
 * - Không có business logic đặc biệt ở đây
 */
async function getAllTodos(filter) {
  // TODO: implement
  return store.getAll(filter);
}

/**
 * TODO: Implement getTodoById(id)
 *
 * - id phải là số nguyên dương -> nếu không: throw lỗi 400
 * - Gọi store.getById(id)
 * - Nếu không tìm thấy -> throw lỗi 404
 * - Return todo
 *
 * Cách throw lỗi với statusCode:
 * const err = new Error("Todo not found");
 * err.statusCode = 404;
 * throw err;
 */
async function getTodoById(id) {
  // TODO: implement
  const todoId = assertPositiveInteger(id);
  const todo = store.getById(todoId);

  if (!todo) {
    throw createHttpError('Todo not found', 404);
  }

  return todo;
}

/**
 * TODO: Implement createTodo({ title, priority })
 *
 * - Gọi store.create({ title: title.trim(), priority })
 * - Return todo mới tạo
 */
async function createTodo({ title, priority }) {
  // TODO: implement
  const normalizedTitle = String(title ?? '').trim();
  if (!normalizedTitle) {
    throw createHttpError('Title is required', 400);
  }

  return store.create({
    title: normalizedTitle,
    priority: priority || 'medium',
  });
}

/**
 * TODO: Implement updateTodo(id, data)
 *
 * - Validate id (số nguyên dương)
 * - Gọi store.getById(id) -> 404 nếu không tìm thấy
 * - Gọi store.update(id, data)
 * - Return todo đã update
 */
async function updateTodo(id, data) {
  // TODO: implement
  const todoId = assertPositiveInteger(id);
  const existingTodo = store.getById(todoId);

  if (!existingTodo) {
    throw createHttpError('Todo not found', 404);
  }

  const updatedTodo = store.update(todoId, data);
  if (!updatedTodo) {
    throw createHttpError('Todo not found', 404);
  }

  return updatedTodo;
}

/**
 * TODO: Implement toggleComplete(id)
 *
 * - Validate id
 * - Tìm todo, 404 nếu không có
 * - Toggle todo.completed (true -> false, false -> true)
 * - Gọi store.update(id, { completed: !todo.completed })
 * - Return { todo, message } với message mô tả trạng thái mới
 */
async function toggleComplete(id) {
  // TODO: implement
  const todoId = assertPositiveInteger(id);
  const todo = store.getById(todoId);

  if (!todo) {
    throw createHttpError('Todo not found', 404);
  }

  const nextCompleted = !todo.completed;
  const updatedTodo = store.update(todoId, { completed: nextCompleted });

  return {
    todo: updatedTodo,
    message: nextCompleted ? 'Todo marked as completed' : 'Todo marked as active',
  };
}

/**
 * TODO: Implement deleteTodo(id)
 *
 * - Validate id
 * - Gọi store.getById(id) -> 404 nếu không tìm thấy
 * - Gọi store.remove(id)
 * - Return true (hoặc { deleted: true })
 */
async function deleteTodo(id) {
  // TODO: implement
  const todoId = assertPositiveInteger(id);
  const todo = store.getById(todoId);

  if (!todo) {
    throw createHttpError('Todo not found', 404);
  }

  const removed = store.remove(todoId);
  if (!removed) {
    throw createHttpError('Todo not found', 404);
  }

  return true;
}

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleComplete,
  deleteTodo,
};
