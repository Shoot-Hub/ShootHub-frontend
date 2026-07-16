import { useState } from 'react';
import { Package, Plus, X, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { creatorService } from '@/services/creator';

type PackageForm = {
  name: string;
  description: string;
  price: number;
  currency: string;
  durationHours: number;
  deliverables: string;
};

export function PackagesPage() {
  const [packages, setPackages] = useState<Array<{ _id?: string; name?: string; description?: string; price?: number; currency?: string; durationHours?: number; deliverables?: string[] }>>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PackageForm>({
    name: '',
    description: '',
    price: 0,
    currency: 'INR',
    durationHours: 1,
    deliverables: '',
  });

  const handleSubmit = async () => {
    if (!form.name || !form.description || form.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      await creatorService.addPackage({
        name: form.name,
        description: form.description,
        price: form.price,
        currency: form.currency,
        durationHours: form.durationHours,
        deliverables: form.deliverables.split(',').map((d) => d.trim()).filter(Boolean),
      });
      toast.success('Package created successfully!');
      setShowForm(false);
      setForm({ name: '', description: '', price: 0, currency: 'INR', durationHours: 1, deliverables: '' });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to create package';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await creatorService.deletePackage(id);
      toast.success('Package deleted');
      setPackages((prev) => prev.filter((p) => p._id !== id));
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to delete package';
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Packages</h2>
          <p className="text-sm text-slate-400 mt-0.5">Create and manage your photography packages.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Add Package'}
        </button>
      </div>

      {/* Package Form */}
      {showForm && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-6 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">New Package</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Package Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Gold Wedding Package"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe what's included..."
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price *</label>
              <div className="flex gap-2">
                <select
                  value={form.currency}
                  onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                </select>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                  placeholder="15000"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration (hours)</label>
              <input
                type="number"
                value={form.durationHours}
                onChange={(e) => setForm((p) => ({ ...p, durationHours: Number(e.target.value) }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Deliverables (comma separated)</label>
              <input
                type="text"
                value={form.deliverables}
                onChange={(e) => setForm((p) => ({ ...p, deliverables: e.target.value }))}
                placeholder="Digital Album, Raw Photos, Highlight Video"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Creating...' : 'Create Package'}
          </button>
        </div>
      )}

      {/* Packages List */}
      {packages.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <div key={pkg._id || i} className="group relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <button
                  onClick={() => pkg._id && handleDelete(pkg._id)}
                  className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-red-400 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mt-3 font-semibold text-slate-800">{pkg.name}</h3>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">{pkg.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">
                  {pkg.currency || 'INR'} {pkg.price || 0}
                </span>
                <span className="text-xs text-slate-400">{pkg.durationHours}h</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 mb-4">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">No packages created</h3>
          <p className="mt-1 text-sm text-slate-400">Create photography packages for your clients.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Your First Package
          </button>
        </div>
      )}
    </div>
  );
}