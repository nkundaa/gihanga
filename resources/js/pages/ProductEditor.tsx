import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, Check, ChevronDown, Copy, DollarSign, Eye, FileText, Globe, ImagePlus, Package, Plus, Save, Settings, ShoppingBag, Tags, Trash2, Truck, X, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../api";
import { cn } from "../utils/cn";
import { MagneticButton } from "../components/ui";
import Seo from "../components/Seo";
import type { Product } from "../data/catalog";

interface Brand { id: number; name: string; slug: string }
interface Category { id: number; slug: string; title: string }
interface Variant {
  id?: number;
  sku: string; barcode: string; price: string; sale_price: string;
  stock: string; weight: string; image: string; sort_order: number;
  attributes: Record<string, string>;
}

type ProductForm = Record<string, unknown>;

const TABS = [
  { key: "info", label: "Product Information", icon: FileText },
  { key: "media", label: "Media", icon: Camera },
  { key: "pricing", label: "Pricing", icon: DollarSign },
  { key: "inventory", label: "Inventory", icon: Package },
  { key: "variants", label: "Variants", icon: Tags },
  { key: "shipping", label: "Shipping", icon: Truck },
  { key: "seo", label: "SEO", icon: Globe },
  { key: "visibility", label: "Visibility", icon: Eye },
  { key: "advanced", label: "Advanced", icon: Settings },
];

const emptyForm = (): Record<string, unknown> => ({
  name: "", slug: "", category_id: "", brand_id: "",
  short_description: "", full_description: "", description: "",
  price: "", original_price: "", sale_price: "",
  sale_start: "", sale_end: "", tax_class: "taxable",
  sku: "", barcode: "", stock_quantity: "0", low_stock_alert: "5", allow_backorders: "no",
  weight: "", length: "", width: "", height: "",
  package_type: "", shipping_class: "", estimated_delivery: "",
  free_shipping: false, pickup_available: false,
  visibility: "draft", scheduled_at: "",
  featured: false, recommended: false, flash_sale: false,
  warranty: "", return_policy: "", min_order: "1", max_order: "",
  seo_title: "", seo_description: "", seo_keywords: "",
  canonical_url: "", og_image: "",
  tag: "", badge: "", sizes: [] as string[], colors: [] as string[], images: [] as string[],
  video_url: "", tags: [] as string[], variants: [] as Variant[],
  sizesInput: "", colorsInput: "",
});

