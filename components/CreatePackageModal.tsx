"use client";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Minus, X, Upload, Star } from "lucide-react";
import { compressImage } from "@/lib/utils";

interface ItineraryDay {
  id: string;
  day: number;
  title: string;
  description: string;
}

interface InclusionExclusionCategory {
  id: string;
  category: string;
  items: string[];
}

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface CreatePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPackageCreated: (packageData: any) => void;
}

const CreatePackageModal = ({ isOpen, onClose, onPackageCreated }: CreatePackageModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    ideaFor: "",
    abstract: "",
    tourOverview: "",
    about: "Premium SkyGo Tours is a specialized travel management company dedicated to crafting exceptional journeys across dynamic destinations.",
    services: "Customized travel planning, Guided tours & local experiences, Group & family vacations, Luxury & adventure travel",
    tourDetails: "This carefully curated package offers a perfect blend of iconic landmarks, cultural immersion, and leisure activities.",
    price: "",
    duration: "",
    location: "",
    capacity: "",
    packageType: "international" as "international" | "domestic",
    place: "dubai",
    packageCategory: "Regular",
    bestTimeToVisit: { yearRound: "", winter: "", summer: "" },
    isFeaturedDestination: false,
    isPopularPackage: false,
    transportation: [] as Array<{ type: string; vehicle: string; description: string }>,
    accommodation: [] as Array<{ city: string; hotel: string; rooms: string; roomType: string; nights: string }>,
  });

  const [keyHighlights, setKeyHighlights] = useState<string[]>([""]);
  const [hotelOptions, setHotelOptions] = useState<string[]>(["Deluxe Package: 3★ hotels", "Gold Package: 4★ hotels", "Platinum Package: 5★ hotels"]);
  const [whyChooseThisTrip, setWhyChooseThisTrip] = useState<string[]>(["Well-balanced itinerary", "Transparent pricing"]);
  const [whyPremiumDubaiTours, setWhyPremiumDubaiTours] = useState<string[]>(["Dedicated customer support", "Experienced guides"]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([
    { id: "1", day: 1, title: "Arrival & Transfer", description: "Greeting at airport. Private transfer to hotel. Evening at leisure." }
  ]);
  const [inclusions, setInclusions] = useState<InclusionExclusionCategory[]>([
    { id: "1", category: "General", items: ["Airport transfers", "Daily breakfast", "Sightseeing tours"] }
  ]);
  const [exclusions, setExclusions] = useState<InclusionExclusionCategory[]>([
    { id: "1", category: "General", items: ["International airfare", "Visa fees", "Personal expenses"] }
  ]);
  const [faqs, setFaqs] = useState<Array<{ id: string; question: string; answer: string }>>([
    { id: "1", question: "Is this tour suitable for families with children?", answer: "Yes, all experiences are family-friendly and can be tailored to suit the needs of families with children." }
  ]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [externalImageUrls, setExternalImageUrls] = useState<string[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // --- Handlers ---
  const handleInputChange = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleAddUrl = () => {
    if (currentImageUrl.trim() && !externalImageUrls.includes(currentImageUrl.trim())) {
      setExternalImageUrls(prev => [...prev, currentImageUrl.trim()]);
      setCurrentImageUrl("");
    }
  };

  // Image compression is now handled within handleSubmit using the global utility

  const handleSubmit = async () => {
    if (!formData.title || !formData.price) {
      setSubmitError("Title and Price are required.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      // 1. Upload images to Cloudinary
      const uploadedImages: Array<{ public_id?: string; url: string; alt: string }> = [];
      for (const file of images) {
        const base64 = await compressImage(file);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: base64 })
        });
        const uploadData = await uploadRes.json();
        if (!uploadData.success) throw new Error(`Image upload failed: ${uploadData.error}`);
        uploadedImages.push({ public_id: uploadData.public_id, url: uploadData.url, alt: formData.title });
      }

      // Add external URLs
      for (const url of externalImageUrls) {
        uploadedImages.push({ url, alt: formData.title });
      }

      // 2. Build payload
      const payload = {
        ...formData,
        location: formData.place, // Use place as location to sync both fields
        price: parseFloat(formData.price as string),
        keyHighlights: keyHighlights.filter(h => h.trim()),
        hotelOptions: hotelOptions.filter(h => h.trim()),
        whyChooseThisTrip: whyChooseThisTrip.filter(w => w.trim()),
        whyPremiumSkygoTours: whyPremiumDubaiTours.filter(w => w.trim()),
        itinerary: itinerary.map(d => ({ day: d.day, title: d.title, description: d.description })),
        inclusions: inclusions.map(inc => ({ category: inc.category, items: inc.items.filter(i => i.trim()) })),
        exclusions: exclusions.map(exc => ({ category: exc.category, items: exc.items.filter(i => i.trim()) })),
        faqs: faqs.filter(f => f.question.trim() !== "").map(f => ({ question: f.question, answer: f.answer })),
        reviews,
        images: uploadedImages,
        transportation: formData.transportation,
        accommodation: formData.accommodation,
        isPopularPackage: formData.isPopularPackage,
        bookings: 0,
        rating: 0,
        isFeaturedDestination: formData.isFeaturedDestination,
      };

      // 3. Save to MongoDB
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || 'Failed to save package');

      // 4. Notify dashboard
      onPackageCreated(result.data);
      handleClose();
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "", subtitle: "", ideaFor: "", abstract: "", tourOverview: "",
      about: "Premium SkyGo Tours is a specialized travel management company dedicated to crafting exceptional journeys across dynamic destinations.",
      services: "Customized travel planning, Guided tours & local experiences, Group & family vacations, Luxury & adventure travel",
      tourDetails: "This carefully curated package offers a perfect blend of iconic landmarks, cultural immersion, and leisure activities.",
      price: "", duration: "", location: "", capacity: "",
      packageType: "international", place: "dubai", packageCategory: "Regular",
      bestTimeToVisit: { yearRound: "", winter: "", summer: "" },
      isFeaturedDestination: false,
      isPopularPackage: false,
      transportation: [],
      accommodation: [],
    });
    setKeyHighlights([""]);
    setHotelOptions(["Deluxe Package: 3★ hotels", "Gold Package: 4★ hotels", "Platinum Package: 5★ hotels"]);
    setWhyChooseThisTrip(["Well-balanced itinerary", "Transparent pricing"]);
    setWhyPremiumDubaiTours(["Dedicated customer support", "Experienced guides"]);
    setItinerary([{ id: "1", day: 1, title: "Arrival & Transfer", description: "Greeting at airport. Private transfer to hotel. Evening at leisure." }]);
    setInclusions([{ id: "1", category: "General", items: ["Airport transfers", "Daily breakfast"] }]);
    setExclusions([{ id: "1", category: "General", items: ["International airfare", "Visa fees"] }]);
    setFaqs([{ id: "1", question: "Is this tour suitable for families with children?", answer: "Yes, all experiences are family-friendly." }]);
    setFormData(prev => ({ ...prev, transportation: [], accommodation: [] }));
    setReviews([]);
    setImages([]);
    setExternalImageUrls([]);
    setCurrentImageUrl("");
    setSubmitError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 border-none rounded-[32px] overflow-hidden">
        <DialogHeader className="p-8 pb-4 bg-gray-50/50">
          <DialogTitle className="text-3xl font-black text-[#111827] uppercase tracking-tighter">Create New Package</DialogTitle>
          <DialogDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Fill in all the details to publish a new tour package. Fields marked * are required.</DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input placeholder="e.g. Dubai Grand Experience" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <Input placeholder="e.g. 6 Nights / 7 Days" value={formData.subtitle} onChange={e => handleInputChange('subtitle', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (₹) *</label>
              <Input type="number" placeholder="e.g. 49999" value={formData.price} onChange={e => handleInputChange('price', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Input placeholder="e.g. 6N/7D" value={formData.duration} onChange={e => handleInputChange('duration', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Capacity</label>
              <Input placeholder="e.g. 2 Adults + 1 Child" value={formData.capacity} onChange={e => handleInputChange('capacity', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Package Type *</label>
              <Select value={formData.packageType} onValueChange={v => handleInputChange('packageType', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="domestic">Domestic</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Place / Location *</label>
              <Input 
                placeholder="e.g. Darjeeling, West Bengal or Dubai, UAE" 
                value={formData.place} 
                onChange={e => handleInputChange('place', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <Select value={formData.packageCategory} onValueChange={v => handleInputChange('packageCategory', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Deluxe">Deluxe</SelectItem>
                  <SelectItem value="Oman Tour">Oman Tour</SelectItem>
                  <SelectItem value="Attraction and Activity">Attraction & Activity</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Wildlife">Wildlife</SelectItem>
                  <SelectItem value="Trekking">Trekking</SelectItem>
                  <SelectItem value="Beach">Beach</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2 py-2 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <Checkbox 
              id="isFeaturedDestination" 
              checked={formData.isFeaturedDestination} 
              onCheckedChange={(checked) => handleInputChange('isFeaturedDestination', !!checked as any)} 
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="isFeaturedDestination"
                className="text-sm font-bold uppercase tracking-widest leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show in Homepage Destinations Section
              </label>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                If checked, this package will be featured in the destinations grid on the home page.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 py-2 px-4 bg-amber-50/50 rounded-2xl border border-dashed border-amber-200">
            <Checkbox 
              id="isPopularPackage" 
              checked={formData.isPopularPackage} 
              onCheckedChange={(checked) => handleInputChange('isPopularPackage', !!checked as any)} 
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="isPopularPackage"
                className="text-sm font-bold uppercase tracking-widest leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show in Homepage Popular Packages Section
              </label>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                If checked, this package will appear in the Popular Packages section on the home page.
              </p>
            </div>
          </div>


          <div className="space-y-2">
            <label className="text-sm font-medium">Idea For</label>
            <Input placeholder="e.g. Families, Couples, Solo travelers" value={formData.ideaFor} onChange={e => handleInputChange('ideaFor', e.target.value)} />
          </div>

          {/* Abstract & Overview */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Abstract</label>
            <Textarea placeholder="Short executive summary of the package..." value={formData.abstract} onChange={e => handleInputChange('abstract', e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tour Overview</label>
            <Textarea placeholder="Detailed overview of the tour experience..." value={formData.tourOverview} onChange={e => handleInputChange('tourOverview', e.target.value)} rows={5} />
          </div>

          {/* Key Highlights */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Key Highlights</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setKeyHighlights(p => [...p, ""])}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            {keyHighlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <Input placeholder={`Highlight ${i + 1}`} value={h} onChange={e => setKeyHighlights(p => p.map((x, j) => j === i ? e.target.value : x))} />
                {keyHighlights.length > 1 && <Button variant="ghost" size="icon" onClick={() => setKeyHighlights(p => p.filter((_, j) => j !== i))}><X className="h-4 w-4 text-red-500" /></Button>}
              </div>
            ))}
          </div>

          {/* Hotel Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Hotel Options</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setHotelOptions(p => [...p, ""])}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            {hotelOptions.map((h, i) => (
              <div key={i} className="flex gap-2">
                <Input placeholder={`Hotel tier ${i + 1} (e.g. Deluxe: 3★)`} value={h} onChange={e => setHotelOptions(p => p.map((x, j) => j === i ? e.target.value : x))} />
                {hotelOptions.length > 1 && <Button variant="ghost" size="icon" onClick={() => setHotelOptions(p => p.filter((_, j) => j !== i))}><X className="h-4 w-4 text-red-500" /></Button>}
              </div>
            ))}
          </div>

          {/* Best Time to Visit */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Best Time to Visit</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div><label className="text-xs text-gray-500">Year Round</label><Textarea rows={2} placeholder="Year-round details..." value={formData.bestTimeToVisit.yearRound} onChange={e => setFormData(p => ({ ...p, bestTimeToVisit: { ...p.bestTimeToVisit, yearRound: e.target.value } }))} /></div>
              <div><label className="text-xs text-gray-500">Winter</label><Textarea rows={2} placeholder="Winter season details..." value={formData.bestTimeToVisit.winter} onChange={e => setFormData(p => ({ ...p, bestTimeToVisit: { ...p.bestTimeToVisit, winter: e.target.value } }))} /></div>
              <div><label className="text-xs text-gray-500">Summer</label><Textarea rows={2} placeholder="Summer season details..." value={formData.bestTimeToVisit.summer} onChange={e => setFormData(p => ({ ...p, bestTimeToVisit: { ...p.bestTimeToVisit, summer: e.target.value } }))} /></div>
            </div>
          </div>

          {/* Why Choose This Trip */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Why Choose This Trip?</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setWhyChooseThisTrip(p => [...p, ""])}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            {whyChooseThisTrip.map((w, i) => (
              <div key={i} className="flex gap-2">
                <Input placeholder={`Reason ${i + 1}`} value={w} onChange={e => setWhyChooseThisTrip(p => p.map((x, j) => j === i ? e.target.value : x))} />
                {whyChooseThisTrip.length > 1 && <Button variant="ghost" size="icon" onClick={() => setWhyChooseThisTrip(p => p.filter((_, j) => j !== i))}><X className="h-4 w-4 text-red-500" /></Button>}
              </div>
            ))}
          </div>

          {/* Why Premium Tours */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Why Premium SkyGo Tours?</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setWhyPremiumDubaiTours(p => [...p, ""])}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            {whyPremiumDubaiTours.map((w, i) => (
              <div key={i} className="flex gap-2">
                <Input placeholder={`Point ${i + 1}`} value={w} onChange={e => setWhyPremiumDubaiTours(p => p.map((x, j) => j === i ? e.target.value : x))} />
                {whyPremiumDubaiTours.length > 1 && <Button variant="ghost" size="icon" onClick={() => setWhyPremiumDubaiTours(p => p.filter((_, j) => j !== i))}><X className="h-4 w-4 text-red-500" /></Button>}
              </div>
            ))}
          </div>

          {/* Itinerary */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Day-wise Itinerary</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setItinerary(p => [...p, { id: Date.now().toString(), day: p.length + 1, title: "", description: "" }])}><Plus className="h-4 w-4 mr-1" /> Add Day</Button>
            </div>
            {itinerary.map((day) => (
              <Card key={day.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base"><Badge variant="secondary">Day {day.day}</Badge></CardTitle>
                    {itinerary.length > 1 && <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setItinerary(p => p.filter(d => d.id !== day.id).map((d, i) => ({ ...d, day: i + 1 })))}><Minus className="h-4 w-4" /></Button>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input placeholder={`Day ${day.day} title`} value={day.title} onChange={e => setItinerary(p => p.map(d => d.id === day.id ? { ...d, title: e.target.value } : d))} />
                  <Textarea rows={4} placeholder={`Day ${day.day} description...`} value={day.description} onChange={e => setItinerary(p => p.map(d => d.id === day.id ? { ...d, description: e.target.value } : d))} />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Inclusions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-green-700">✓ Inclusions</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setInclusions(p => [...p, { id: Date.now().toString(), category: "", items: [""] }])}><Plus className="h-4 w-4 mr-1" /> Add Category</Button>
            </div>
            {inclusions.map(cat => (
              <Card key={cat.id} className="border-green-100">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="Category name (e.g. Transfers, Meals)" value={cat.category} onChange={e => setInclusions(p => p.map(c => c.id === cat.id ? { ...c, category: e.target.value } : c))} />
                    {inclusions.length > 1 && <Button variant="ghost" size="icon" onClick={() => setInclusions(p => p.filter(c => c.id !== cat.id))}><Minus className="h-4 w-4 text-red-500" /></Button>}
                  </div>
                  {cat.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 pl-4">
                      <Input className="h-8 text-sm" placeholder={`Item ${idx + 1}`} value={item} onChange={e => setInclusions(p => p.map(c => c.id === cat.id ? { ...c, items: c.items.map((x, j) => j === idx ? e.target.value : x) } : c))} />
                      {cat.items.length > 1 && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setInclusions(p => p.map(c => c.id === cat.id ? { ...c, items: c.items.filter((_, j) => j !== idx) } : c))}><X className="h-3 w-3 text-red-400" /></Button>}
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="ml-4 h-7 text-xs" onClick={() => setInclusions(p => p.map(c => c.id === cat.id ? { ...c, items: [...c.items, ""] } : c))}><Plus className="h-3 w-3 mr-1" /> Add Item</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Exclusions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-red-700">✗ Exclusions</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setExclusions(p => [...p, { id: Date.now().toString(), category: "", items: [""] }])}><Plus className="h-4 w-4 mr-1" /> Add Category</Button>
            </div>
            {exclusions.map(cat => (
              <Card key={cat.id} className="border-red-100">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="Category name (e.g. Airfare, Visa)" value={cat.category} onChange={e => setExclusions(p => p.map(c => c.id === cat.id ? { ...c, category: e.target.value } : c))} />
                    {exclusions.length > 1 && <Button variant="ghost" size="icon" onClick={() => setExclusions(p => p.filter(c => c.id !== cat.id))}><Minus className="h-4 w-4 text-red-500" /></Button>}
                  </div>
                  {cat.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 pl-4">
                      <Input className="h-8 text-sm" placeholder={`Item ${idx + 1}`} value={item} onChange={e => setExclusions(p => p.map(c => c.id === cat.id ? { ...c, items: c.items.map((x, j) => j === idx ? e.target.value : x) } : c))} />
                      {cat.items.length > 1 && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExclusions(p => p.map(c => c.id === cat.id ? { ...c, items: c.items.filter((_, j) => j !== idx) } : c))}><X className="h-3 w-3 text-red-400" /></Button>}
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="ml-4 h-7 text-xs" onClick={() => setExclusions(p => p.map(c => c.id === cat.id ? { ...c, items: [...c.items, ""] } : c))}><Plus className="h-3 w-3 mr-1" /> Add Item</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Transportation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Transportation</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setFormData(p => ({ ...p, transportation: [...p.transportation, { type: "", vehicle: "", description: "" }] }))}><Plus className="h-4 w-4 mr-1" /> Add Transport</Button>
            </div>
            {formData.transportation.map((t, i) => (
              <Card key={i}>
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Type (e.g. Private Transfer)" value={t.type} onChange={e => setFormData(p => ({ ...p, transportation: p.transportation.map((x, j) => j === i ? { ...x, type: e.target.value } : x) }))} />
                    <Input placeholder="Vehicle (e.g. Luxury SUV)" value={t.vehicle} onChange={e => setFormData(p => ({ ...p, transportation: p.transportation.map((x, j) => j === i ? { ...x, vehicle: e.target.value } : x) }))} />
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Description" value={t.description} onChange={e => setFormData(p => ({ ...p, transportation: p.transportation.map((x, j) => j === i ? { ...x, description: e.target.value } : x) }))} />
                    <Button variant="ghost" size="icon" onClick={() => setFormData(p => ({ ...p, transportation: p.transportation.filter((_, j) => j !== i) }))}><X className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Accommodation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Accommodation</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setFormData(p => ({ ...p, accommodation: [...p.accommodation, { city: "", hotel: "", rooms: "", roomType: "", nights: "" }] }))}><Plus className="h-4 w-4 mr-1" /> Add Hotel</Button>
            </div>
            {formData.accommodation.map((a, i) => (
              <Card key={i}>
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="City" value={a.city} onChange={e => setFormData(p => ({ ...p, accommodation: p.accommodation.map((x, j) => j === i ? { ...x, city: e.target.value } : x) }))} />
                    <Input placeholder="Hotel" value={a.hotel} onChange={e => setFormData(p => ({ ...p, accommodation: p.accommodation.map((x, j) => j === i ? { ...x, hotel: e.target.value } : x) }))} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Input placeholder="Rooms" value={a.rooms} onChange={e => setFormData(p => ({ ...p, accommodation: p.accommodation.map((x, j) => j === i ? { ...x, rooms: e.target.value } : x) }))} />
                    <Input placeholder="Room Type" value={a.roomType} onChange={e => setFormData(p => ({ ...p, accommodation: p.accommodation.map((x, j) => j === i ? { ...x, roomType: e.target.value } : x) }))} />
                    <Input placeholder="Nights" value={a.nights} onChange={e => setFormData(p => ({ ...p, accommodation: p.accommodation.map((x, j) => j === i ? { ...x, nights: e.target.value } : x) }))} />
                  </div>
                  <Button className="w-full text-red-500" variant="ghost" onClick={() => setFormData(p => ({ ...p, accommodation: p.accommodation.filter((_, j) => j !== i) }))}>Remove Hotel</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Images */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Package Images (Max 5)</label>
            <div className="flex flex-col gap-4">
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-3 bg-gray-50/50 cursor-pointer hover:border-[#bd9245] transition-all" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Select Professional Images</p>
                <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl">Choose Files</Button>
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => {
                  const files = e.target.files;
                  if (files) setImages(p => [...p, ...Array.from(files)].slice(0, 5));
                }} />
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {images.map((f, i) => (
                      <Badge key={i} variant="secondary" className="flex items-center gap-1 bg-white border-gray-100 rounded-lg">
                        {f.name.length > 15 ? f.name.substring(0, 15) + '...' : f.name}
                        <X className="h-3 w-3 cursor-pointer text-red-400" onClick={(e) => { e.stopPropagation(); setImages(p => p.filter((_, j) => j !== i)); }} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input placeholder="OR Paste Image URL here..." value={currentImageUrl} onChange={e => setCurrentImageUrl(e.target.value)} className="h-12 rounded-xl flex-1" />
                <Button variant="outline" onClick={handleAddUrl} className="h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest px-6 hover:bg-[#bd9245] hover:text-white transition-all">Add URL</Button>
              </div>
              {externalImageUrls.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {externalImageUrls.map((url, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl border border-gray-100 overflow-hidden group">
                      <img src={url} className="w-full h-full object-cover" alt="" />
                      <button onClick={() => setExternalImageUrls(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Frequently Asked Questions</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setFaqs(p => [...p, { id: Date.now().toString(), question: "", answer: "" }])}><Plus className="h-4 w-4 mr-1" /> Add FAQ</Button>
            </div>
            {faqs.map((faq, i) => (
              <Card key={faq.id}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-gray-400">FAQ {i + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFaqs(p => p.filter(f => f.id !== faq.id))}><X className="h-3 w-3 text-red-500" /></Button>
                  </div>
                  <Input placeholder="Question" value={faq.question} onChange={e => setFaqs(p => p.map(f => f.id === faq.id ? { ...f, question: e.target.value } : f))} />
                  <Textarea placeholder="Answer" value={faq.answer} onChange={e => setFaqs(p => p.map(f => f.id === faq.id ? { ...f, answer: e.target.value } : f))} rows={2} />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Guest Reviews (Optional)</label>
              <Button type="button" variant="outline" size="sm" onClick={() => setReviews(p => [...p, { name: "", rating: 5, comment: "", date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }])}><Plus className="h-4 w-4 mr-1" /> Add Review</Button>
            </div>
            {reviews.map((r, i) => (
              <Card key={i}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-gray-400">Reviewer {i + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setReviews(p => p.filter((_, j) => j !== i))}><X className="h-3 w-3 text-red-500" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Guest Name" value={r.name} onChange={e => setReviews(p => p.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                    <div className="flex items-center gap-2 border rounded-md px-3">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      <input type="number" min={1} max={5} className="w-full text-sm font-bold outline-none" value={r.rating} onChange={e => setReviews(p => p.map((x, j) => j === i ? { ...x, rating: parseInt(e.target.value) } : x))} />
                    </div>
                  </div>
                  <Textarea placeholder="Guest review comment..." value={r.comment} onChange={e => setReviews(p => p.map((x, j) => j === i ? { ...x, comment: e.target.value } : x))} rows={2} />
                  <Input placeholder="Date (e.g. 15 Oct 2024)" value={r.date} onChange={e => setReviews(p => p.map((x, j) => j === i ? { ...x, date: e.target.value } : x))} />
                </CardContent>
              </Card>
            ))}
          </div>

        </div>

        <DialogFooter className="p-8 bg-gray-50/50 flex flex-col items-center gap-4">
          {submitError && <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">{submitError}</p>}
          <div className="flex gap-4 w-full justify-end">
            <Button variant="ghost" onClick={handleClose} disabled={isSubmitting} className="rounded-xl px-6 h-12 font-black uppercase text-xs tracking-widest whitespace-nowrap">Cancel</Button>
            <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting} 
                className="bg-[#111827] hover:bg-[#bd9245] rounded-xl px-10 h-12 font-black uppercase text-xs tracking-widest shadow-xl transition-all w-full md:w-auto"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Publishing...
                </span>
              ) : "Publish Package"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePackageModal;
