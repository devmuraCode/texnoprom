"use client";

import { useCartStore } from "@/store/cartStore";

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const addToCart = useCartStore((s) => s.addToCart);
  const decrease = useCartStore((s) => s.decrease);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const totalPrice = useCartStore((s) => s.totalPrice());
console.log(items)
  return (
    <div>
      <h1>Корзина</h1>

      {items.length === 0 ? (
        <p>Корзина пустая</p>
      ) : (
        <>
          {items.map((i) => (
            <div
              key={i.id}
              style={{ display: "flex", gap: 12, marginBottom: 12 }}
            >
              <div style={{ flex: 1 }}>
                <div>{i.title}</div>
                <div>{i.price} $</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => decrease(i.id)}>-</button>
                <b>{i.quantity}</b>
                <button onClick={() => addToCart(i, 1)}>+</button>
              </div>

              <button onClick={() => remove(i.id)}>Удалить</button>
            </div>
          ))}

          <hr />
          <p>
            <b>Итого:</b> {totalPrice} $
          </p>

          <button onClick={clear}>Очистить</button>
        </>
      )}
    </div>
  );
}
