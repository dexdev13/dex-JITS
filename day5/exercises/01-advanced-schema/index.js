/**
 * Day 5 - Exercise 01: Advanced Mongoose Schema
 *
 * Mục tiêu:
 *   - Viết pre("save") hook để auto-hash password
 *   - Implement instance method: comparePassword()
 *   - Implement static method: findByEmail()
 *   - Implement virtual: fullName
 *   - Hiểu khi nào dùng Mongoose validation vs Joi validation
 *
 * Yêu cầu: MongoDB đang chạy tại MONGODB_URI trong .env
 *
 * Chạy: node exercises/01-advanced-schema/index.js
 */

'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ─── Schema Definition ────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email is not valid'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // Cần option này để virtuals xuất hiện khi res.json() / JSON.stringify()
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ─── TODO 1.1: pre("save") hook — auto hash password ─────────────────────────
//
// Yêu cầu:
//   - Chỉ hash khi password bị thay đổi (dùng this.isModified("password"))
//   - Dùng bcrypt.hash() với saltRounds = 10
//   - Gán hash vào this.password trước khi gọi next()
//   - Dùng function() không phải arrow function (cần "this")
//
// Gợi ý cấu trúc:
//   userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
//     // ... hash ở đây
//     next();
//   });
//
// Câu hỏi: Tại sao pre("save") KHÔNG chạy khi dùng findByIdAndUpdate()?
// Trả lời bằng comment bên dưới trước khi code:
// YOUR ANSWER:

// TODO 1.1 — Implement pre("save") hook bên dưới dòng này:

// ─── TODO 1.2: Instance method — comparePassword() ───────────────────────────
//
// Yêu cầu:
//   - Method tên: comparePassword(plaintext)
//   - Nhận plaintext password, so sánh với this.password (đã hash)
//   - Return: Promise<boolean> (true nếu khớp, false nếu không)
//   - Dùng bcrypt.compare()
//   - PHẢI dùng function() không phải arrow function
//
// Gợi ý:
//   userSchema.methods.comparePassword = async function (plaintext) {
//     return bcrypt.compare(plaintext, this.password);
//   };
//
// Câu hỏi: Tại sao không so sánh bcrypt.hash(plaintext) === this.password?
// YOUR ANSWER:

// TODO 1.2 — Implement instance method bên dưới:

// ─── TODO 1.3: Static method — findByEmail() ─────────────────────────────────
//
// Yêu cầu:
//   - Method tên: findByEmail(email)
//   - Tìm user theo email (case-insensitive — convert về lowercase)
//   - Return: Promise<Document | null>
//   - Dùng this.findOne() (this = Model trong static)
//
// Gợi ý:
//   userSchema.statics.findByEmail = function (email) {
//     return this.findOne({ email: email.toLowerCase() });
//   };
//
// Câu hỏi: Tại sao đây là static method thay vì instance method?
// YOUR ANSWER:

// TODO 1.3 — Implement static method bên dưới:

// ─── TODO 1.4: Virtual — fullName ─────────────────────────────────────────────
//
// Yêu cầu:
//   - Virtual tên: fullName
//   - Getter: trả về `${firstName} ${lastName}`
//   - Virtual KHÔNG được lưu vào DB
//   - Dùng function() không phải arrow function
//
// Gợi ý:
//   userSchema.virtual("fullName").get(function () {
//     return `${this.firstName} ${this.lastName}`;
//   });
//
// Để verify: sau khi tạo user, log ra user.fullName và user.toJSON()
//   kiểm tra fullName có xuất hiện không
//
// Câu hỏi: Sự khác nhau giữa toJSON: { virtuals: true } và toObject: { virtuals: true }?
// YOUR ANSWER:

// TODO 1.4 — Implement virtual bên dưới:

// ─── Model ────────────────────────────────────────────────────────────────────

const User = mongoose.model('User', userSchema);

// ─── TODO 1.5: Test cases ─────────────────────────────────────────────────────
//
// Viết code test các tính năng trên. Mỗi test cần log kết quả rõ ràng.
//
// Test 1: Tạo user mới
//   - Tạo user với password "password123"
//   - Log ra user.password — phải là bcrypt hash, KHÔNG phải "password123"
//   - Log ra user.fullName — phải là "firstName lastName"
//   - Log ra user.toJSON() — phải có fullName, KHÔNG có __v
//
// Test 2: comparePassword
//   - Dùng user.comparePassword("password123") -> phải trả true
//   - Dùng user.comparePassword("wrongpassword") -> phải trả false
//
// Test 3: Static method findByEmail
//   - Dùng User.findByEmail(email) -> phải tìm được user vừa tạo
//   - Dùng User.findByEmail("UPPERCASE@EMAIL.COM") -> vẫn tìm được (case insensitive)
//
// Test 4: Update password (hook phải chạy lại)
//   - Fetch user từ DB bằng User.findById()
//   - Gán user.password = "newpassword456"
//   - Gọi user.save()
//   - comparePassword("newpassword456") -> true
//   - comparePassword("password123") -> false (password cũ không còn dùng được)
//
// Test 5: Duplicate email
//   - Thử tạo user với email đã tồn tại
//   - Catch error và log err.code (phải là 11000)
//
// Gợi ý cấu trúc:
//   async function runTests() {
//     await mongoose.connect(process.env.MONGODB_URI);
//     await User.deleteMany({}); // clean slate
//
//     console.log("\n=== Test 1: Create User ===");
//     // ... test code
//
//     await mongoose.disconnect();
//   }
//   runTests().catch(console.error);

// TODO 1.5 — Implement test function bên dưới:

// ─────────────────────────────────────────────────────────────────────────────
// CÂUHỎI TƯ DUY (trả lời bằng comment trước khi nộp bài)
// ─────────────────────────────────────────────────────────────────────────────
//
// Q1: Khi nào dùng Mongoose validation (schema level) vs Joi validation?
//     Gợi ý: Nghĩ về: layer nào chịu trách nhiệm, duplicate logic, performance
//
//     Mongoose validation: ___________________________________________________
//     Joi validation: ________________________________________________________
//     Kết luận dùng cái nào khi nào: _________________________________________
//
// Q2: Nếu một service gọi User.create() và Mongoose validation fail,
//     error đó có tự động reach error middleware không?
//     Phải làm gì trong controller/service để xử lý đúng?
//
//     YOUR ANSWER: ___________________________________________________________
//
// Q3: pre("save") chạy khi nào? Liệt kê các trường hợp:
//     - Chạy: ________________________________________________________________
//     - KHÔNG chạy: __________________________________________________________
//
// ─────────────────────────────────────────────────────────────────────────────
