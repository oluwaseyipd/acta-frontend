import { motion } from 'framer-motion';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeGallery } from '@/components/settings/ThemeGallery';
import { toast } from 'sonner';


export default function Settings() {
 const [profileForm, setProfileForm] = useState({
   name: 'Acta User',
   email: 'user@acta.app',
 });


 const handleSaveProfile = () => {
   toast.success('Profile updated successfully!');
 };


 return (
   <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     className="space-y-6 max-w-4xl"
   >
     <div>
       <h1 className="text-3xl font-bold">Settings</h1>
       <p className="text-muted-foreground">Manage your account and preferences</p>
     </div>


     <Tabs defaultValue="profile" className="space-y-6">
       <TabsList className="glass">
         <TabsTrigger value="profile">Profile</TabsTrigger>
         <TabsTrigger value="appearance">Appearance</TabsTrigger>
         <TabsTrigger value="notifications">Notifications</TabsTrigger>
       </TabsList>


       <TabsContent value="profile">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-card p-6 space-y-6"
         >
           <div className="flex items-center gap-6">
             <Avatar className="h-20 w-20 border-4 border-primary/20">
               <AvatarImage src="/placeholder.svg" />
               <AvatarFallback className="text-2xl bg-primary text-primary-foreground">AC</AvatarFallback>
             </Avatar>
             <div>
               <h3 className="font-semibold text-lg">{profileForm.name}</h3>
               <p className="text-muted-foreground">{profileForm.email}</p>
               <Button variant="outline" size="sm" className="mt-2">
                 Change Avatar
               </Button>
             </div>
           </div>


           <div className="grid gap-4">
             <div className="space-y-2">
               <Label htmlFor="name">Display Name</Label>
               <Input
                 id="name"
                 value={profileForm.name}
                 onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="email">Email</Label>
               <Input
                 id="email"
                 type="email"
                 value={profileForm.email}
                 onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
               />
             </div>
           </div>


           <Button onClick={handleSaveProfile}>Save Changes</Button>
         </motion.div>
       </TabsContent>


       <TabsContent value="appearance">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-card p-6"
         >
           <ThemeGallery />
         </motion.div>
       </TabsContent>


       <TabsContent value="notifications">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-card p-6"
         >
           <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
           <p className="text-muted-foreground">
             Notification settings will be available once connected to the backend.
           </p>
         </motion.div>
       </TabsContent>
     </Tabs>
   </motion.div>
 );
}
