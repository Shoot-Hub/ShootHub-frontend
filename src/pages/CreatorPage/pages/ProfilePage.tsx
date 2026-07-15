import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, setAuth } from '@/store';
import {
  MapPin, Mail, Phone, Globe, Link as LinkIcon, Award, CheckCircle, XCircle,
  Camera, Save, Edit3, X, Plus, Loader2, Sparkles, Tag, Star, BookOpen, Languages,
  Shield, BadgeCheck, Clock, Palette, Package,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { creatorService } from '@/services/creator';

export function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    displayName: '',
    about: '',
    experienceYears: 0,
    specializations: '',
    skills: '',
    editingStyles: '',
    isNegotiable: false,
    willingToTravel: false,
    travelRadiusKm: 0,
    travelChargePerKm: 0,
  });

  useEffect(() => {
    if (user) {
      setForm({
        displayName: user.displayName || '',
        about: user.about || '',
        experienceYears: user.experienceYears || 0,
        specializations: (user.specializations || []).join(', '),
        skills: (user.skills || []).join(', '),
        editingStyles: (user.editingStyles || []).join(', '),
        isNegotiable: user.isNegotiable || false,
        willingToTravel: user.willingToTravel || false,
        travelRadiusKm: user.travelRadiusKm || 0,
        travelChargePerKm: user.travelChargePerKm || 0,
      });
    }
  }, [user]);

  const socialLinks = [
    { icon: Globe, label: 'Website', value: user?.socialLinks?.website },
    { icon: LinkIcon, label: 'Instagram', value: user?.socialLinks?.instagram },
    { icon: LinkIcon, label: 'Facebook', value: user?.socialLinks?.facebook },
    { icon: LinkIcon, label: 'YouTube', value: user?.socialLinks?.youtube },
    { icon: LinkIcon, label: 'Twitter', value: user?.socialLinks?.twitter },
    { icon: LinkIcon, label: 'LinkedIn', value: user?.socialLinks?.linkedin },
  ];

  const displayName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Creator';
  const initials = displayName.split(' ').map((n) => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  const userAvatar = user?.avatar?.url;
  const userCover = user?.coverPhoto?.url;

  const handleSave = async () => {
    setSaving(true);
    try {
      await creatorService.updateInfo({
        displayName: form.displayName || undefined,
        about: form.about || undefined,
        experienceYears: form.experienceYears,
        specializations: form.specializations.split(',').map((s) => s.trim()).filter(Boolean),
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        editingStyles: form.editingStyles.split(',').map((s) => s.trim()).filter(Boolean),
        isNegotiable: form.isNegotiable,
        willingToTravel: form.willingToTravel,
        travelRadiusKm: form.travelRadiusKm,
        travelChargePerKm: form.travelChargePerKm,
      });
      toast.success('Profile updated successfully! 🎉');
      setEditing(false);
      // Refresh profile
      const res = await creatorService.getMyProfile();
      if (res.data) setAuth(res.data as typeof user);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Cover & Avatar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700">
          {userCover && <img src={userCover} alt="" className="h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <button className="absolute right-5 top-5 flex items-center gap-2 rounded-xl bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-medium text-white hover:bg-white/30 transition-all border border-white/10">
            <Camera className="h-4 w-4" />
            Change Cover
          </button>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="absolute left-5 top-5 flex items-center gap-2 rounded-xl bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-medium text-white hover:bg-white/30 transition-all border border-white/10"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Avatar & Info */}
        <div className="relative px-6 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-16">
            <div className="relative">
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-4xl font-bold text-white shadow-xl">
                {userAvatar ? (
                  <img src={userAvatar} alt="" className="h-full w-full rounded-xl object-cover" />
                ) : (
                  initials
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-slate-100 text-blue-600 shadow-md hover:bg-blue-50 transition-all">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 pt-2 sm:pt-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">{displayName}</h2>
                {user?.isKycVerified && <BadgeCheck className="h-6 w-6 text-blue-600" />}
                {user?.isFeatured && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-0.5 text-xs font-semibold text-amber-600 border border-amber-100">
                    <Star className="h-3 w-3" /> Featured
                  </span>
                )}
              </div>
              {user?.displayName && <p className="text-sm text-slate-400">@{user.displayName}</p>}
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-400">
                {user?.location?.city && (
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {user.location.city}{user.location.state ? `, ${user.location.state}` : ''}</span>
                )}
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {user?.email}</span>
                {user?.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {user.phone}</span>}
                {user?.experienceYears ? <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5" /> {user.experienceYears} yrs exp</span> : null}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Mode Toggle */}
      {editing && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Edit Profile</h3>
                <p className="text-xs text-slate-400">Update your professional information</p>
              </div>
            </div>
            <button onClick={() => setEditing(false)} className="rounded-xl p-2 text-slate-400 hover:bg-white/50">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Name</label>
              <input type="text" value={form.displayName} onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
                placeholder="e.g. Epic Clicks" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Experience (years)</label>
              <input type="number" value={form.experienceYears} onChange={(e) => setForm((p) => ({ ...p, experienceYears: Number(e.target.value) }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">About</label>
              <textarea value={form.about} onChange={(e) => setForm((p) => ({ ...p, about: e.target.value }))}
                rows={3} placeholder="Tell clients about your photography style and experience..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Specializations</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {["wedding","pre_wedding","portrait","maternity","newborn","baby","birthday","corporate","product","fashion","food","real_estate","wildlife","nature","travel","sports","event","boudoir","fine_art","aerial_drone","videography","cinematography","other"].map((spec) => {
                  const selected = form.specializations.split(',').map(s => s.trim().toLowerCase()).includes(spec);
                  return (
                    <button key={spec} type="button" onClick={() => {
                      const current = form.specializations.split(',').map(s => s.trim()).filter(Boolean);
                      const idx = current.findIndex(s => s.toLowerCase() === spec);
                      if (idx >= 0) current.splice(idx, 1);
                      else current.push(spec);
                      setForm((p) => ({ ...p, specializations: current.join(', ') }));
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
                      selected ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                    }`}>
                      {spec.replace(/_/g, ' ')}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Skills (comma separated)</label>
              <input type="text" value={form.skills} onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
                placeholder="candid, portrait, aerial" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Editing Styles (comma separated)</label>
              <input type="text" value={form.editingStyles} onChange={(e) => setForm((p) => ({ ...p, editingStyles: e.target.value }))}
                placeholder="vintage, cinematic, natural" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Travel Radius (km)</label>
              <input type="number" value={form.travelRadiusKm} onChange={(e) => setForm((p) => ({ ...p, travelRadiusKm: Number(e.target.value) }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Travel Charge (per km)</label>
              <input type="number" value={form.travelChargePerKm} onChange={(e) => setForm((p) => ({ ...p, travelChargePerKm: Number(e.target.value) }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.isNegotiable} onChange={(e) => setForm((p) => ({ ...p, isNegotiable: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" />
                <span className="text-sm text-slate-700">Price Negotiable</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.willingToTravel} onChange={(e) => setForm((p) => ({ ...p, willingToTravel: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" />
                <span className="text-sm text-slate-700">Willing to Travel</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => setEditing(false)} className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* About */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">About</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              {user?.about || 'No description added yet. Tell clients about your photography style and experience.'}
            </p>
          </motion.div>

          {/* Specializations & Skills */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">Specializations & Skills</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {(user?.specializations?.length ?? 0) > 0 ? user?.specializations?.map((spec, i) => (
                    <span key={i} className="rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 text-xs font-medium text-blue-700 border border-blue-100 shadow-sm">
                      {spec}
                    </span>
                  )) : <span className="text-sm text-slate-400 italic">No specializations added</span>}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {(user?.skills?.length ?? 0) > 0 ? user?.skills?.map((skill, i) => (
                    <span key={i} className="rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1.5 text-xs font-medium text-indigo-700 border border-indigo-100 shadow-sm">
                      {skill}
                    </span>
                  )) : <span className="text-sm text-slate-400 italic">No skills added</span>}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Editing Styles</p>
                <div className="flex flex-wrap gap-2">
                  {(user?.editingStyles?.length ?? 0) > 0 ? user?.editingStyles?.map((style, i) => (
                    <span key={i} className="rounded-full bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 text-xs font-medium text-amber-700 border border-amber-100 shadow-sm">
                      {style}
                    </span>
                  )) : <span className="text-sm text-slate-400 italic">No editing styles added</span>}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Experience & Pricing */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">Experience & Pricing</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 border border-blue-100">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Experience</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{user?.experienceYears ?? 0}y</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4 border border-indigo-100">
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Starting</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{user?.currency || '₹'}{user?.startingPrice ?? 0}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 border border-amber-100">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Travel</p>
                <p className="text-lg font-bold text-slate-800 mt-1">{user?.willingToTravel ? `${user.travelRadiusKm || 0}km` : 'No'}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Negotiable</p>
                <p className="text-lg font-bold text-slate-800 mt-1">{user?.isNegotiable ? 'Yes' : 'Fixed'}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Verification */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">Verification</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Email', done: user?.isEmailVerified },
                { label: 'Phone', done: user?.isPhoneVerified },
                { label: 'KYC', done: user?.isKycVerified },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${item.done ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {item.done ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    {item.done ? 'Verified' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Languages */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Languages className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">Languages</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(user?.languages?.length ?? 0) > 0 ? user?.languages?.map((lang, i) => (
                <span key={i} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-100">{lang}</span>
              )) : <span className="text-sm text-slate-400 italic">No languages</span>}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">Social Links</h3>
            </div>
            <div className="space-y-2">
              {socialLinks.map((link) => (
                <div key={link.label} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-50 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                    <link.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-slate-500">{link.value || <span className="italic">Add {link.label}</span>}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Subscription */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl border border-slate-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">Subscription</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-800 capitalize">{user?.currentSubscription?.plan || 'Free'}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.currentSubscription?.status || 'Active'}</p>
              </div>
              <span className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
                {(user?.currentSubscription?.status === 'active') ? 'Active' : 'Inactive'}
              </span>
            </div>
            {(user?.currentSubscription?.features?.maxPortfolioImages ?? 0) > 0 && (
              <div className="mt-3 pt-3 border-t border-blue-100/50">
                <p className="text-xs text-slate-400">Up to {user?.currentSubscription?.features?.maxPortfolioImages} portfolio images</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Packages Section (from API) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">My Packages</h3>
            </div>
            <Link to="/creator/packages" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Manage →</Link>
          </div>
          {((user?.packages?.length ?? 0) > 0) ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {user?.packages?.map((pkg, i) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800">{String(pkg.name || `Package ${i + 1}`)}</p>
                    <span className="text-sm font-bold text-blue-600">{String(pkg.currency || 'INR')} {String(pkg.price || 0)}</span>
                  </div>
                  {pkg.description && <p className="mt-1 text-xs text-slate-400 line-clamp-2">{String(pkg.description)}</p>}
                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                    {pkg.durationHours ? <span>{String(pkg.durationHours)}h</span> : null}
                    {Array.isArray(pkg.deliverables) && (pkg.deliverables as unknown[]).length > 0 && (
                      <span>{(pkg.deliverables as unknown[]).length} deliverables</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <Package className="h-5 w-5 text-slate-300" />
              <p className="text-sm text-slate-400">No packages yet. <Link to="/creator/packages" className="text-blue-600 font-medium">Create one</Link></p>
            </div>
          )}
        </motion.div>

        {/* Availability Section (from API) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">Weekly Availability</h3>
            </div>
            <Link to="/creator/settings" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Edit →</Link>
          </div>
          {((user?.availability?.length ?? 0) > 0) ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {user?.availability?.map((slot, i) => (
                <div key={i} className={`rounded-xl p-3 text-center border ${
                  slot.isAvailable ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'
                }`}>
                  <p className="text-xs font-semibold text-slate-600 capitalize">{slot.day.slice(0, 3)}</p>
                  {slot.isAvailable ? (
                    <p className="text-[10px] text-emerald-600 mt-1 font-medium">{slot.startTime}–{slot.endTime}</p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1">Off</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <Clock className="h-5 w-5 text-slate-300" />
              <p className="text-sm text-slate-400">No availability set. <Link to="/creator/settings" className="text-blue-600 font-medium">Set your hours</Link></p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
