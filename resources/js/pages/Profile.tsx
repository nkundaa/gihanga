import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock, MapPin, Plus, Trash2, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import { MagneticButton } from "../components/ui";
import Seo from "../components/Seo";

interface Address {
  id: number;
  label: string | null;
  phone: string;
  address: string;
  city: string;
  is_default: boolean;
}

export default function Profile() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addrForm, setAddrForm] = useState({ label: "", phone: "", address: "", city: "Kigali", is_default: false });
  const [addrSaving, setAddrSaving] = useState(false);

  useEffect(() => {
    if (user) { setName(user.name); setPhone(user.phone ?? ""); }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) { setLoadingAddresses(false); return; }
    api.addresses.list().then((res) => setAddresses(res.addresses)).catch(() => {}).finally(() => setLoadingAddresses(false));
  }, [isAuthenticated]);

  const saveProfile = async () => {
    setSaving(true); setProfileError(""); setSaved(false);
    try {
      const res = await api.auth.updateProfile({ name, phone: phone || undefined });
      setSaved(true);
    } catch { setProfileError("Failed to save profile."); }
    finally { setSaving(false); }
  };

  const savePassword = async () => {
    setPwSaving(true); setPwError(""); setPwSaved(false);
    if (pwNew !== pwConfirm) { setPwError("Passwords do not match."); setPwSaving(false); return; }
    try {
      await api.auth.updatePassword({ current_password: pwCurrent, password: pwNew, password_confirmation: pwConfirm });
      setPwSaved(true); setPwCurrent(""); setPwNew(""); setPwConfirm("");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data;
      setPwError(typeof data?.message === "string" ? data.message : "Failed to update password.");
    }
    finally { setPwSaving(false); }
  };

  const saveAddress = async () => {
    setAddrSaving(true);
    try {
      if (editingAddress) {
        const res = await api.addresses.update(editingAddress.id, addrForm);
        setAddresses((prev) => prev.map((a) => a.id === editingAddress.id ? { ...a, ...addrForm } : a));
      } else {
        const res = await api.addresses.create(addrForm);
        setAddresses((prev) => [...prev, res.address]);
      }
      setShowAddressForm(false); setEditingAddress(null);
      setAddrForm({ label: "", phone: "", address: "", city: "Kigali", is_default: false });
    } catch { /* ignore */ }
    finally { setAddrSaving(false); }
  };

  const deleteAddress = async (id: number) => {
    try {
      await api.addresses.delete(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch { /* ignore */ }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] pt-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="overflow-x-hidden bg-[#F8F9FA] pt-24 lg:pt-28">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-dashed border-black/10 bg-white/60 px-6 py-16 text-center">
            <p className="font-editorial text-6xl text-[#D4AF37]">🔒</p>
            <h2 className="mt-4 font-display text-2xl font-black tracking-[-0.04em]">Sign in to manage your profile</h2>
            <MagneticButton to="/login" variant="gold" className="mt-6 min-h-12 px-6 py-3 text-sm">Sign in</MagneticButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden bg-[#F8F9FA] pt-24 lg:pt-28">
      <Seo title="Profile - Gihanga Market" path="/profile" description="Manage your GIHANGA profile and settings." />
      <div className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#666666] transition hover:text-[#111111]">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
          </Link>
          <h1 className="mt-4 font-display text-[clamp(1.4rem,4.5vw,4.5rem)] font-black leading-[0.92] tracking-[-0.06em]">Profile settings</h1>
        </div>

        <div className="space-y-8">
          <section className="rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.06)] sm:p-8">
            <div className="flex items-center gap-3">
              <UserIcon className="h-5 w-5 text-[#D4AF37]" />
              <h2 className="font-display text-xl font-black tracking-[-0.04em]">Personal information</h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Full name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Email</label>
                <input readOnly value={user?.email ?? ""} className="min-h-12 w-full rounded-2xl border border-black/10 bg-[#F8F9FA] px-4 py-3 text-sm text-[#666666]" />
                <p className="mt-1 text-xs text-[#888]">Email cannot be changed.</p>
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37]" placeholder="+250 788 000 000" />
              </div>
            </div>
            {profileError ? <p className="mt-4 text-sm text-red-500">{profileError}</p> : null}
            {saved ? <p className="mt-4 text-sm text-green-600">Profile updated successfully.</p> : null}
            <MagneticButton variant="gold" className="mt-6 min-h-12 px-6 py-3 text-sm" onClick={saveProfile} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </MagneticButton>
          </section>

          <section className="rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.06)] sm:p-8">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-[#D4AF37]" />
              <h2 className="font-display text-xl font-black tracking-[-0.04em]">Password</h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Current password</label>
                <input type="password" value={pwCurrent} onChange={(e) => setPwCurrent(e.target.value)} className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">New password</label>
                <input type="password" value={pwNew} onChange={(e) => setPwNew(e.target.value)} className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Confirm new password</label>
                <input type="password" value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37]" />
              </div>
            </div>
            {pwError ? <p className="mt-4 text-sm text-red-500">{pwError}</p> : null}
            {pwSaved ? <p className="mt-4 text-sm text-green-600">Password updated successfully.</p> : null}
            <MagneticButton variant="primary" className="mt-6 min-h-12 px-6 py-3 text-sm" onClick={savePassword} disabled={pwSaving}>
              {pwSaving ? "Updating…" : "Update password"}
            </MagneticButton>
          </section>

          <section className="rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.06)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-[#D4AF37]" />
                <h2 className="font-display text-xl font-black tracking-[-0.04em]">Addresses</h2>
              </div>
              <button type="button" onClick={() => { setEditingAddress(null); setAddrForm({ label: "", phone: user?.phone ?? "", address: "", city: "Kigali", is_default: false }); setShowAddressForm(true); }} className="min-h-11 rounded-full border border-black/10 bg-[#F8F9FA] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition hover:bg-[#111111] hover:text-white flex items-center gap-2">
                <Plus className="h-3.5 w-3.5" /> Add address
              </button>
            </div>

            {loadingAddresses ? (
              <div className="mt-6 flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
              </div>
            ) : addresses.length === 0 && !showAddressForm ? (
              <div className="mt-6 rounded-2xl border border-dashed border-black/10 bg-[#F8F9FA] p-8 text-center">
                <p className="text-sm text-[#666666]">No addresses saved yet.</p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-[#F8F9FA] p-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">{addr.label || "Address"}</p>
                        {addr.is_default ? <span className="rounded-full bg-[#D4AF37] px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.15em]">Default</span> : null}
                      </div>
                      <p className="text-sm text-[#666666]">{addr.address}, {addr.city}</p>
                      <p className="text-xs text-[#666666]">{addr.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setEditingAddress(addr); setAddrForm({ label: addr.label ?? "", phone: addr.phone, address: addr.address, city: addr.city, is_default: addr.is_default }); setShowAddressForm(true); }} className="min-h-10 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.15em] transition hover:bg-[#111111] hover:text-white">
                        Edit
                      </button>
                      <button type="button" onClick={() => deleteAddress(addr.id)} className="min-h-10 rounded-full border border-red-200 bg-white px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-red-600 transition hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showAddressForm ? (
              <div className="mt-6 rounded-2xl border border-[#D4AF37] bg-[#D4AF37]/5 p-5">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#D4AF37]">{editingAddress ? "Edit" : "New"} address</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Label</label>
                    <input value={addrForm.label} onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })} className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37]" placeholder="Home, Office, etc." />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Phone</label>
                    <input value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37]" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">Address</label>
                    <input value={addrForm.address} onChange={(e) => setAddrForm({ ...addrForm, address: e.target.value })} className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.28em] text-[#666666]">City</label>
                    <input value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37]" />
                  </div>
                  <div className="flex items-center gap-3 pt-4">
                    <input type="checkbox" id="is_default" checked={addrForm.is_default} onChange={(e) => setAddrForm({ ...addrForm, is_default: e.target.checked })} className="h-4 w-4 accent-[#111111]" />
                    <label htmlFor="is_default" className="text-sm font-bold">Set as default address</label>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <MagneticButton variant="gold" className="min-h-11 px-5 py-2 text-xs" onClick={saveAddress} disabled={addrSaving}>
                    {addrSaving ? "Saving…" : editingAddress ? "Update" : "Save address"}
                  </MagneticButton>
                  <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddress(null); }} className="min-h-11 rounded-full border border-black/10 bg-white px-5 py-2 text-xs font-bold transition hover:bg-[#F8F9FA]">
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}

