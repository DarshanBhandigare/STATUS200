import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Save, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Modal } from '@/components/common/Modal';
import { ImageUpload } from '@/components/common/ImageUpload';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, deleteAccount } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        fullName,
        headline,
        avatarUrl,
      });
      success('Profile Updated', 'Your personal account profile has been saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { error } = await deleteAccount();
      if (error) {
        toastError('Failed to delete account', error.message);
      } else {
        success('Account Deleted', 'Your account and portfolios have been permanently removed.');
        navigate('/', { replace: true });
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Account & Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your developer profile and account preferences.
          </p>
        </div>

        {/* User Profile Form */}
        <Card className="p-6 border-slate-800">
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-semibold text-slate-100 font-display">
                Profile Information
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Default author information applied when creating new portfolios.
              </p>
            </div>

            <ImageUpload
              label="Profile Avatar"
              shape="circle"
              value={avatarUrl}
              onChange={(url) => setAvatarUrl(url)}
              helperText="Upload your profile avatar image."
            />

            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Email Address (Account ID)"
              value={user?.email || ''}
              disabled
              leftIcon={<Mail className="w-4 h-4" />}
              helperText="Account email cannot be modified from settings."
            />

            <Input
              label="Professional Headline / Tagline"
              placeholder="e.g. Computer Science Student & Full Stack Enthusiast"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Danger Zone: Delete Account */}
        <Card className="p-6 border-red-900/40 bg-red-950/10 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-red-400 font-display flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Danger Zone</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                Permanently delete your account, published portfolios, uploaded images, and personal data. This action cannot be undone.
              </p>
            </div>

            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete Account
            </Button>
          </div>
        </Card>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteConfirmation('');
          }}
          title="Delete Account Permanently"
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 space-y-1">
              <p className="font-bold">Warning: This action is permanent and irreversible.</p>
              <p>All your portfolios, project media, and personal details will be immediately wiped.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium">
                To confirm, type <span className="font-bold text-red-400">DELETE</span> below:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmation('');
                }}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="danger"
                isLoading={isDeleting}
                disabled={deleteConfirmation !== 'DELETE'}
                onClick={handleDeleteAccount}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

