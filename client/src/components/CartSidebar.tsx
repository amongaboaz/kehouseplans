import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {ArrowRightIcon, MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon, XIcon } from "lucide-react";

const CartSidebar = () => {
  const currency = "KES ";

  const {
    items,
    updateQuantity,
    removeFromCart,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const grandTotal = cartTotal;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">

          <div className="flex items-center gap-2">
            <ShoppingBagIcon className="size-5 text-blue-600" />

            <h2 className="text-lg font-semibold text-gray-900">
              Your Cart
            </h2>

            <span className="px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-600 rounded-full">
              {items.length} {items.length === 1 ? "plan" : "plans"}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBagIcon className="size-16 text-gray-200 mb-4" />

              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                Your cart is empty
              </h4>
              <p className="text-sm text-gray-500">Browse designs and add them here</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.design.id}
                className="flex gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100"
              >
                <div className="size-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  <img
                    src={item.design.images?.[0] || ""}
                    alt={item.design.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {item.design.title}
                  </h4>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.design.bedrooms} bed · {item.design.squareMeters}m²
                  </p>

                  <p className="text-xs font-semibold text-blue-600 mt-1">
                    {currency}
                    {item.design.price.toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    
                    <div className="flex items-center gap-1.5">

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.design.id,
                            item.quantity - 1
                          )
                        }
                        className="size-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <MinusIcon className="size-3" />
                      </button>

                      <span className="text-sm font-semibold w-6 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.design.id,
                            item.quantity + 1
                          )
                        }
                        className="size-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <PlusIcon className="size-3" />
                      </button>

                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        {currency}
                        {(item.design.price * item.quantity).toLocaleString()}
                      </span>

                      <button
                        onClick={() =>
                          removeFromCart(item.design.id)
                        }
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/*Footer*/}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-200 space-y-3">
            <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-100 pt-3">
              <span>Total</span>
              <span>{currency}{grandTotal.toLocaleString()}</span>
            </div>

            <button onClick={() => {setIsCartOpen(false); navigate('/checkout'); window.scrollTo(0,0)}}
             className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm">
              Proceed to Checkout <ArrowRightIcon className="size-4" />
            </button>

          </div>
        )}

      </div>
    </>
  );
};

export default CartSidebar;
