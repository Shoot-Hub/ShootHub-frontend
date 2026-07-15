import { useState } from 'react';
import { Settings, Bell, Shield, Palette, LogOut, Calendar, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/store';
import { userService } from '@/services/user';
import { creatorService } from '@/services/creator';
import { useNavigate } from 'react-router-dom';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [availability, setAvailability] = useState(
    DAYS.map((day) => ({
      day,
      isAvailable: day !== 'sunday',
      startTime: '09:00',
      endTime: '18:00',
    }))
  );
  const [savingAvailability, setSavingAvailability] = useState(false);

  const handleLogout = async () => {
    await userService.logout();
    logout();
    navigate('/login');
  };

  const toggleDay = (index: number) => {
    setAvailability((prev) =>
      prev.map((d, i) => (i === index ? { ...d, isAvailable: !d.isAvailable } : d))
    );
  };

  const updateTime = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setAvailability((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  };

  const saveAvailability = async () => {
    setSavingAvailability(true);
    try {
      await creatorService.setAvailability(availability);
      toast.success('Availability updated successfully!');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to update availability';
      toast.error(msg);
    } finally {
      setSavingAvailability(false);
    }
  };

  const settingsSections = [
    { icon: Bell, title: 'Notifications', description: 'Email, SMS, and push notification preferences' },
    { icon: Shield, title: 'Privacy & Security', description: 'Password, KYC verification, and account security' },
    { icon: Palette, title: 'Appearance', description: 'Theme and display preferences' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-400 mt-0.5">Manage your account settings and availability.</p>
      </div>

      {/* Availability Section */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Weekly Availability</h3>
            <p className="text-xs text-slate-400">Set your working hours for client bookings</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {availability.map((slot, i) => (
            <div key={slot.day} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
              <button
                onClick={() => toggleDay(i)}
                className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all ${
                  slot.isAvailable
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-300 text-transparent'
                }`}
              >
                {slot.isAvailable && <Check className="h-3.5 w-3.5" />}
              </button>
              <span className="w-24 text-sm font-medium text-slate-700 capitalize">{slot.day}</span>
              {slot.isAvailable ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateTime(i, 'startTime', e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateTime(i, 'endTime', e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              ) : (
                <span className="text-sm text-slate-400 italic">Unavailable</span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={saveAvailability}
          disabled={savingAvailability}
          className="mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
        >
          {savingAvailability ? 'Saving...' : 'Save Availability'}
        </button>
      </div>

      {/* General Settings */}
      <div className="space-y-4">
        {settingsSections.map((section) => (
          <button
            key={section.title}
            className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <section.icon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800">{section.title}</h4>
              <p className="text-sm text-slate-400">{section.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800">Account</h3>
        <p className="text-sm text-slate-400 mt-0.5">Sign out of your account</p>
        <button
          onClick={handleLogout}
          className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}