/**
 * Bài 4: useState vs let — Tại sao let không work trong React?
 * Day 6 - React Hooks cơ bản
 *
 * Mục tiêu:
 *   - Hiểu tại sao biến let KHÔNG trigger re-render
 *   - Hiểu cơ chế useState: React lưu state bên ngoài function
 *   - Phân biệt khi nào dùng useState vs let vs useRef
 *   - Hiểu immutable state (không mutate trực tiếp object/array)
 *
 * Chạy: npm run dev
 * Copy file này vào src/App.jsx để test
 */

import { useState, useRef } from 'react';

// ============================================================
// TODO 4.1: CounterWithLet — chứng minh let KHÔNG work
// ============================================================
//
// Tạo component CounterWithLet:
//   - Khai báo: let count = 0;
//   - Button "Tăng": count += 1
//   - console.log("let count:", count) trong handleClick
//   - Hiển thị count trên UI
//
// Quan sát:
//   - Console log cho thấy count TĂNG (1, 2, 3...)
//   - Nhưng UI vẫn hiển thị 0 — TẠI SAO?
//
// Trả lời bằng comment trong component trước khi code:
// GIẢI THÍCH: ___________________________________________________________

// TODO 4.1 — Implement CounterWithLet bên dưới:

function CounterWithLet() {
  // GIẢI THÍCH: let count là biến local trong function. Khi React re-render,
  // nó gọi lại function CounterWithLet() → count được reset về 0 mỗi lần.
  // Thay đổi count không trigger re-render, nên UI không bao giờ cập nhật.
  let count = 0;

  function handleClick() {
    count += 1;
    console.log('let count:', count);
  }

  console.log('CounterWithLet rendered'); // để thấy component có re-render không

  return (
    <div style={{ border: '2px solid red', padding: 16, borderRadius: 8 }}>
      <h3>Counter với let (SAI)</h3>
      {/* TODO: hiển thị count và button */}
      <p>Count: {count}</p>
      <button onClick={handleClick}>Tăng</button>
      <p style={{ color: 'red', fontSize: 12 }}>
        Mở Console để thấy giá trị thực — UI không cập nhật!
      </p>
    </div>
  );
}

// ============================================================
// TODO 4.2: CounterWithState — cách ĐÚNG
// ============================================================
//
// Tạo component CounterWithState:
//   - Dùng: const [count, setCount] = useState(0);
//   - Button "Tăng": setCount(count + 1)
//   - Button "Giảm": setCount(count - 1), nhưng không cho xuống dưới 0
//   - Button "Reset": setCount(0)
//   - console.log("state count:", count) trong handleClick
//
// Quan sát:
//   - Console log cho thấy count tăng
//   - UI CŨNG cập nhật — vì setState trigger re-render

// TODO 4.2 — Implement CounterWithState bên dưới:

function CounterWithState() {
  const [count, setCount] = useState(0);

  function handleIncrease() {
    console.log('state count:', count);
    setCount(count + 1);
  }

  console.log('CounterWithState rendered'); // để thấy re-render xảy ra

  return (
    <div style={{ border: '2px solid green', padding: 16, borderRadius: 8 }}>
      <h3>Counter với useState (ĐÚNG)</h3>
      {/* TODO: hiển thị count và 3 buttons */}
      <p>Count: {count}</p>
      <button onClick={handleIncrease}>Tăng</button>
      <button onClick={() => setCount((c) => Math.max(0, c - 1))}>Giảm</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// ============================================================
// TODO 4.3: Functional update — setCount(prev => prev + 1)
// ============================================================
//
// Tạo component DoubleCounter:
//   - Button "Tăng 2 (SAI)": gọi setCount(count + 1) HAI LẦN liên tiếp
//   - Button "Tăng 2 (ĐÚNG)": gọi setCount(prev => prev + 1) HAI LẦN
//   - Hiển thị count
//
// Quan sát:
//   - "Tăng 2 (SAI)" chỉ tăng 1 — vì count là stale value trong cùng render
//   - "Tăng 2 (ĐÚNG)" tăng 2 — vì prev luôn là giá trị mới nhất
//
// Giải thích:
//   React batch updates trong cùng event handler.
//   setCount(count + 1) dùng count TẠI THỜI ĐIỂM RENDER → cả 2 lần đều count + 1
//   setCount(prev => prev + 1) dùng giá trị mới nhất → lần 2 dùng kết quả lần 1

// TODO 4.3 — Implement DoubleCounter bên dưới:

function DoubleCounter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ border: '2px solid blue', padding: 16, borderRadius: 8 }}>
      <h3>Double Counter — Functional Update</h3>
      <p>Count: {count}</p>
      <button
        onClick={() => {
          setCount(count + 1);
          setCount(count + 1);
        }}
      >
        Tăng 2 (SAI — sẽ chỉ tăng 1)
      </button>
      <button
        onClick={() => {
          setCount((prev) => prev + 1);
          setCount((prev) => prev + 1);
        }}
      >
        Tăng 2 (ĐÚNG — tăng thật sự 2)
      </button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// ============================================================
