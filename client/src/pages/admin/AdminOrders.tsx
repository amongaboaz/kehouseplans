import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import api from "../../config/api";

export default function AdminOrders() {

    const currency = "KES ";
  
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
          const { data } = await api.get("/orders/all");
          setOrders(data.orders ?? data);
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to load orders");
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        if(newStatus === "Approved" && !window.confirm("Approving this order will automatically email the downloadable files to the customer. Are you sure?")) {
            return;
        }

        try {
          await api.put(`/orders/${id}/status`, { status:newStatus })
          toast.success("Order status updated")
          fetchOrders()
        } catch (error: any) {
          toast.error(
            error.response?.data?.message || "Failed to update status"
          );
        }
      };
      
    const statusOptions = ["Pending Confirmation", "Approved", "Cancelled"];
    const statusColors: any = {
        "Pending Confirmation": "bg-amber-100 text-amber-800",
        Approved: "bg-green-100 text-green-800",
        Cancelled: "bg-red-100 text-red-800",
    };

    if (loading) return <Loading />

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Order Details</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                                </tr>
                            ) : (
                                orders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">#{order.id.slice(-6)}</p>
                                            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{order.user?.name || "Guest"}</p>
                                            <p className="text-xs text-gray-500">{order.customerEmail || order.user?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-600 max-w-[200px] truncate">
                                                {order.items?.map((item: any) => item.title).join(", ")}
                                            </div>
                                            <div className="text-[10px] text-gray-400 mt-1">
                                                {order.items?.length} items
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{currency}{order.total.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-gray-600">{order.paymentMethod}</span>
                                            {order.isPaid && <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Paid</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-r-8 border-transparent outline-none cursor-pointer leading-tight ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}
                                            >
                                                {statusOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
