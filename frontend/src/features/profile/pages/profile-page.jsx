import { useState } from 'react'
import { Key, Shield, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/app/providers/auth-provider'
import { authService } from '@/services/auth.service'
import { PageContainer, PageHeader } from '@/components/common'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

function getInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    try {
      setIsChangingPassword(true)
      await authService.changePassword(passwords.currentPassword, passwords.newPassword)
      toast.success('Password changed successfully')
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploadingAvatar(true)
      await authService.updateAvatar(file)
      await refreshUser()
      toast.success('Avatar updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update avatar')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const isGoogleUser = user?.avatar?.secure_url?.includes('googleusercontent') || user?.role === 'google'

  return (
    <PageContainer size="xl">
      <PageHeader
        title="Profile Settings"
        description="Manage your account profile details and security configurations."
      />

      <div className="grid gap-6 md:grid-cols-5">
        {/* Profile Card */}
        <Card className="md:col-span-2 h-fit shadow-elevation-md">
          <CardHeader className="flex flex-col items-center text-center pb-4 border-b border-border/40">
            <div className="relative">
              <Avatar className="size-20 border-2 border-primary/20 shadow-lg mb-3">
                <AvatarImage src={user?.avatar?.secure_url} alt={user?.name} />
                <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-md"
              >
                <Upload className="size-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                />
              </label>
            </div>
            <CardTitle className="text-h3 font-bold">{user?.name}</CardTitle>
            <CardDescription className="text-text-secondary mt-1">{user?.email}</CardDescription>
            <Badge className="mt-3 capitalize font-semibold bg-primary/10 text-primary border border-primary/20">
              {user?.role ?? 'User'} Account
            </Badge>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            <div className="space-y-1">
              <span className="text-caption text-text-secondary font-medium">Account Status</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="size-2 rounded-full bg-success animate-pulse" />
                <span className="text-small font-medium text-foreground">Active Professional Account</span>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-border/40">
              <span className="text-caption text-text-secondary font-medium">Platform Access</span>
              <div className="flex items-center gap-2 text-small text-text-body mt-1">
                <Shield className="size-4 text-primary" />
                <span>Standard User & Analysis Access</span>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-border/40">
              <span className="text-caption text-text-secondary font-medium">Account ID</span>
              <p className="text-caption font-mono text-text-secondary select-all truncate mt-1">
                usr_{user?.id || '000000000000'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card className="md:col-span-3 shadow-elevation-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-h3 font-bold">
              <Key className="size-5 text-primary" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Update your account password to maintain security.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isGoogleUser ? (
              <div className="text-sm text-text-secondary p-4 bg-muted/30 rounded-lg">
                Your account is linked to Google. Password management is handled through your Google account.
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handlePasswordChange}>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isChangingPassword || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}
                    className="w-full sm:w-auto"
                  >
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
