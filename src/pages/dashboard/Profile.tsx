import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Camera,
  Mail,
  MapPin,
  Globe,
  Phone,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/lib/profile";
import PageLoading  from '../../components/dashboard/PageLoading';


// 1. Improved Schema (Handles empty strings/nulls from API)
const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  avatar: z.any().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  bio: z.string().max(200, "Bio max 200 chars").optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // 2. Fetch Data
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: profileApi.getProfile,
  });

  // 3. Mutation to Save
  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (data: ProfileFormValues) => profileApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Profile updated successfully!");
    },
    onError: () => toast.error("Failed to update profile"),
  });

  // 4. Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // 5. Sync Form with API data when it loads
  useEffect(() => {
    if (user) reset(user);
  }, [user, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show a local preview immediately
      setPreviewUrl(URL.createObjectURL(file));
    }
  };


  const onSubmit = (data: ProfileFormValues) => {
  const formData = new FormData();
  
  // 1. Append text fields (excluding the avatar string from the 'data' object)
  Object.entries(data).forEach(([key, value]) => {
    // We skip 'avatar' here because 'data.avatar' is just a string URL
    if (key !== "avatar" && value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  // 2. ONLY append avatar if a new file was actually picked
  const imageFile = fileInputRef.current?.files?.[0];
  if (imageFile) {
    formData.append("avatar", imageFile);
  }

  // 3. Send to your API
  updateProfile(formData);
};

  // 3. Early Returns
  if (isLoading) return <PageLoading />;
  if (error) return <div className="flex items-center justify-center h-full"><p className="text-destructive">Error loading Profile</p></div>;

  const initials = (
    (user?.first_name?.[0] || "") + (user?.last_name?.[0] || "")
  ).toUpperCase();

  // Handle avatar URL (if it's a relative path, prepend API base URL)
  const avatarSrc = user?.avatar 
  ? (user.avatar.startsWith('http') 
      ? user.avatar 
      : `${import.meta.env.VITE_API_BASE_URL}${user.avatar}`)
  : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your public profile and personal information.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col items-center text-center">
            <div className="relative group">
      <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden bg-orange-100 flex items-center justify-center">
  {previewUrl || user?.avatar ? (
    <img
      src={previewUrl || user?.avatar}
      alt="Profile"
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="text-4xl font-bold text-orange-600">
      {initials}
    </span>
  )}
</div>
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
      
      {/* Trigger Button */}
      <button 
        type="button" // Important: set to type button so it doesn't submit the form
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 right-0 p-2 bg-white border border-border rounded-full shadow-lg hover:bg-muted transition-colors"
      >
        <Camera className="w-4 h-4 text-orange-600" />
      </button>
    </div>
            <h2 className="mt-4 text-xl font-semibold">{user?.full_name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>

          <div className="bg-white dark:bg-card border border-border p-4 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>
                Joined {new Date(user?.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Globe className="w-4 h-4 text-orange-600" />
              <span>{user?.timezone} Timezone</span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Forms */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-2 space-y-6"
        >
          <section className="bg-white dark:bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-semibold">Personal Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input {...register("first_name")} />
                {errors.first_name && <p className="text-xs text-red-500">{errors.first_name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input {...register("last_name")} />
                {errors.last_name && <p className="text-xs text-red-500">{errors.last_name.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("email")}
                    className="pl-10"
                    readOnly
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  {...register("bio")}
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                />
                {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-semibold">Contact & Location</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input {...register("phone_number")} className="pl-10" />
                  {errors.phone_number && <p className="text-xs text-red-500">{errors.phone_number.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input {...register("location")} className="pl-10" />
                  {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Website</label>
                <Input {...register("website")} type="url" />
                {errors.website && <p className="text-xs text-red-500">{errors.website.message}</p>}
              </div>
            </div>
          </section>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
