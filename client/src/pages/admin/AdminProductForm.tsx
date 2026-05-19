import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { categoriesData } from "../../assets/assets";
import Loading from "../../components/Loading";
import api from "../../config/api";
import toast from "react-hot-toast";

export default function AdminProductForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);

    const navigate = useNavigate()

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [videoFiles, setVideoFiles] = useState<File[]>([]);
    const [documentFiles, setDocumentFiles] = useState<File[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        bedrooms: "",
        bathrooms: "",
        squareMeters: "",
        featured: false,
        images: [] as string[],
        videos: [] as string[],
        documents: [] as string[],
    });

    useEffect(() => {
        const fetchData = async () => {
            try{
                 if (isEdit) {
                const {data: designData} = await api.get(`/designs/${id}`);
                const p = designData.design;
                setFormData({
                    title: p.title,
                    description: p.description,
                    price: p.price.toString(),
                    category: p.category,
                    bedrooms: p.bedrooms?.toString() || "",
                    bathrooms: p.bathrooms?.toString() || "",
                    squareMeters: p.squareMeters?.toString() || "",
                    featured: p.featured || false,
                    images: p.images || [],
                    videos: p.videos || [],
                    documents: p.documents || [],
                })
            
        }
            } catch(error:any){
                toast.error(error.response?.data?.message || "Failed to load data")

            } finally{
                setLoading(false)
            }
           
        };
        fetchData();
    }, [id, isEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true)
        try {
            let finalImages = [...formData.images];
            let finalVideos = [...formData.videos];
            let finalDocuments = [...formData.documents];
    
            if(imageFiles.length > 0 || videoFiles.length > 0 || documentFiles.length > 0){
                const formDataUpload = new FormData();
                imageFiles.forEach(f => formDataUpload.append("images", f));
                videoFiles.forEach(f => formDataUpload.append("videos", f));
                documentFiles.forEach(f => formDataUpload.append("documents", f));
                
                const { data } = await api.post("/upload", formDataUpload);
                
                if(data.images) finalImages = [...finalImages, ...data.images];
                if(data.videos) finalVideos = [...finalVideos, ...data.videos];
                if(data.documents) finalDocuments = [...finalDocuments, ...data.documents];
            }
    
            if(finalImages.length === 0){
                toast.error("Please upload at least one image")
                setSaving(false)
                return                
            }

            const payload = {
                ...formData,
                images: finalImages,
                videos: finalVideos,
                documents: finalDocuments,
                price: Number(formData.price),
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
                squareMeters: Number(formData.squareMeters),
            }
    
            if(isEdit){
                await api.put(`/designs/${id}`, payload)
                toast.success("Design updated successfully")
            }
            else{
                await api.post("/designs", payload);
                toast.success("Design created successfully");
            }
            navigate('/admin/products')
            
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Failed to save design"
            );
        } finally {
            setSaving(false);
        }
       
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-4">
                    <Link to="/admin/products" className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg transition-colors">
                        <ArrowLeftIcon className="size-5" />
                    </Link>
                    <h2 className="text-xl font-semibold text-gray-900">{isEdit ? "Edit Design" : "New Design"}</h2>
                </div>
                {loading ? (
                    <Loading />
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 outline-none transition-all bg-white">
                                    <option value="">Select a category</option>
                                    {categoriesData.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (KES)</label>
                                <input required type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                                <input required type="number" min="0" value={formData.bedrooms} onChange={e => setFormData({ ...formData, bedrooms: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                                <input required type="number" min="0" step="0.5" value={formData.bathrooms} onChange={e => setFormData({ ...formData, bathrooms: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Square Meters</label>
                                <input required type="number" min="0" value={formData.squareMeters} onChange={e => setFormData({ ...formData, squareMeters: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 outline-none transition-all" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                                <input type="file" multiple accept="image/*" onChange={e => setImageFiles(Array.from(e.target.files || []))} className="w-full px-4 py-2.5 rounded-lg border border-gray-200" />
                                {formData.images.length > 0 && <p className="text-xs text-gray-500 mt-1">Currently has {formData.images.length} images</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Videos (optional)</label>
                                <input type="file" multiple accept="video/*" onChange={e => setVideoFiles(Array.from(e.target.files || []))} className="w-full px-4 py-2.5 rounded-lg border border-gray-200" />
                                {formData.videos.length > 0 && <p className="text-xs text-gray-500 mt-1">Currently has {formData.videos.length} videos</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Documents (PDF, ZIP, etc) (optional)</label>
                                <input type="file" multiple accept=".pdf,.zip,.rar" onChange={e => setDocumentFiles(Array.from(e.target.files || []))} className="w-full px-4 py-2.5 rounded-lg border border-gray-200" />
                                {formData.documents.length > 0 && <p className="text-xs text-gray-500 mt-1">Currently has {formData.documents.length} documents</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 outline-none transition-all resize-none" />
                            </div>
                            <div className="flex items-center gap-3">
                                <label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer">Featured Design</label>
                                <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} className="size-5 text-blue-600 rounded border-gray-300 cursor-pointer" />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200 flex justify-end">
                            <button disabled={saving} type="submit" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                                {saving ? "Saving..." : "Save Design"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}
