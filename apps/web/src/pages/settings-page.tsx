import { useState, useEffect } from "react"
import { User, Bell, Palette, Shield, Database } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { toast } from "@/components/toaster"
import { useTheme } from "@/hooks/useTheme"
import { supabase } from "@/lib/supabase"

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user?.email) setUserEmail(data.user.email)
      })
    }
  }, [])

  const handleSaveProfile = () => {
    toast({ title: "Profile settings saved", type: "success" })
  }

  const handleThemeChange = (newTheme: string) => {
    toggleTheme()
    toast({ title: `Theme changed to ${newTheme}`, type: "success" })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Profile</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your account details
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={userEmail}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value="Admin"
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name</Label>
                <Input
                  id="shopName"
                  placeholder="My Retail Shop"
                  defaultValue="My Retail Shop"
                />
              </div>
              <Button onClick={handleSaveProfile}>Save Profile</Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                <Bell className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  Configure alert preferences
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Low Stock Alerts
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when products are low
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 accent-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Expiry Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified before products expire
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 accent-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Sales Notifications
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Get notified of new sales orders
                  </p>
                </div>
                <input type="checkbox" className="h-5 w-5 accent-primary" />
              </div>
              <Button
                onClick={() =>
                  toast({
                    title: "Notification preferences saved",
                    type: "success",
                  })
                }
              >
                Save Preferences
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">
                  Data Management
                </h2>
                <p className="text-sm text-muted-foreground">
                  Export and manage your data
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" className="gap-2">
                  Export Products (CSV)
                </Button>
                <Button variant="outline" className="gap-2">
                  Export Sales (CSV)
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Your data is automatically backed up to Supabase cloud database.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Palette className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Appearance</h2>
                <p className="text-sm text-muted-foreground">
                  Customize the look
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Security</h2>
                <p className="text-sm text-muted-foreground">
                  Keep your account safe
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start gap-2">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                Enable Two-Factor Auth
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
            <h2 className="mb-2 font-semibold text-destructive">Danger Zone</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Irreversible and destructive actions
            </p>
            <Button variant="destructive" className="w-full">
              Delete All Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
