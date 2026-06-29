/**
 * Bài tập 1 - HTTP Basics
 * Day 2 - Express.js & REST API
 *
 * Mục tiêu:
 * - Hiểu HTTP request/response qua code thực tế
 * - Dùng Node.js built-in http module (không dùng Express)
 * - Quan sát headers, status codes, và body
 *
 * Chạy: node 01-http-basics.js
 * Test: curl http://localhost:3001/...
 */

const http = require('http');
const url = require('url');

const PORT = 3001;

// ============================================================
// 1.1: Kiến thức lý thuyết - Trả lời trong comment
// ============================================================

/**
 * TODO: Trả lời các câu hỏi sau trong comment này:
 *
 * Q1: HTTP method nào KHÔNG có request body?
 * A1: GET, DELETE, HEAD
 *
 * Q2: Status code 201 khác 200 ở điểm nào? Khi nào dùng 201?
 * A2: 200 = OK, 201 = Created. 201 thường dùng sau POST, PUT, PATCH.
 *
 * Q3: Status code 204 có response body không? Dùng khi nào?
 * A3: 204 không có response body. 204 thường dùng sau DELETE hoặc update thành công nhưng không cần trả data.
 *
 * Q4: Phân biệt 401 và 403?
 * A4: 401 = Unauthorized, 403 = Forbidden (logged in, but access denied)
 *
 * Q5: PUT và PATCH khác nhau thế nào?
 * A5: PUT cập nhật toàn bộ resource, PATCH cập nhật một phần.
 *
 * Q6: Idempotent nghĩa là gì? GET, POST, PUT, DELETE method nào là idempotent?
 * A6: Idempotent là gọi nhiều lần cho cùng một request thì kết quả cuối cùng không đổi.
 * GET, PUT, DELETE là idempotent, POST không.
 *
 * Q7: Header "Content-Type: application/json" nói với server điều gì?
 * A7: Client đang gửi data JSON.
 *
 * Q8: Query string trong URL /api/users?page=2&limit=10 là gì?
 * A8: page=2&limit=10 là query string
 */

// ============================================================
// 1.2: Tạo HTTP server với built-in http module
// ============================================================

/**
 * TODO: Implement server xử lý các request sau:
 *
 * GET /                    -> 200, { message: "HTTP Basics Demo" }
 * GET /health              -> 200, { status: "ok", uptime: <seconds> }
 * GET /echo                -> 200, trả lại headers của request (dạng JSON)
 * GET /status/:code        -> trả về status code tương ứng với message
 * POST /body               -> 200, echo lại request body
 * DELETE /nothing          -> 204, không có body
 * GET /error               -> 500, { error: "Something went wrong" }
 * * (các path khác)        -> 404, { error: "Not found" }
 */

const startTime = Date.now();

const server = http.createServer((req, res) => {
  // Parse URL để lấy pathname và query
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Helper: gửi JSON response
  const sendJSON = (statusCode, data) => {
    const body = JSON.stringify(data, null, 2);
    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      'X-Powered-By': 'Node.js http module',
    });
    res.end(body);
  };

  // Helper: đọc request body
  const readBody = () => {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          reject(new Error('Invalid JSON body'));
        }
      });
      req.on('error', reject);
    });
  };

  // Router thủ công
  const handleRequest = async () => {
    // TODO 1.2.1: GET / -> trả về { message: "HTTP Basics Demo", method: req.method }
    if (req.method === 'GET' && pathname === '/') {
      // Implement ở đây
      // sendJSON(200, { message: 'TODO: implement GET /' });
      sendJSON(200, {
        message: 'HTTP Basics Demo',
        method: req.method,
      });
      return;
    }

    // TODO 1.2.2: GET /health -> trả về { status: "ok", uptime: <giây kể từ khi server start> }
    if (req.method === 'GET' && pathname === '/health') {
      // Implement ở đây
      // sendJSON(200, { message: 'TODO: implement GET /health' });
      const uptime = Math.floor((Date.now() - startTime) / 1000);

      sendJSON(200, {
        status: 'ok',
        uptime,
      });
      return;
    }

    // TODO 1.2.3: GET /echo -> trả lại toàn bộ headers của request
    // Hint: req.headers chứa tất cả headers
    if (req.method === 'GET' && pathname === '/echo') {
      // Implement ở đây
      // sendJSON(200, { message: 'TODO: implement GET /echo' });
      sendJSON(200, req.headers);
      return;
    }

    // TODO 1.2.4: GET /status/:code -> trả về status code tương ứng
    // Ví dụ: GET /status/404 -> response với status 404
    // Hint: pathname.startsWith("/status/")
    // Cần validate: code phải là số, nằm trong range 100-599
    if (req.method === 'GET' && pathname.startsWith('/status/')) {
      const code = parseInt(pathname.split('/')[2]);
      // Implement ở đây
      // sendJSON(200, { message: 'TODO: implement GET /status/:code', received: code });

      if (isNaN(code) || code < 100 || code > 599) {
        sendJSON(400, { error: 'Invalid status code' });
        return;
      }

      sendJSON(code, {
        status: code,
        message: `Response with status ${code}`,
      });
    }

    // TODO 1.2.5: POST /body -> đọc và echo lại request body
    // Dùng readBody() helper đã có sẵn
    // Nếu body không phải JSON hợp lệ -> trả về 400
    if (req.method === 'POST' && pathname === '/body') {
      try {
        // Implement ở đây
        // sendJSON(200, { message: 'TODO: implement POST /body' });
        const body = await readBody();

        sendJSON(200, body);
      } catch (err) {
        sendJSON(400, { error: err.message });
      }
      return;
    }

    // TODO 1.2.6: DELETE /nothing -> 204 không có body
    // Hint: res.writeHead(204); res.end();
    if (req.method === 'DELETE' && pathname === '/nothing') {
      // Implement ở đây
      // sendJSON(200, { message: 'TODO: implement DELETE /nothing - should return 204 no body' });

      res.writeHead(204);
      res.end();
      return;
    }

    // TODO 1.2.7: GET /error -> ném lỗi để test error handling
    if (req.method === 'GET' && pathname === '/error') {
      // Implement ở đây
      // sendJSON(200, { message: 'TODO: implement GET /error - should return 500' });
      sendJSON(500, { error: 'Something went wrong' });
      return;
    }

    // TODO 1.2.8: 404 handler cho tất cả route còn lại
    sendJSON(404, { error: `Cannot ${req.method} ${pathname}` });
  };

  handleRequest().catch((err) => {
    console.error('Unhandled error:', err);
    sendJSON(500, { error: 'Internal Server Error' });
  });
});

