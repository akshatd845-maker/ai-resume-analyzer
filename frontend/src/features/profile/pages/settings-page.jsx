import { Bell, Link2, Settings } from 'lucide-react'

import { PageContainer, PageHeader } from '@/components/common'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function SettingsPage() {
  return (
    <PageContainer size="xl">
      <PageHeader
        title="Settings"
        description="Configure your workspace preferences, email digests, and external connections."
      />

      <Alert className="mb-6">
        <AlertDescription>
          Settings are not yet persisted to the server. Preferences shown below are placeholders
          for a future release.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-elevation-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-h3 font-bold">
                <Settings className="size-5 text-primary" />
                Workspace Preferences
              </CardTitle>
              <CardDescription>Coming soon — default sort, view mode, and filters.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled>Save Preferences (coming soon)</Button>
            </CardContent>
          </Card>

          <Card className="shadow-elevation-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-h3 font-bold">
                <Link2 className="size-5 text-primary" />
                Integrations
              </CardTitle>
              <CardDescription>Coming soon — LinkedIn and GitHub connections.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled>Connect integrations (coming soon)</Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full shadow-elevation-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-h3 font-bold">
                <Bell className="size-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>Coming soon — email and in-app notification preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-caption text-text-secondary">
                Notification settings will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
