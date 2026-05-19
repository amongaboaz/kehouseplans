import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PackageIcon, UsersIcon, ShoppingBagIcon } from "lucide-react";
import Loading from "../../components/Loading";
import api from "../../config/api";

interface Stats {
    totalOrders: number;
    totalUsers: number;
    totalDesigns: number;
    recentOrders: any[];
}

export default function AdminDashboard() {

    const currency = "KES ";

    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/admin/stats")
        .then((res)=>setStats(res.data))
        .catch(()=>({}))
        .finally(()=> setLoading(false))
    }, []);

    const cards = stats
        ? [
            { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBagIcon },
            { label: "Total Users", value: stats.totalUsers, icon: UsersIcon },
            { label: "Total Designs", value: stats.totalDesigns, icon: PackageIcon },
        ]
        : [];

    if (loading) return <Loading />

    const statusColors: any = {
        "Pending Confirmation": "bg-amber-100 text-amber-800",
        Approved: "bg-green-100 text-green-800",
        Cancelled: "bg-red-100 text-red-800",
    };

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex justify-between gap-3 shadow-sm">
                        <div>
                            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                            <p className="text-sm text-gray-500">{card.label}</p>
                        </div>
                        <div className={`size-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600`}>
                            <card.icon className="size-5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    <Link to="/admin/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                        View All →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-3">Order ID</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Items</th>
                                <th className="px-6 py-3">Total</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stats?.recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders yet.</td>
                                </tr>
                            ) : (
                                stats?.recentOrders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order.id.slice(-6).toUpperCase()}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{order.user?.name || "—"}</p>
                                            <p className="text-xs text-gray-500">{order.user?.email || ""}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{order.items?.length || 0} items</td>
                                        <td className="px-6 py-4 font-medium">{currency}{order.total?.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