server.listen(PORT, () => {
  console.log(`HTTP Basics server running on http://localhost:${PORT}`);
  console.log('\nTest với các lệnh curl sau:');
  console.log(`  curl http://localhost:${PORT}/`);
  console.log(`  curl http://localhost:${PORT}/health`);
  console.log(`  curl http://localhost:${PORT}/echo -H "X-Custom: hello"`);
  console.log(`  curl http://localhost:${PORT}/status/201`);
  console.log(`  curl http://localhost:${PORT}/status/404`);
  console.log(
    `  curl -X POST http://localhost:${PORT}/body -H "Content-Type: application/json" -d '{"name":"Alice"}'`,
  );
  console.log(`  curl -X DELETE http://localhost:${PORT}/nothing -v`);
  console.log(`  curl http://localhost:${PORT}/error`);
  console.log(`  curl http://localhost:${PORT}/unknown`);
});

// ============================================================
// 1.3: Phân tích HTTP Request (câu hỏi tư duy)
// ============================================================

/**
 * TODO: Nhìn vào các HTTP request dưới đây, trả lời:
 * - Client muốn làm gì?
 * - Server nên response status code nào?
 * - Response body nên có gì?
 *
 * Request 1:
 * GET /api/products/999 HTTP/1.1
 * Host: localhost:3000
 *
 * -> Client muốn: Lấy product theo id 999
 * -> Status nếu tìm thấy: 200
 * -> Status nếu không tìm thấy: 404
 *
 * Request 2:
 * POST /api/products HTTP/1.1
 * Content-Type: application/json
 * { "price": -1000 }
 *
 * -> Client muốn: Tạo product mới
 * -> Vấn đề với request này là gì: Sai vì price < 0
 * -> Status phù hợp: 400 Bad Request
 *
 * Request 3:
 * DELETE /api/products/5 HTTP/1.1
 *
 * -> Status nếu xóa thành công: 204 No Content
 * -> Body cần thiết không: không cần
 *
 * Request 4:
 * PATCH /api/products/3 HTTP/1.1
 * Content-Type: application/json
 * { "price": 20000000 }
 *
 * -> Khác PUT ở điểm nào: PATCH chỉ update partial data, PUT thay toàn bộ object
 * -> Chỉ update field nào: price
 */

// ============================================================
// 1.4: BONUS - Tự test bằng http module (không dùng curl)
// ============================================================

/**
 * TODO (bonus): Viết function dùng http.request() để gọi các endpoint trên
 * và log kết quả ra console
 *
 * Ví dụ mẫu:
 */

function testEndpoint(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`${method} ${path} -> ${res.statusCode}`);
        if (data) console.log(JSON.parse(data));
        resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Test sau khi server start
setTimeout(async () => {
  await testEndpoint('GET', '/');
  await testEndpoint('GET', '/health');
  await testEndpoint('POST', '/body', { name: 'Alice', age: 25 });
  await testEndpoint('DELETE', '/nothing');
}, 100);
