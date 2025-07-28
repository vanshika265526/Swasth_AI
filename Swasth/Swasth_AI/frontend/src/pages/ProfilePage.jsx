import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import {
  Avatar, AvatarFallback, AvatarImage
} from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  User, Bell, PlusCircle, LogOut, Trash2, Save, Pencil
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', relation: '', allergies: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
        // Fetch user profile from backend
        const token = await currentUser.getIdToken();
        const res = await fetch('http://localhost:5000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const profile = await res.json();
          if (profile && profile.name) {
            localStorage.setItem('name', profile.name);
          }
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut();
    localStorage.clear();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    try {
      await auth.currentUser.delete();
      localStorage.clear();
      alert("Account deleted successfully.");
      navigate('/signup');
    } catch (err) {
      alert("Error deleting account: " + err.message);
    }
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.relation) {
      setFamilyMembers([
        ...familyMembers,
        {
          ...newMember,
          id: Date.now()
        }
      ]);
      setNewMember({ name: '', relation: '', allergies: '' });
      setShowAddForm(false);
    }
  };

  const handleDelete = (id) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== id));
  };

  const handleEditChange = (id, field, value) => {
    setFamilyMembers(prev =>
      prev.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const handleSave = () => {
    setEditId(null);
  };

  const userFullName = localStorage.getItem("tempUserName") || user?.displayName || 'User';

  return (
    <>
      <Helmet>
        <title>My Profile - SwasthAI</title>
        <meta name="description" content="Manage your SwasthAI profile, notification settings, and family member profiles." />
      </Helmet>

      <div className="main-container max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-6 mb-12">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
              <AvatarFallback>{userFullName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">Your Profile</h1>
              <p className="text-muted-foreground dark:text-gray-400">Manage your account and family profiles.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glassmorphism rounded-2xl bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black dark:text-white"><User /> Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-black dark:text-white">Full Name</Label>
                  <Input id="name" value={userFullName} readOnly className="dark:bg-gray-900 dark:text-white" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-black dark:text-white">Email Address</Label>
                  <Input id="email" value={user?.email || 'user@example.com'} readOnly className="dark:bg-gray-900 dark:text-white" />
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism rounded-2xl bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black dark:text-white"><Bell /> Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex-grow text-black dark:text-white">Medication Reminders</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="flex-grow text-black dark:text-white">Weekly Meal Plan Ready</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="flex-grow text-black dark:text-white">Product Updates</Label>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glassmorphism rounded-2xl mt-8 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black dark:text-white"><User /> Family Profiles</CardTitle>
              <CardDescription className="dark:text-gray-400">Manage health profiles for your family members.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {familyMembers.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No family members added yet.</p>
                )}

                {familyMembers.map((member) => (
                  <div key={member.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-background/50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-4 flex-1 w-full">
                      <Avatar>
                        <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col w-full space-y-2">
                        {editId === member.id ? (
                          <>
                            <Input value={member.name} onChange={(e) => handleEditChange(member.id, 'name', e.target.value)} placeholder="Full Name" />
                            <Input value={member.relation} onChange={(e) => handleEditChange(member.id, 'relation', e.target.value)} placeholder="Relation" />
                            <Input value={member.allergies} onChange={(e) => handleEditChange(member.id, 'allergies', e.target.value)} placeholder="Allergies" />
                          </>
                        ) : (
                          <>
                            <p className="font-semibold text-black dark:text-white">{member.name} ({member.relation})</p>
                            <p className="text-sm text-muted-foreground dark:text-gray-400">Allergies: {member.allergies || 'None'}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-2">
                      {editId === member.id ? (
                        <Button variant="outline" onClick={handleSave}><Save className="h-4 w-4 mr-1" /> Save</Button>
                      ) : (
                        <Button variant="outline" onClick={() => setEditId(member.id)}><Pencil className="h-4 w-4 mr-1" /> Edit</Button>
                      )}
                      <Button variant="destructive" onClick={() => handleDelete(member.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>

              {showAddForm && (
                <div className="mt-6 space-y-4">
                  <Input placeholder="Full Name" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} />
                  <Input placeholder="Relation (e.g., Father, Daughter)" value={newMember.relation} onChange={e => setNewMember({ ...newMember, relation: e.target.value })} />
                  <Input placeholder="Allergies (optional)" value={newMember.allergies} onChange={e => setNewMember({ ...newMember, allergies: e.target.value })} />
                  <Button onClick={handleAddMember}>Save Member</Button>
                </div>
              )}

              <Button variant="outline" className="mt-6 w-full" onClick={() => setShowAddForm(!showAddForm)}>
                <PlusCircle className="mr-2 h-4 w-4" /> {showAddForm ? "Cancel" : "Add Family Member"}
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-between">
            <Button onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProfilePage;