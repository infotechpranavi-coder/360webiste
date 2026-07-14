"use client";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload, FileText, Link2, PenLine } from "lucide-react";
import LiveLinkFrame from "@/components/LiveLinkFrame";
import { slugFromTitle, titleFromUrl } from "@/lib/blogLink";

interface CreateBlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBlogCreated: (blogData: any) => void;
}

type CreateMode = 'manual' | 'link';

const FALLBACK_COVER = '/safeimagekit-kayak2__1_.webp';

const CreateBlogModal = ({ isOpen, onClose, onBlogCreated }: CreateBlogModalProps) => {
    const [mode, setMode] = useState<CreateMode>('manual');
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: "Skygo Travel Expert",
        category: "Experience",
        status: "published",
        isFeatured: false,
    });

    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [externalImageUrl, setExternalImageUrl] = useState("");
    const [externalUrl, setExternalUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleInputChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleTitleChange = (title: string) => {
        setFormData(prev => ({
            ...prev,
            title,
            slug: slugFromTitle(title)
        }));
    };

    const handleExternalUrlChange = (url: string) => {
        setExternalUrl(url);
        const trimmed = url.trim();
        if (!trimmed) return;
        try {
            new URL(trimmed);
            const autoTitle = titleFromUrl(trimmed);
            setFormData((prev) => ({
                ...prev,
                title: prev.title || autoTitle,
                slug: prev.slug || slugFromTitle(autoTitle),
                excerpt: prev.excerpt || 'Linked page — view the full listing inside our blog.',
                content: trimmed,
            }));
            setTags(['External Link', 'Live Embed']);

            fetch('/api/blogs/preview-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: trimmed }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (!data.success || !data.data) return;
                    const preview = data.data;
                    setFormData((prev) => ({
                        ...prev,
                        title: prev.title || preview.title || autoTitle,
                        slug: prev.slug || slugFromTitle(preview.title || autoTitle),
                        excerpt: prev.excerpt || preview.excerpt || prev.excerpt,
                    }));
                    if (preview.image && !externalImageUrl.trim()) {
                        setExternalImageUrl(preview.image);
                    }
                })
                .catch(() => {});
        } catch {
            // incomplete URL while typing
        }
    };

    const handleAddTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
            setTags(prev => [...prev, currentTag.trim()]);
            setCurrentTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(prev => prev.filter(t => t !== tagToRemove));
    };

    const fileToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = e => reject(e);
        });

    const handleSubmit = async () => {
        if (mode === 'link') {
            if (!externalUrl.trim()) {
                setSubmitError("Paste an https link to continue.");
                return;
            }
            try {
                new URL(externalUrl.trim());
            } catch {
                setSubmitError("Please paste a valid https link.");
                return;
            }
        } else if (!formData.title || !formData.content || (!image && !externalImageUrl)) {
            setSubmitError("Title, content and at least one image/URL are required.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");
        try {
            const linkTitle =
                formData.title.trim() || titleFromUrl(externalUrl.trim());

            let uploadedImage: { public_id?: string; url: string; alt: string } | null = null;

            if (mode === 'manual' && image) {
                const base64 = await fileToBase64(image);
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: base64, folder: 'skygo/blogs' }),
                });
                const uploadData = await uploadRes.json();
                if (uploadData.success) {
                    uploadedImage = { public_id: uploadData.public_id, url: uploadData.url, alt: linkTitle };
                }
            } else if (externalImageUrl.trim()) {
                uploadedImage = { public_id: "external", url: externalImageUrl.trim(), alt: linkTitle };
            } else if (mode === 'link') {
                try {
                    const previewRes = await fetch('/api/blogs/preview-link', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: externalUrl.trim() }),
                    });
                    const previewData = await previewRes.json();
                    const previewImage = previewData?.data?.image;
                    uploadedImage = {
                        public_id: previewImage ? 'external' : 'default',
                        url: previewImage || FALLBACK_COVER,
                        alt: linkTitle,
                    };
                } catch {
                    uploadedImage = { public_id: "default", url: FALLBACK_COVER, alt: linkTitle };
                }
            }

            if (!uploadedImage) {
                throw new Error('Cover image is required.');
            }

            const payload =
                mode === 'link'
                    ? {
                          title: linkTitle,
                          slug: formData.slug || slugFromTitle(linkTitle),
                          excerpt: (formData.excerpt || 'Live linked page.').slice(0, 200),
                          content: externalUrl.trim(),
                          author: formData.author,
                          category: formData.category,
                          status: 'published',
                          isFeatured: formData.isFeatured,
                          image: uploadedImage,
                          tags: tags.length ? tags : ['Live Embed'],
                          sourceType: 'link' as const,
                          externalUrl: externalUrl.trim(),
                      }
                    : {
                          ...formData,
                          slug: formData.slug || slugFromTitle(formData.title),
                          excerpt: (formData.excerpt || formData.content).slice(0, 200),
                          image: uploadedImage,
                          tags,
                          sourceType: 'manual' as const,
                          externalUrl: '',
                      };

            const res = await fetch('/api/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                onBlogCreated(data.data);
                handleClose();
            } else {
                setSubmitError(data.error || "Failed to create blog.");
            }
        } catch (err: any) {
            setSubmitError(err.message || "An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setMode('manual');
        setFormData({
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            author: "Skygo Travel Expert",
            category: "Experience",
            status: "published",
            isFeatured: false,
        });
        setTags([]);
        setImage(null);
        setExternalImageUrl("");
        setExternalUrl("");
        setSubmitError("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl p-0 border-none shadow-2xl rounded-[32px] overflow-hidden bg-white text-[#111827]">
                <DialogHeader className="p-8 pb-4 bg-gray-50/50">
                    <DialogTitle className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Compose New Blog</DialogTitle>
                    <DialogDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                        Write your own story, or paste a link — we show that exact page on the blog detail view.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-8 pt-2">
                    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1.5">
                        <button
                            type="button"
                            onClick={() => setMode('manual')}
                            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                                mode === 'manual' ? 'bg-white text-[#111827] shadow-sm' : 'text-gray-500'
                            }`}
                        >
                            <PenLine className="h-4 w-4" />
                            Create Manually
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('link')}
                            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                                mode === 'link' ? 'bg-white text-[#111827] shadow-sm' : 'text-gray-500'
                            }`}
                        >
                            <Link2 className="h-4 w-4" />
                            Paste Link
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-8 max-h-[55vh] overflow-y-auto">
                    {mode === 'link' ? (
                        <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                            <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827]">
                                    Live Page Blog
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                        Page URL (any https link)
                                    </label>
                                    <Input
                                        placeholder="https://example.com/your-page"
                                        value={externalUrl}
                                        onChange={(e) => handleExternalUrlChange(e.target.value)}
                                        className="h-12 rounded-xl"
                                    />
                                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                                        Paste any https link — we try to show that live page on the blog detail view.
                                    </p>
                                </div>

                                {externalUrl.trim() && (
                                    <div className="rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden">
                                        <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                                                Live website
                                            </span>
                                        </div>
                                        <LiveLinkFrame
                                            url={externalUrl.trim()}
                                            title={formData.title.trim() || titleFromUrl(externalUrl.trim())}
                                            variant="compact"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                            Card Title (optional — auto from link)
                                        </label>
                                        <Input
                                            value={formData.title}
                                            onChange={(e) => handleTitleChange(e.target.value)}
                                            className="h-11 rounded-xl"
                                            placeholder="Shown on /blogs cards"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                                        <Select value={formData.category} onValueChange={(val) => handleInputChange("category", val)}>
                                            <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {['Travel Tips', 'Destinations', 'Lifestyle', 'News', 'Experience'].map((c) => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                            Cover image URL (optional — for blog cards only)
                                        </label>
                                        <Input
                                            placeholder="https://... (leave empty for default cover)"
                                            value={externalImageUrl}
                                            onChange={(e) => setExternalImageUrl(e.target.value)}
                                            className="h-11 rounded-xl text-xs"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2 h-11">
                                        <input
                                            type="checkbox"
                                            checked={formData.isFeatured}
                                            onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
                                            className="w-5 h-5 rounded border-gray-300 text-[#bd9245] focus:ring-[#bd9245]"
                                        />
                                        <span className="text-xs font-bold uppercase tracking-tight text-gray-600">Featured Post</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                                <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100">
                                    <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827]">Narrative Basics</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Title</label>
                                        <Input
                                            placeholder="e.g. My Journey Through the Kalahari"
                                            value={formData.title}
                                            onChange={e => handleTitleChange(e.target.value)}
                                            className="h-12 rounded-xl text-lg font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">URL Slug</label>
                                        <Input
                                            placeholder="slug-will-be-auto-generated"
                                            value={formData.slug}
                                            onChange={e => handleInputChange("slug", e.target.value)}
                                            className="h-12 rounded-xl bg-gray-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                                        <Select value={formData.category} onValueChange={val => handleInputChange("category", val)}>
                                            <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {['Travel Tips', 'Destinations', 'Lifestyle', 'News', 'Experience'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Author</label>
                                        <Input value={formData.author} onChange={e => handleInputChange("author", e.target.value)} className="h-12 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Featured</label>
                                        <div className="flex items-center space-x-2 h-12">
                                            <input
                                                type="checkbox"
                                                checked={formData.isFeatured}
                                                onChange={e => handleInputChange("isFeatured", e.target.checked)}
                                                className="w-5 h-5 rounded border-gray-300 text-[#bd9245] focus:ring-[#bd9245]"
                                            />
                                            <span className="text-xs font-bold uppercase tracking-tight text-gray-600">Featured Post</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                                <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100">
                                    <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827]">Content Studio</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Short Excerpt (Cards)</label>
                                        <Textarea
                                            placeholder="A brief summary for the blog card..."
                                            value={formData.excerpt}
                                            onChange={e => handleInputChange("excerpt", e.target.value)}
                                            className="max-h-[80px] rounded-xl pt-3 text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Main Article</label>
                                        <Textarea
                                            placeholder="Tell your story here..."
                                            value={formData.content}
                                            onChange={e => handleInputChange("content", e.target.value)}
                                            className="min-h-[300px] rounded-xl pt-3 text-sm leading-relaxed"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                                    <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100">
                                        <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827]">Cover Image</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="border-2 border-dashed border-gray-100 rounded-[24px] p-6 text-center cursor-pointer hover:border-[#bd9245] transition-all bg-gray-50/30 group" onClick={() => fileInputRef.current?.click()}>
                                            <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2 group-hover:text-[#bd9245] transition-colors" />
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{image ? image.name : "Select Cover Image"}</p>
                                            <input type="file" hidden ref={fileInputRef} onChange={e => setImage(e.target.files?.[0] || null)} accept="image/*" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">OR Image URL</label>
                                            <Input placeholder="https://..." value={externalImageUrl} onChange={e => setExternalImageUrl(e.target.value)} className="h-10 rounded-xl text-xs" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-3xl border-gray-100 shadow-sm overflow-hidden">
                                    <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100">
                                        <CardTitle className="text-sm font-black uppercase tracking-widest text-[#111827]">Tags & Metadata</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Add tag..."
                                                value={currentTag}
                                                onChange={e => setCurrentTag(e.target.value)}
                                                onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                                                className="h-10 rounded-xl"
                                            />
                                            <Button variant="outline" onClick={handleAddTag} className="rounded-xl h-10 px-4">Add</Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map(tag => (
                                                <Badge key={tag} className="bg-gray-100 text-[#111827] hover:bg-gray-200 border-none px-3 py-1 rounded-full flex items-center gap-2">
                                                    {tag}
                                                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter className="p-8 bg-gray-50/50 flex flex-col items-center gap-4">
                    {submitError && <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2 text-center">{submitError}</p>}
                    <div className="flex gap-4 w-full justify-end">
                        <Button variant="ghost" onClick={handleClose} className="rounded-2xl px-8 h-12 font-black uppercase text-xs tracking-widest">Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#111827] hover:bg-[#bd9245] rounded-2xl px-12 h-14 font-black uppercase text-xs tracking-widest shadow-xl transition-all flex gap-3">
                            {mode === 'link' ? <Link2 className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                            {isSubmitting ? "Publishing..." : mode === 'link' ? "Publish Live Page" : "Publish Narrative"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateBlogModal;