export default function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showNewBrand, setShowNewBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [form, setForm] = useState<Record<string, unknown>>(emptyForm());

  useEffect(() => {
    api.categories.list().then((res) => setCategories(res.categories)).catch(() => {});
    api.seller.brands().then((res) => setBrands(res.brands)).catch(() => {});
    if (id) {
      api.seller.getProduct(Number(id)).then((res) => {
        const p = res.product;
        setForm({
          ...emptyForm(),
          name: p.name, slug: p.slug,
          category_id: (p as Product & { category_id?: number }).category_id ?? "",
          brand_id: p.brand?.id ?? "",
          short_description: p.shortDescription ?? "",
          full_description: p.fullDescription ?? "",
          description: p.description ?? "",
          price: p.price?.toString() ?? "",
          original_price: p.originalPrice?.toString() ?? "",
          sale_price: p.salePrice?.toString() ?? "",
          sale_start: p.saleStart ?? "", sale_end: p.saleEnd ?? "",
          tax_class: p.taxClass ?? "taxable",
          sku: p.sku ?? "", barcode: p.barcode ?? "",
          stock_quantity: (p.stockQuantity ?? 0).toString(),
          low_stock_alert: (p.lowStockAlert ?? 5).toString(),
          allow_backorders: p.allowBackorders ?? "no",
          weight: p.weight?.toString() ?? "", length: p.length?.toString() ?? "",
          width: p.width?.toString() ?? "", height: p.height?.toString() ?? "",
          package_type: p.packageType ?? "", shipping_class: p.shippingClass ?? "",
          estimated_delivery: p.estimatedDelivery ?? "",
          free_shipping: p.freeShipping ?? false, pickup_available: p.pickupAvailable ?? false,
          visibility: p.visibility ?? "draft", scheduled_at: p.scheduledAt ?? "",
          featured: p.featured ?? false, recommended: p.recommended ?? false,
          flash_sale: p.flashSale ?? false,
          warranty: p.warranty ?? "", return_policy: p.returnPolicy ?? "",
          min_order: (p.minOrder ?? 1).toString(), max_order: p.maxOrder?.toString() ?? "",
          seo_title: p.seoTitle ?? "", seo_description: p.seoDescription ?? "",
          seo_keywords: p.seoKeywords ?? "", canonical_url: p.canonicalUrl ?? "",
          og_image: p.ogImage ?? "",
          tag: p.tag ?? "", badge: p.badge ?? "",
          sizes: p.sizes ?? [], colors: p.colors ?? [],
          images: p.images ?? [],
          video_url: p.videoUrl ?? "",
          tags: p.tags?.map((t) => t.name) ?? [],
          variants: (p.variants ?? []).map((v) => ({
            id: v.id,
            sku: v.sku ?? "", barcode: v.barcode ?? "",
            price: v.price?.toString() ?? "", sale_price: (v as { sale_price?: number | null }).sale_price?.toString() ?? "",
            stock: v.stock?.toString() ?? "0", weight: v.weight ?? "",
            image: v.image ?? "", sort_order: v.sort_order ?? 0,
            attributes: v.attributes ?? {},
          })),
          sizesInput: "", colorsInput: "",
        });
      }).catch(() => navigate("/seller")).finally(() => setLoading(false));
    }
  }, [id, navigate]);

  const set = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  const addSize = () => {
    const val = (form.sizesInput as string || "").trim();
    if (!val) return;
    const current = form.sizes as string[];
    if (!current.includes(val)) set("sizes", [...current, val]);
    set("sizesInput", "");
  };
  const removeSize = (s: string) => set("sizes", (form.sizes as string[]).filter((x: string) => x !== s));

  const addColor = () => {
    const val = (form.colorsInput as string || "").trim();
    if (!val) return;
    const current = form.colors as string[];
    if (!current.includes(val)) set("colors", [...current, val]);
    set("colorsInput", "");
  };
  const removeColor = (c: string) => set("colors", (form.colors as string[]).filter((x: string) => x !== c));

  const addTag = () => {
    const val = tagInput.trim();
    if (!val) return;
    const current = form.tags as string[];
    if (!current.includes(val)) set("tags", [...current, val]);
    setTagInput("");
  };
  const removeTag = (t: string) => set("tags", (form.tags as string[]).filter((x: string) => x !== t));

  const addVariant = () => {
    set("variants", [...(form.variants as Variant[]), {
      sku: "", barcode: "", price: "", sale_price: "", stock: "0", weight: "", image: "",
      sort_order: (form.variants as Variant[]).length, attributes: {},
    }]);
  };
  const updateVariant = (index: number, key: string, value: unknown) => {
    const variants = [...(form.variants as Variant[])];
    variants[index] = { ...variants[index], [key]: value };
    set("variants", variants);
  };
  const removeVariant = (index: number) => {
    set("variants", (form.variants as Variant[]).filter((_: unknown, i: number) => i !== index));
  };

  const handleSave = async (visibility?: string) => {
    setSaving(true);
    try {
      const payload = { ...form };
      if (visibility) payload.visibility = visibility;
      delete payload.sizesInput;
      delete payload.colorsInput;
      Object.keys(payload).forEach((k) => {
        const val = payload[k];
        if (val === "" || val === null || val === undefined) {
          if (typeof val === "boolean") return;
          delete payload[k];
        }
      });
      delete (payload as Record<string, unknown>).id;
      delete (payload as Record<string, unknown>).slug;

      const result = isEditing
        ? await api.seller.updateProduct(Number(id), payload)
        : await api.seller.createProduct(payload);
      if (result.product?.id) {
        navigate(`/seller/products/edit/${result.product.id}`, { replace: true });
      } else {
        navigate("/seller");
      }
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!id) { handleSave("published"); return; }
    setSaving(true);
    try { await api.seller.publishProduct(Number(id)); } catch { /* */ }
    finally { setSaving(false); navigate("/seller"); }
  };

  const handleArchive = async () => {
    if (!id) return;
    setSaving(true);
    try { await api.seller.archiveProduct(Number(id)); } catch { /* */ }
    finally { setSaving(false); navigate("/seller"); }
  };

  const handleDuplicate = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const res = await api.seller.duplicateProduct(Number(id));
      if (res.product?.id) navigate(`/seller/products/edit/${res.product.id}`);
    } catch { /* */ }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!id || !confirm("Delete this product?")) return;
    setSaving(true);
    try { await api.seller.deleteProduct(Number(id)); navigate("/seller"); }
    catch { /* */ }
    finally { setSaving(false); }
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return;
    try {
      const res = await api.seller.createBrand({ name: newBrandName.trim() });
      if (res.brand) {
        setBrands([...brands, res.brand]);
        set("brand_id", res.brand.id);
      }
      setNewBrandName("");
      setShowNewBrand(false);
    } catch { /* */ }
  };

  const tabContent = useMemo(() => {
    const inp = (key: string, label: string, opts?: { type?: string; placeholder?: string; maxLength?: number; rows?: number; required?: boolean; className?: string }) => (
      <div className={cn("flex flex-col gap-1.5", opts?.className)}>
        <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#6D6D6D]">{label}{opts?.required ? " *" : ""}</label>
        {opts?.rows ? (
          <textarea value={form[key] as string} onChange={(e) => set(key, e.target.value)} rows={opts.rows} maxLength={opts?.maxLength} placeholder={opts?.placeholder} className="min-h-24 w-full resize-y rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2C5A82]" />
        ) : (
          <input type={opts?.type ?? "text"} value={form[key] as string} onChange={(e) => set(key, opts?.type === "number" ? e.target.value : e.target.value)} maxLength={opts?.maxLength} placeholder={opts?.placeholder} className="min-h-11 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#2C5A82]" />
        )}
      </div>
    );
    const sel = (key: string, label: string, options: { value: string; label: string }[]) => (
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#6D6D6D]">{label}</label>
        <select value={form[key] as string} onChange={(e) => set(key, e.target.value)} className="min-h-11 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#2C5A82]">
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    );

    return (
      <div className="space-y-6">
        {activeTab === "info" && (
          <div className="space-y-5">
            {inp("name", "Product Name", { placeholder: "e.g. Wireless Bluetooth Speaker", maxLength: 150, required: true })}
            {inp("slug", "Slug", { placeholder: "auto-generated" })}
            <div className="grid grid-cols-2 gap-4">
              {sel("category_id", "Category", [{ value: "", label: "Select category" }, ...categories.map((c) => ({ value: String(c.id), label: c.title }))])}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#6D6D6D]">Brand</label>
                <div className="flex gap-2">
                  <select value={form.brand_id as string} onChange={(e) => set("brand_id", e.target.value)} className="min-h-11 flex-1 rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#2C5A82]">
                    <option value="">Select brand</option>
                    {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  <button type="button" onClick={() => setShowNewBrand(!showNewBrand)} className="flex h-11 w-11 min-w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#6D6D6D] hover:bg-[#FAF9F5]">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {showNewBrand && (
                  <div className="flex gap-2 mt-2">
                    <input value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} placeholder="New brand name" className="min-h-10 flex-1 rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#2C5A82]" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddBrand())} />
                    <button type="button" onClick={handleAddBrand} className="rounded-full bg-[#14171F] px-4 text-xs font-bold text-white">Add</button>
                  </div>
                )}
              </div>
            </div>
            {inp("short_description", "Short Description (shown in search)", { placeholder: "Brief product summary…", maxLength: 300, rows: 2 })}
            {inp("full_description", "Full Description", { placeholder: "Detailed product description…", rows: 6 })}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#6D6D6D]">Tags</label>
              <div className="flex flex-wrap gap-2">
                {(form.tags as string[]).map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 rounded-full bg-[#FAF9F5] px-3 py-1 text-xs font-bold">
                    {t} <button type="button" onClick={() => removeTag(t)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Type and press Enter" className="min-h-10 flex-1 rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#2C5A82]" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} />
                <button type="button" onClick={addTag} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10"><Plus className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "media" && (
          <div className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#6D6D6D]">Product Images (JPEG, PNG, WEBP — max 10MB each)</label>
              <div className="flex flex-wrap gap-3">
                {(form.images as string[]).map((img, i) => (
                  <div key={i} className="group relative h-24 w-24 overflow-hidden rounded-2xl border border-black/10">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => set("images", (form.images as string[]).filter((_: string, idx: number) => idx !== i))} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"><X className="h-3 w-3" /></button>
                  </div>
                ))}
                <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-black/20 bg-[#FAF9F5] text-[#6D6D6D] hover:bg-white">
                  <ImagePlus className="h-6 w-6" />
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => {
                    const files = e.target.files;
                    if (!files) return;
                    Array.from(files).forEach((f) => {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (ev.target?.result) set("images", [...(form.images as string[]), ev.target.result as string]);
                      };
                      reader.readAsDataURL(f);
                    });
                  }} />
                </label>
              </div>
            </div>
            {inp("video_url", "Video URL (YouTube link)", { placeholder: "https://youtube.com/watch?v=…" })}
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {inp("price", "Regular Price (RWF)", { type: "number", placeholder: "e.g. 50000", required: true })}
              {inp("original_price", "Compare-at Price (RWF)", { type: "number", placeholder: "e.g. 65000" })}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {inp("sale_price", "Sale Price (RWF)", { type: "number", placeholder: "Must be lower than regular" })}
              {sel("tax_class", "Tax Class", [
                { value: "taxable", label: "Taxable" },
                { value: "tax_exempt", label: "Tax Exempt" },
                { value: "digital_goods", label: "Digital Goods" },
              ])}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {inp("sale_start", "Sale Start", { type: "datetime-local" })}
              {inp("sale_end", "Sale End", { type: "datetime-local" })}
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {inp("sku", "SKU", { placeholder: "Auto-generated or custom" })}
              {inp("barcode", "Barcode", { placeholder: "EAN / UPC / QR" })}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {inp("stock_quantity", "Stock Quantity", { type: "number", placeholder: "0" })}
              {inp("low_stock_alert", "Low Stock Alert", { type: "number", placeholder: "5" })}
              {sel("allow_backorders", "Allow Backorders", [
                { value: "no", label: "No" },
                { value: "yes", label: "Yes" },
                { value: "notify", label: "Notify Customer" },
              ])}
            </div>
          </div>
        )}

        {activeTab === "variants" && (
          <div className="space-y-5">
            {(form.variants as Variant[]).length === 0 && (
              <p className="text-sm text-[#909090]">No variants yet.</p>
            )}
            {(form.variants as Variant[]).map((v, i) => (
              <div key={i} className="rounded-2xl border border-black/10 bg-[#FAF9F5] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.12em]">Variant #{i + 1}</span>
                  <button type="button" onClick={() => removeVariant(i)} className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-[#909090] hover:bg-white"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {inp(`variants.${i}.sku`, "SKU", { placeholder: "Variant SKU", className: "col-span-1" })}
                  {inp(`variants.${i}.price`, "Price", { type: "number", placeholder: "0", className: "col-span-1" })}
                  {inp(`variants.${i}.stock`, "Stock", { type: "number", placeholder: "0", className: "col-span-1" })}
                </div>
                <div className="mt-3">
                  <RenderVariantForm variant={v} index={i} updateVariant={updateVariant} inp={inp} />
                </div>
              </div>
            ))}
            <button type="button" onClick={addVariant} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-black/20 bg-white py-4 text-sm font-bold text-[#6D6D6D] transition hover:bg-[#FAF9F5]">
              <Plus className="h-4 w-4" /> Add Variant
            </button>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-5">
            <div className="grid grid-cols-4 gap-4">
              {inp("weight", "Weight (kg)", { type: "number", placeholder: "0" })}
              {inp("length", "Length (cm)", { type: "number", placeholder: "0" })}
              {inp("width", "Width (cm)", { type: "number", placeholder: "0" })}
              {inp("height", "Height (cm)", { type: "number", placeholder: "0" })}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {inp("package_type", "Package Type", { placeholder: "e.g. Box, Envelope" })}
              {inp("shipping_class", "Shipping Class", { placeholder: "e.g. Standard, Express" })}
            </div>
            {inp("estimated_delivery", "Estimated Delivery", { placeholder: "e.g. 3–5 business days" })}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.free_shipping as boolean} onChange={(e) => set("free_shipping", e.target.checked)} className="h-5 w-5 accent-[#14171F]" />
                <span className="text-sm font-bold">Free Shipping</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.pickup_available as boolean} onChange={(e) => set("pickup_available", e.target.checked)} className="h-5 w-5 accent-[#14171F]" />
                <span className="text-sm font-bold">Pickup Available</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="space-y-5">
            {inp("seo_title", "SEO Title", { placeholder: "Up to 70 characters", maxLength: 70 })}
            {inp("seo_description", "SEO Description", { placeholder: "Up to 160 characters", maxLength: 160, rows: 3 })}
            {inp("seo_keywords", "SEO Keywords", { placeholder: "Comma-separated keywords" })}
            {inp("canonical_url", "Canonical URL", { placeholder: "https://…" })}
            {inp("og_image", "Open Graph Image URL", { placeholder: "https://…" })}
          </div>
        )}

        {activeTab === "visibility" && (
          <div className="space-y-5">
            {sel("visibility", "Visibility", [
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "private", label: "Private" },
              { value: "scheduled", label: "Scheduled" },
              { value: "hidden", label: "Hidden" },
            ])}
            {form.visibility === "scheduled" && inp("scheduled_at", "Schedule Date", { type: "datetime-local" })}
            <div className="flex flex-wrap gap-6 pt-3 border-t border-black/10">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured as boolean} onChange={(e) => set("featured", e.target.checked)} className="h-5 w-5 accent-[#14171F]" />
                <span className="text-sm font-bold">Featured Product</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.recommended as boolean} onChange={(e) => set("recommended", e.target.checked)} className="h-5 w-5 accent-[#14171F]" />
                <span className="text-sm font-bold">Recommended</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.flash_sale as boolean} onChange={(e) => set("flash_sale", e.target.checked)} className="h-5 w-5 accent-[#14171F]" />
                <span className="text-sm font-bold">Flash Sale</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === "advanced" && (
          <div className="space-y-5">
            {inp("warranty", "Warranty Information", { rows: 3, placeholder: "e.g. 12-month manufacturer warranty" })}
            {inp("return_policy", "Return Policy", { rows: 3, placeholder: "e.g. Free returns within 30 days" })}
            <div className="grid grid-cols-2 gap-4">
              {inp("min_order", "Minimum Order Qty", { type: "number", placeholder: "1" })}
              {inp("max_order", "Maximum Order Qty", { type: "number", placeholder: "Unlimited" })}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.pickup_available as boolean} onChange={(e) => set("pickup_available", e.target.checked)} className="h-5 w-5 accent-[#14171F]" />
                <span className="text-sm font-bold">Pickup Available</span>
              </label>
            </div>
          </div>
        )}
      </div>
    );
  }, [activeTab, form, categories, brands, showNewBrand, newBrandName, tagInput]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F5] pt-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2C5A82] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden bg-[#FAF9F5] pt-24 lg:pt-28">
      <Seo title={`${isEditing ? "Edit" : "Create"} Product - Gihanga Market`} path={isEditing ? `/seller/products/edit/${id}` : "/seller/products/new"} />
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-4">
          <Link to="/seller" className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-[#6D6D6D] transition hover:bg-[#14171F] hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-black tracking-[-0.04em]">{isEditing ? "Edit Product" : "New Product"}</h1>
            <p className="text-xs text-[#6D6D6D]">{isEditing ? `ID: ${id}` : "Create a new product for your store"}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-64 lg:min-w-64">
            <nav className="flex gap-2 overflow-x-auto lg:flex-col">
              {TABS.map((tab) => (
                <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
                  className={cn("flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-bold transition", activeTab === tab.key ? "bg-[#14171F] text-white" : "bg-white text-[#6D6D6D] hover:bg-[#FAF9F5]")}>
                  <tab.icon className="h-4 w-4" /> {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          <motion.div key={activeTab} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="flex-1">
            <div className="rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
              {tabContent}
            </div>
          </motion.div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <MagneticButton variant="gold" onClick={() => handleSave()} disabled={saving} className="min-h-11 px-6 py-3 text-sm">
              <Save className="mr-2 h-4 w-4" /> {saving ? "Saving…" : "Save Draft"}
            </MagneticButton>
            <MagneticButton variant="secondary" onClick={handlePublish} disabled={saving} className="min-h-11 px-6 py-3 text-sm">
              <Zap className="mr-2 h-4 w-4" /> {saving ? "Publishing…" : "Publish"}
            </MagneticButton>
            {id && (
              <button type="button" onClick={handleDuplicate} disabled={saving} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold transition hover:bg-[#FAF9F5]">
                <Copy className="mr-2 inline h-4 w-4" /> Duplicate
              </button>
            )}
          </div>
          {id && (
            <div className="flex gap-2">
              <button type="button" onClick={handleArchive} disabled={saving} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold text-[#6D6D6D] transition hover:bg-[#FAF9F5]">
                Archive
              </button>
              <button type="button" onClick={handleDelete} disabled={saving} className="rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50">
                <Trash2 className="mr-2 inline h-4 w-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RenderVariantForm({ variant, index, updateVariant, inp: _inp }: {
  variant: Variant; index: number; updateVariant: (i: number, k: string, v: unknown) => void;
  inp: (key: string, label: string, opts?: Record<string, unknown>) => React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#6D6D6D]">Color</label>
        <input value={variant.attributes.color ?? ""} onChange={(e) => updateVariant(index, "attributes", { ...variant.attributes, color: e.target.value })} placeholder="e.g. Black" className="min-h-10 rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#2C5A82]" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#6D6D6D]">Size</label>
        <input value={variant.attributes.size ?? ""} onChange={(e) => updateVariant(index, "attributes", { ...variant.attributes, size: e.target.value })} placeholder="e.g. M" className="min-h-10 rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#2C5A82]" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#6D6D6D]">Material</label>
        <input value={variant.attributes.material ?? ""} onChange={(e) => updateVariant(index, "attributes", { ...variant.attributes, material: e.target.value })} placeholder="e.g. Cotton" className="min-h-10 rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#2C5A82]" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#6D6D6D]">Weight</label>
        <input value={variant.weight} onChange={(e) => updateVariant(index, "weight", e.target.value)} placeholder="e.g. 0.5 kg" className="min-h-10 rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none transition focus:border-[#2C5A82]" />
      </div>
    </div>
  );
}


