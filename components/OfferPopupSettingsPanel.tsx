'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Megaphone, Upload, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn, prepareBannerImageForUpload } from '@/lib/utils';
import type { SiteSettings } from '@/lib/types';

const defaultForm = {
  offerPopupEnabled: false,
  offerPopupTitle: '',
  offerPopupSubtitle: '',
  offerPopupImageUrl: '',
  offerPopupImagePublicId: '',
  offerPopupInitialDelaySeconds: 3,
  offerPopupRepeatIntervalSeconds: 320,
};

export default function OfferPopupSettingsPanel() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.data) {
          const s = data.data as SiteSettings;
          setForm({
            offerPopupEnabled: s.offerPopupEnabled ?? false,
            offerPopupTitle: s.offerPopupTitle ?? '',
            offerPopupSubtitle: s.offerPopupSubtitle ?? '',
            offerPopupImageUrl: s.offerPopupImageUrl ?? '',
            offerPopupImagePublicId: s.offerPopupImagePublicId ?? '',
            offerPopupInitialDelaySeconds: s.offerPopupInitialDelaySeconds ?? 3,
            offerPopupRepeatIntervalSeconds: s.offerPopupRepeatIntervalSeconds ?? 320,
          });
          setImagePreview(s.offerPopupImageUrl || null);
        }
      } catch (error) {
        console.error('Failed to load offer popup settings:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleImageFile = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      const base64 = await prepareBannerImageForUpload(file);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: base64, folder: 'skygo/offer-popup' }),
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Upload failed');
      }
      setForm((prev) => ({
        ...prev,
        offerPopupImageUrl: uploadData.url,
        offerPopupImagePublicId: uploadData.public_id,
      }));
    } catch (error) {
      console.error(error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (form.offerPopupEnabled && (!form.offerPopupTitle.trim() || !form.offerPopupImageUrl.trim())) {
      alert('Please add a title and image before enabling the offer popup.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert('Offer popup settings saved successfully!');
      } else {
        throw new Error(data.error || 'Save failed');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save offer popup settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-8 py-10">
        <div className="animate-pulse rounded-[40px] bg-white h-96 border border-gray-100" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-10 space-y-10">
      <Card className="rounded-[40px] border-white shadow-sm overflow-hidden">
        <CardHeader className="p-8 pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-[#111827] tracking-tight uppercase flex items-center gap-3">
                <Megaphone className="h-7 w-7 text-[#bd9245]" />
                Offer Pop Up
              </CardTitle>
              <CardDescription className="text-sm font-medium text-gray-400 font-bold uppercase tracking-widest mt-1">
                Configure a promotional popup shown on all public pages
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {form.offerPopupEnabled ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Live on site
                </Badge>
              ) : (
                <Badge className="bg-gray-200 text-gray-500 hover:bg-gray-200 border-none font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest">
                  <AlertCircle className="h-3 w-3 mr-1" /> Disabled
                </Badge>
              )}
              <Switch
                checked={form.offerPopupEnabled}
                onCheckedChange={(val) => setForm((prev) => ({ ...prev, offerPopupEnabled: val }))}
                className="data-[state=checked]:bg-[#bd9245]"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Popup Image</p>
                <label
                  className={cn(
                    'flex flex-col items-center justify-center rounded-[28px] border-2 border-dashed p-8 cursor-pointer transition',
                    imagePreview ? 'border-[#bd9245]/30 bg-[#faf8f3]' : 'border-gray-200 bg-gray-50 hover:border-[#bd9245]/40'
                  )}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => handleImageFile(e.target.files?.[0] || null)}
                  />
                  {imagePreview ? (
                    <div className="relative w-full aspect-[4/5] max-h-80 rounded-2xl overflow-hidden">
                      <Image src={imagePreview} alt="Offer preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-[#bd9245] mb-3" />
                      <p className="text-sm font-bold text-[#111827]">Upload offer image</p>
                      <p className="text-xs text-gray-400 mt-1">Recommended: portrait or landscape promo visual</p>
                    </>
                  )}
                </label>
                {uploading && <p className="text-xs text-[#bd9245] font-bold">Uploading image...</p>}
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Title</p>
                <Input
                  value={form.offerPopupTitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, offerPopupTitle: e.target.value }))}
                  placeholder="e.g. Summer Bike Tour Offer"
                  className="bg-white border-gray-100 rounded-xl h-12 text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Subtitle Badge</p>
                <Input
                  value={form.offerPopupSubtitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, offerPopupSubtitle: e.target.value }))}
                  placeholder="e.g. Limited Time / 20% Off"
                  className="bg-white border-gray-100 rounded-xl h-12 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Show After (seconds)</p>
                  <Input
                    type="number"
                    min={0}
                    value={form.offerPopupInitialDelaySeconds}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        offerPopupInitialDelaySeconds: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className="bg-white border-gray-100 rounded-xl h-12 text-sm font-medium"
                  />
                  <p className="text-[11px] text-gray-400 px-1">Delay after page load before popup appears</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Repeat After (seconds)</p>
                  <Input
                    type="number"
                    min={10}
                    value={form.offerPopupRepeatIntervalSeconds}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        offerPopupRepeatIntervalSeconds: Math.max(10, Number(e.target.value) || 10),
                      }))
                    }
                    className="bg-white border-gray-100 rounded-xl h-12 text-sm font-medium"
                  />
                  <p className="text-[11px] text-gray-400 px-1">Re-show popup this many seconds after user closes it</p>
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving || uploading}
                className="w-full sm:w-auto rounded-2xl h-12 px-8 bg-[#bd9245] hover:bg-[#a67d3a] text-white font-black uppercase tracking-widest text-xs"
              >
                {saving ? 'Saving...' : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Offer Popup
                  </>
                )}
              </Button>
            </div>

            <div className="rounded-[32px] bg-[#111827] p-8 flex flex-col justify-center">
              <p className="text-[10px] font-black text-[#bd9245] uppercase tracking-[0.3em] mb-6">Live Preview</p>
              <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[24px] border border-white/10 shadow-2xl">
                <div className="relative aspect-[4/5] bg-gray-800">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm font-medium">
                      Upload an image to preview
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    {form.offerPopupSubtitle ? (
                      <span className="mb-3 inline-flex rounded-full bg-[#bd9245] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                        {form.offerPopupSubtitle}
                      </span>
                    ) : null}
                    <h3 className="text-xl font-black uppercase leading-tight text-white">
                      {form.offerPopupTitle || 'Your Offer Title'}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
