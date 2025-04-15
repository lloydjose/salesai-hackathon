"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Session } from '@/lib/auth-types';
import { UserProfile } from '@/lib/data/user-profile';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface UserProfileCardProps {
  session: Session;
  userProfile: UserProfile;
}

const SALES_METHODOLOGIES = ['Challenger Sale', 'Conceptual Selling', 'Consultative Selling', 'Customer-Centric Selling', 'Inbound Selling', 'MEDDIC', 'NEAT Selling', 'SNAP Selling', 'Solution Selling', 'SPIN Selling', 'Sandler Selling System', 'Value Selling Framework', 'Gap Selling', 'Target Account Selling', 'Command of the Sale', 'SPICED Selling', 'CHAMP Selling', 'Miller Heiman Strategic Selling', 'RAIN Selling', 'The Challenger Customer', 'Baseline Selling', 'The Collaborative Sale', 'Provocative Selling', 'Customer-Focused Selling', 'Insight Selling', 'High-Pressure Selling', 'Relationship Selling', 'Social Selling', 'Transactional Selling', 'Partnership Selling', 'Other'] as const;
const SELLING_STYLES = ['Consultative', 'Transactional', 'Solution-Led', 'Relationship-Oriented', 'Aggressive', 'Collaborative', 'Provocative', 'Product-Oriented', 'Social Selling', 'Need-Oriented', 'Insight Selling', 'Challenger', 'Competition-Based', 'Other'] as const;

export default function UserProfileCard({ session, userProfile }: UserProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session.user.name ?? '');
  const [roleTitle, setRoleTitle] = useState(userProfile?.roleTitle ?? '');
  const [currentCompany, setCurrentCompany] = useState(userProfile?.currentCompany ?? '');
  const [yearsOfExperience, setYearsOfExperience] = useState(userProfile?.yearsOfExperience ?? 0);
  const [salesMethodology, setSalesMethodology] = useState<typeof SALES_METHODOLOGIES[number]>(
    userProfile?.salesMethodology ?? ''
  );
  const [customSalesMethodology, setCustomSalesMethodology] = useState('');
  const [sellingStyle, setSellingStyle] = useState<typeof SELLING_STYLES[number]>(
    userProfile?.sellingStyle ?? ''
  );
  const [customSellingStyle, setCustomSellingStyle] = useState('');
  const [targetICP, setTargetICP] = useState(userProfile?.targetICP ?? '');
  const [verticals, setVerticals] = useState(userProfile?.verticals ?? '');
  const [averageDealSize, setAverageDealSize] = useState(userProfile?.averageDealSize ?? 0);
  const [toolsUsed, setToolsUsed] = useState(userProfile?.toolsUsed ?? '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roleTitle,
          currentCompany,
          yearsOfExperience,
          salesMethodology: salesMethodology === 'Other' ? customSalesMethodology : salesMethodology,
          sellingStyle: sellingStyle === 'Other' ? customSellingStyle : sellingStyle,
          targetICP,
          verticals,
          averageDealSize,
          toolsUsed,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sales Profile</CardTitle>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Full Name</p>
              <p className="text-sm text-muted-foreground">{session.user.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Role</p>
              <p className="text-sm text-muted-foreground">{userProfile?.roleTitle} at {userProfile?.currentCompany}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Experience</p>
              <p className="text-sm text-muted-foreground">{userProfile?.yearsOfExperience} years</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Sales Methodology</p>
              <p className="text-sm text-muted-foreground">{userProfile?.salesMethodology}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Selling Style</p>
              <p className="text-sm text-muted-foreground">{userProfile?.sellingStyle}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Average Deal Size</p>
              <p className="text-sm text-muted-foreground">${userProfile?.averageDealSize.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Target ICP</p>
              <p className="text-sm text-muted-foreground">{userProfile?.targetICP}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Verticals</p>
              <p className="text-sm text-muted-foreground">{userProfile?.verticals}</p>
            </div>
          </div>
          {userProfile?.toolsUsed && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Tools Used</p>
              <p className="text-sm text-muted-foreground">{userProfile.toolsUsed}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Sales Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="roleTitle">Role Title</Label>
            <Input id="roleTitle" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="currentCompany">Current Company</Label>
            <Input id="currentCompany" value={currentCompany} onChange={(e) => setCurrentCompany(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="yearsOfExperience">Years of Experience</Label>
            <Input
              id="yearsOfExperience"
              type="number"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="salesMethodology">Sales Methodology</Label>
            <Select value={salesMethodology} onValueChange={(value: typeof SALES_METHODOLOGIES[number]) => setSalesMethodology(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select methodology" />
              </SelectTrigger>
              <SelectContent>
                {SALES_METHODOLOGIES.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {salesMethodology === 'Other' && (
              <Input
                placeholder="Enter your sales methodology"
                value={customSalesMethodology}
                onChange={(e) => setCustomSalesMethodology(e.target.value)}
              />
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sellingStyle">Selling Style</Label>
            <Select value={sellingStyle} onValueChange={(value: typeof SELLING_STYLES[number]) => setSellingStyle(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {SELLING_STYLES.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {sellingStyle === 'Other' && (
              <Input
                placeholder="Enter your selling style"
                value={customSellingStyle}
                onChange={(e) => setCustomSellingStyle(e.target.value)}
              />
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="targetICP">Target ICP</Label>
            <Input id="targetICP" value={targetICP} onChange={(e) => setTargetICP(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="verticals">Verticals</Label>
            <Input id="verticals" value={verticals} onChange={(e) => setVerticals(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="averageDealSize">Average Deal Size</Label>
            <Input
              id="averageDealSize"
              type="number"
              value={averageDealSize}
              onChange={(e) => setAverageDealSize(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="toolsUsed">Tools Used</Label>
            <Input id="toolsUsed" value={toolsUsed} onChange={(e) => setToolsUsed(e.target.value)} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
        <Button onClick={handleUpdateProfile} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
} 