// TODO 4.4: Immutable state — object & array
// ============================================================
//
// Tạo component UserProfile:
//   - State: const [user, setUser] = useState({ name: "Alice", age: 25, city: "HCM" })
//   - Button "Tăng tuổi (SAI)": user.age += 1; setUser(user);
//     → UI không cập nhật vì cùng reference
//   - Button "Tăng tuổi (ĐÚNG)": setUser({ ...user, age: user.age + 1 });
//     → UI cập nhật vì object mới
//   - Input đổi tên: setUser({ ...user, name: e.target.value })
//
// Tạo component TodoMini:
//   - State: const [todos, setTodos] = useState(["Học React", "Làm bài tập"])
//   - Input + Button "Thêm": setTodos([...todos, newTodo])  (ĐÚNG)
//   - Button "Xóa" mỗi item: setTodos(todos.filter((_, i) => i !== index))
//   - KHÔNG dùng push/splice — phải tạo array mới

// TODO 4.4 — Implement UserProfile bên dưới:

function UserProfile() {
  const [user, setUser] = useState({ name: 'Alice', age: 25, city: 'HCM' });

  return (
    <div style={{ border: '2px solid purple', padding: 16, borderRadius: 8 }}>
      <h3>User Profile — Immutable Object State</h3>
      {/* TODO: hiển thị user info, buttons, input */}
      <p>
        Tên: {user.name} | Tuổi: {user.age} | Thành phố: {user.city}
      </p>
      <button
        onClick={() => {
          user.age += 1;
          setUser(user);
        }}
      >
        Tăng tuổi (SAI)
      </button>{' '}
      <button onClick={() => setUser({ ...user, age: user.age + 1 })}>Tăng tuổi (ĐÚNG)</button>
      <br />
      <input
        placeholder="Đổi tên"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        style={{ marginTop: 8 }}
      />
    </div>
  );
}

// TODO 4.4 — Implement TodoMini bên dưới:

function TodoMini() {
  const [todos, setTodos] = useState(['Học React', 'Làm bài tập']);
  const [newTodo, setNewTodo] = useState('');

  function handleAdd() {
    if (!newTodo.trim()) return;
    setTodos([...todos, newTodo.trim()]);
    setNewTodo('');
  }

  return (
    <div style={{ border: '2px solid orange', padding: 16, borderRadius: 8 }}>
      <h3>Todo Mini — Immutable Array State</h3>
      {/* TODO: input, button thêm, list với button xóa */}
      <div>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Thêm todo..."
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd} style={{ marginLeft: 8 }}>
          Thêm
        </button>
      </div>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            {todo}
            <button
              onClick={() => setTodos(todos.filter((_, idx) => idx !== i))}
              style={{ marginLeft: 8, color: 'red' }}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================
// App — Render tất cả components để test
// ============================================================

function App() {
  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto' }}>
      <h1>Day 6 — Exercise 04: useState vs let</h1>
      <p style={{ color: '#666' }}>Mở DevTools Console (F12) để theo dõi log</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <CounterWithLet />
        <CounterWithState />
        <DoubleCounter />
        <UserProfile />
        <TodoMini />
      </div>
    </div>
  );
}

export default App;

// ─────────────────────────────────────────────────────────────
// CÂU HỎI TƯ DUY (trả lời bằng comment trước khi nộp bài)
// ─────────────────────────────────────────────────────────────
//
// Q1: React re-render component bằng cách nào?
//     (Gợi ý: gọi lại function component → let bị reset)
//
//     YOUR ANSWER: Khi state/props thay đổi, React gọi lại toàn bộ function
//     component từ đầu. Mọi biến let khai báo trong function sẽ được khởi tạo
//     lại về giá trị ban đầu mỗi lần render → không lưu được giá trị giữa renders.
//
// Q2: Tại sao setUser(user) không gây re-render khi user.age đã thay đổi?
//     (Gợi ý: React dùng Object.is() để so sánh state cũ và mới)
//
//     YOUR ANSWER: React dùng Object.is() để so sánh state mới và cũ. user.age += 1
//     mutate trực tiếp object gốc → reference không đổi → Object.is(old, new) = true
//     → React bỏ qua, không re-render. Phải dùng {...user, age: user.age + 1} tạo
//     object mới → reference khác → React nhận ra state thay đổi → re-render.
//
// Q3: Viết 3 dòng tóm tắt khi nào dùng:
//     - let: Biến tạm dùng trong render, không cần persist giữa renders (vd: computed value).
//     - useState: Dữ liệu cần persist và khi thay đổi phải trigger UI re-render.
//     - useRef: Dữ liệu cần persist nhưng KHÔNG muốn trigger re-render (vd: DOM ref, timer id, render count).
//
// ─────────────────────────────────────────────────────────────
