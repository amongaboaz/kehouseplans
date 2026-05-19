import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, EditIcon, Trash2Icon } from "lucide-react";
import type { Design } from "../../types";
import Loading from "../../components/Loading";
import api from "../../config/api";
import toast from "react-hot-toast";

export default function AdminProducts() {
    const currency = "KES ";

    const [designs, setDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDesigns = async () => {
        try {
            const { data } = await api.get("/designs")
            setDesigns(data.designs)
        } catch (error:any) {
            toast.error(error.response?.data?.message || error?.message)
        } finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchDesigns();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
      
        try {
          await api.delete(`/designs/${id}`);
          toast.success("Design deleted successfully");
          fetchDesigns();
        } catch (error: any) {
          toast.error(
            error.response?.data?.message || "Failed to delete design"
          );
        }
      };

    if (loading) return <Loading />

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="text-xl font-semibold text-gray-900">Designs</h2>
                    <Link to="/admin/products/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm">
                        <PlusIcon className="size-4" /> Add Design
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Design</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Specs</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {designs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No designs found.</td>
                                </tr>
                            ) : (
                                designs.map(design => (
                                    <tr key={design.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={design.images?.[0] || ""} alt={design.title} className="size-12 rounded-lg object-cover bg-gray-100" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">{design.title}</p>
                                                    <p className="text-xs text-gray-500">{design.category || "Uncategorized"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{currency}{design.price.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {design.bedrooms} beds, {design.bathrooms} baths, {design.squareMeters}m²
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/admin/products/${design.id}/edit`} className="p-2 text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <EditIcon className="size-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(design.id, design.title)} title="Delete Design" className="p-2 text-gray-500 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2Icon className="size-4" />
                                                </button>
                                            </div>
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
