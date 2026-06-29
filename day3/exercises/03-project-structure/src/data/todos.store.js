/**
 * Data layer - In-memory store cho todos
 * Đây là nơi DUY NHẤT đọc/ghi dữ liệu
 * Service gọi store, không ai khác được trực tiếp thao tác mảng todos
 */

let todos = [];
let nextId = 1;

const normalizeId = (id) => Number(id);

const getAll = (filter = {}) => {
  let result = [...todos];

  // TODO: implement filter logic
  // - filter.status: "all" | "active" | "completed"
  // - filter.priority: "low" | "medium" | "high"
  // - filter.search: tìm trong title (case-insensitive)

  if (filter.status === 'active') {
    result = result.filter((todo) => !todo.completed);
  } else if (filter.status === 'completed') {
    result = result.filter((todo) => todo.completed);
  }

  if (filter.priority) {
    result = result.filter((todo) => todo.priority === filter.priority);
  }

  if (filter.search) {
    const keyword = String(filter.search).toLowerCase().trim();
    result = result.filter((todo) => todo.title.toLowerCase().includes(keyword));
  }

  return result;
};

const getById = (id) => {
  // TODO: implement - trả về todo hoặc null
  const todoId = normalizeId(id);
  if (!Number.isInteger(todoId) || todoId <= 0) return null;
  return todos.find((todo) => todo.id === todoId) ?? null;
};

const create = (data) => {
  const now = new Date();
  const todo = {
    id: nextId++,
    title: data.title,
    priority: data.priority || 'medium',
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  todos.push(todo);
  return todo;
};

const create = (data) => {
  // TODO: implement
  // data gồm: { title, priority }
  // tự thêm: id, completed: false, createdAt: new Date()
  // push vào todos, return todo mới
  return null;
};

const update = (id, data) => {
  // TODO: implement
  // - Tìm index theo id
  // - Nếu không tìm thấy -> return null
  // - Merge data vào todo hiện tại (chỉ update field có trong data)
  // - Thêm updatedAt: new Date()
  // - Return todo đã update
  const todoId = normalizeId(id);
  const index = todos.findIndex((todo) => todo.id === todoId);
  if (index === -1) return null;

  const { id: _id, createdAt: _createdAt, ...allowedFields } = data || {};

  todos[index] = {
    ...todos[index],
    ...allowedFields,
    updatedAt: new Date(),
  };

  return todos[index];
};

const remove = (id) => {
  // TODO: implement
  // - Tìm index theo id
  // - Nếu không tìm thấy -> return false
  // - splice khỏi mảng
  // - Return true
  const todoId = normalizeId(id);
  const index = todos.findIndex((todo) => todo.id === todoId);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
};

module.exports = { getAll, getById, create, update, remove };
