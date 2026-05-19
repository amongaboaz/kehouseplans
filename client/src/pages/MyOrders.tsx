import { useEffect, useState } from "react"
import type { Order } from "../types"
import { Link, useSearchParams } from "react-router-dom"
import { useCart } from "../context/CartContext"
import Loading from "../components/Loading"
import {
  CalendarIcon,
  ChevronRightIcon,
  FileTextIcon,
  PackageIcon
} from "lucide-react"
import api from "../config/api"
import toast from "react-hot-toast"

const statusColors: Record<string, string> = {
  "Pending Confirmation": "bg-amber-100 text-amber-800",
  Approved: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
}

const MyOrders = () => {

  const currency = "KES "

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchParams, setSearchParams] = useSearchParams()

  const tabs = ["all", "Pending Confirmation", "Approved", "Cancelled"]
  const { clearCart } = useCart()

  const fetchOrders = async () => {
    setLoading(true)

    try {
      const params =
        activeTab !== "all"
          ? `?status=${encodeURIComponent(activeTab)}`
          : ""

      const { data } = await api.get(`/orders${params}`)
      setOrders(data.orders)

    } catch (error: any) {
      toast.error(error.response?.data?.message || error?.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searchParams.get("clearCart")) {
      clearCart()
      setSearchParams({})
      setTimeout(() => fetchOrders(), 1500)
    } else {
      fetchOrders()
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-app-cream mb-20">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <h1 className="text-2xl font-semibold text-app-blue mb-6">
          My House Plan Orders
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">

          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-app-accent text-white"
                  : "bg-white text-gray-500 border"
              }`}
            >
              {tab === "all" ? "All Orders" : tab}
            </button>
          ))}

        </div>

        {/* Content */}
        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border">

            <PackageIcon className="size-16 text-gray-300 mx-auto mb-4" />

            <h2 className="text-lg font-semibold text-app-blue mb-2">
              No orders yet
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Browse house plans and purchase your first design
            </p>

            <Link
              to="/products"
              className="inline-flex px-5 py-2.5 bg-app-accent text-white rounded-xl"
            >
              Browse House Plans
            </Link>

          </div>
        ) : (
          <div className="space-y-4">

            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 border shadow-sm"
              >

                {/* Header */}
                <div className="flex justify-between mb-4">

                  <div>

                    <p className="text-sm font-semibold text-app-blue">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>

                    <div className="flex items-center gap-2 mt-1">

                      <CalendarIcon className="size-3 text-gray-400" />

                      <span className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          }
                        )}
                      </span>

                    </div>

                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      statusColors[order.status] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>

                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">

                  {order.items.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                    >

                      <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileTextIcon className="size-5 text-blue-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-gray-900">
                        {currency}
                        {(item.price * item.quantity).toLocaleString()}
                      </span>

                    </div>
                  ))}

                  {order.items.length > 3 && (
                    <p className="text-xs text-gray-500 pl-3">
                      +{order.items.length - 3} more design(s)
                    </p>
                  )}

                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-3 border-t">

                  <div className="text-xs text-gray-500">
                    <span className="font-medium">
                      {order.paymentMethod}
                    </span>

                    {order.isPaid && (
                      <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px]">
                        Paid
                      </span>
                    )}
                  </div>

                  <span className="font-bold text-app-blue">
                    {currency}{order.total.toLocaleString()}
                  </span>

                </div>

                {/* Delivery Status (IMPORTANT FOR YOUR BUSINESS) */}

                {order.status === "Approved" && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-xs text-green-700 font-medium">
                      ✅ Your house plan files have been sent to{" "}
                      <strong>{order.customerEmail}</strong> via email.
                      Check inbox or spam folder.
                    </p>
                  </div>
                )}

                {order.status === "Pending Confirmation" && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs text-amber-700 font-medium">
                      ⏳ Payment verification in progress. Your design files
                      will be emailed once confirmed.
                    </p>
                  </div>
                )}

              </div>
            ))}

          </div>
        )}

        {/* Footer icon */}
        <div className="mt-6 flex justify-center">
          <ChevronRightIcon className="size-4 text-gray-400" />
        </div>

      </div>

    </div>
  )
}

export default MyOrders