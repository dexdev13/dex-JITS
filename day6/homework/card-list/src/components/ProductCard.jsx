/**
 * ProductCard Component
 * Homework Day 6
 *
 * Nhận props:
 *   - id (number)
 *   - name (string)
 *   - price (number) — VND
 *   - category (string)
 *   - rating (number) — 1-5
 *   - inStock (boolean)
 *   - isInCart (boolean) — sản phẩm đã có trong giỏ chưa
 *   - onAddToCart (function) — callback khi click "Thêm vào giỏ"
 *   - onRemoveFromCart (function) — callback khi click "Xóa khỏi giỏ"
 */

// ============================================================
// TODO: Implement ProductCard
// ============================================================
//
// Yêu cầu:
//
// 1. Hiển thị thông tin sản phẩm:
//    - Tên sản phẩm
//    - Giá: format VND (price.toLocaleString("vi-VN") + " ₫")
//    - Category: dạng badge
//    - Rating: dạng sao ★★★★☆
//      Gợi ý: "★".repeat(rating) + "☆".repeat(5 - rating)
//    - Trạng thái: "Còn hàng" (xanh) hoặc "Hết hàng" (đỏ)
//
// 2. Button:
//    - Nếu hết hàng (inStock === false): button "Hết hàng" disabled
//    - Nếu đã trong giỏ (isInCart === true): button "Xóa khỏi giỏ" → gọi onRemoveFromCart(id)
//    - Nếu chưa trong giỏ: button "Thêm vào giỏ" → gọi onAddToCart(id)
//
// 3. Style:
//    - Card có border, border-radius, padding
//    - Hết hàng: opacity 0.6
//    - Đã trong giỏ: border màu xanh
//
// 4. Performance:
//    - console.log("ProductCard rendered:", name) — để verify re-render
//
// Gợi ý cấu trúc:
//   function ProductCard({ id, name, price, category, rating, inStock, isInCart, onAddToCart, onRemoveFromCart }) {
//     console.log("ProductCard rendered:", name);
//
//     const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
//
//     return (
//       <div className={`product-card ${!inStock ? "out-of-stock" : ""} ${isInCart ? "in-cart" : ""}`}>
//         ...
//       </div>
//     );
//   }
//
//   export default ProductCard;

// TODO — Implement bên dưới:

function ProductCard({
  id,
  name,
  price,
  category,
  rating,
  inStock,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
}) {
  console.log('ProductCard rendered:', name);

  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <div
      className={`product-card ${!inStock ? 'out-of-stock' : ''} ${isInCart ? 'in-cart' : ''}`}
      style={{
        border: isInCart ? '2px solid #007bff' : '1px solid #ddd',
        borderRadius: 8,
        padding: 16,
        opacity: inStock ? 1 : 0.6,
      }}
    >
      <h3 style={{ margin: '0 0 8px' }}>{name}</h3>
      <p style={{ margin: '4px 0', fontWeight: 'bold' }}>{price.toLocaleString('vi-VN')} ₫</p>
      <span style={{ background: '#e0e0e0', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
        {category}
      </span>
      <p style={{ margin: '6px 0', color: '#f5a623' }}>{stars}</p>
      <p
        style={{
          margin: '4px 0',
          color: inStock ? 'green' : 'red',
          fontSize: 12,
          fontWeight: 'bold',
        }}
      >
        {inStock ? 'Còn hàng' : 'Hết hàng'}
      </p>
      {!inStock ? (
        <button
          disabled
          style={{
            marginTop: 8,
            padding: '8px 16px',
            background: '#ccc',
            border: 'none',
            borderRadius: 4,
            cursor: 'not-allowed',
          }}
        >
          Hết hàng
        </button>
      ) : isInCart ? (
        <button
          onClick={() => onRemoveFromCart(id)}
          style={{
            marginTop: 8,
            padding: '8px 16px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Xóa khỏi giỏ
        </button>
      ) : (
        <button
          onClick={() => onAddToCart(id)}
          style={{
            marginTop: 8,
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Thêm vào giỏ
        </button>
      )}
    </div>
  );
}

export default ProductCard;
