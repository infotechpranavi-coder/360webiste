"use client";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { BannerData } from "@/lib/types";
import { prepareBannerImageForUpload } from "@/lib/utils";

interface EditBannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBannerUpdated: (bannerData: BannerData) => void;
    banner: BannerData | null;
}

const EditBannerModal = ({ isOpen, onClose, onBannerUpdated, banner }: EditBannerModalProps) => {
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        link: "",
        order: "0",
        isActive: true,
    });

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [externalImageUrl, setExternalImageUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        if (banner) {
            setFormData({
                title: banner.title || "",
                subtitle: banner.subtitle || "",
                link: banner.link || "",
                order: banner.order?.toString() || "0",
                isActive: banner.isActive !== undefined ? banner.isActive : true,
            });
            setImagePreview(banner.image?.url || null);
            setExternalImageUrl("");
        }
    }, [banner]);

    const handleInputChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setExternalImageUrl(""); // Clear URL if file selected
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Image compression is now handled within handleSubmit using the global utility

    const handleSubmit = async () => {
        if (!banner) return;
        if (!formData.title || !formData.subtitle || (!imagePreview && !externalImageUrl)) {
            setSubmitError("Title, subtitle and image are required.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            let updatedImage = banner.image;

            if (image) {
                const base64 = await prepareBannerImageForUpload(image);
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: base64, folder: 'skygo/banners' }),
                });
                const uploadData = await uploadRes.json();
                if (uploadData.success) {
                    updatedImage = {
                        public_id: uploadData.public_id,
                        url: uploadData.url,
                        alt: formData.title
                    };
                } else {
                    throw new Error(uploadData.error || "Failed to upload image.");
                }
            } else if (externalImageUrl) {
                updatedImage = {
                    public_id: "",
                    url: externalImageUrl,
                    alt: formData.title
                };
            }

            const payload = {
                ...formData,
                order: Number(formData.order) || 0,
                image: updatedImage,
            };

            const res = await fetch(`/api/banners/${banner._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                onBannerUpdated(data.data);
                onClose();
            } else {
                setSubmitError(data.error || "Failed to update banner.");
            }
        } catch (err: any) {
            setSubmitError(err.message || "An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl rounded-[32px] border-none shadow-2xl p-0 bg-white overflow-hidden">
                <DialogHeader className="p-8 pb-4 bg-gray-50/50">
                    <DialogTitle className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Edit Home Banner</DialogTitle>
                    <DialogDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Modify the hero banner for the home page slider.</DialogDescription>
                </DialogHeader>

                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Banner Title</label>
                            <Textarea 
                                placeholder="e.g. TRAVEL&#10;MORE" 
                                value={formData.title} 
                                onChange={e => handleInputChange("title", e.target.value)} 
                                className="min-h-[100px] rounded-xl resize-none" 
                            />
                            <p className="text-[9px] text-gray-400 font-bold ml-1 uppercase">Press Enter for 2nd line. 1st line=White, 2nd line=Amber.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subtitle / Tagline</label>
                            <Textarea 
                                placeholder="e.g. WORRY LESS" 
                                value={formData.subtitle} 
                                onChange={e => handleInputChange("subtitle", e.target.value)} 
                                className="min-h-[100px] rounded-xl resize-none" 
                            />
                            <p className="text-[9px] text-gray-400 font-bold ml-1 uppercase">Optional: Use Enter for multiple lines.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Redirect Link (Optional)</label>
                            <Input placeholder="e.g. /tours or /packages" value={formData.link} onChange={e => handleInputChange("link", e.target.value)} className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Display Order</label>
                            <Input type="number" placeholder="0" value={formData.order} onChange={e => handleInputChange("order", e.target.value)} className="h-12 rounded-xl" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Banner Image</label>
                        <div className="space-y-4">
                            {(imagePreview || externalImageUrl) ? (
                                <div className="relative rounded-2xl overflow-hidden aspect-video group shadow-lg border border-gray-100">
                                    <img src={imagePreview || externalImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => { setImage(null); setImagePreview(null); setExternalImageUrl(""); }}
                                        className="absolute top-4 right-4 bg-red-500 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                        <p className="text-white text-[10px] font-bold uppercase tracking-widest">
                                            {image ? 'New File Selected' : externalImageUrl ? 'External URL Selected' : 'Current Banner Image'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <div
                                        className="border-2 border-dashed border-gray-100 rounded-[24px] p-10 text-center cursor-pointer hover:border-[#bd9245] hover:bg-gray-50/50 transition-all group"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#bd9245]/10 transition-colors">
                                            <Upload className="h-6 w-6 text-gray-300 group-hover:text-[#bd9245] transition-colors" />
                                        </div>
                                        <p className="text-xs font-black text-[#111827] uppercase tracking-widest">Update Banner Visual</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">PNG, JPG or WEBP recommended</p>
                                        <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Input placeholder="OR Paste high-res image URL here..." value={externalImageUrl} onChange={e => { setExternalImageUrl(e.target.value); setImage(null); setImagePreview(null); }} className="h-14 rounded-2xl flex-1 border-gray-100 shadow-sm" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isActiveEdit"
                            checked={formData.isActive}
                            onChange={(e) => handleInputChange("isActive", e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-[#bd9245] focus:ring-[#bd9245]"
                        />
                        <label htmlFor="isActiveEdit" className="text-sm font-bold text-gray-700 uppercase tracking-widest">Active Banner</label>
                    </div>
                </div>

                <DialogFooter className="p-8 bg-gray-50/50 flex flex-col items-center gap-4">
                    {submitError && <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">{submitError}</p>}
                    <div className="flex gap-4 w-full justify-end">
                        <Button variant="ghost" onClick={onClose} className="rounded-xl px-6 h-12 font-black uppercase text-xs tracking-widest">Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-[#111827] hover:bg-[#bd9245] rounded-xl px-10 h-12 font-black uppercase text-xs tracking-widest shadow-xl transition-all"
                        >
                            {isSubmitting ? "Updating..." : "Update Banner"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditBannerModal;
