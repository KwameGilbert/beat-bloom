import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Camera, 
  Save, 
  MapPin,
  Globe,
  User,
  Briefcase,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { showNotification } from "@/components/ui/custom-notification";
import type { UpdateProfileData } from "@/lib/auth";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, isLoading, error, clearError } = useAuthStore();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<UpdateProfileData>({
    name: "",
    location: "",
    website: "",
    bio: "",
    avatar: "",
    coverImage: "",
  });

  const [previews, setPreviews] = useState<{ avatar: string | null; cover: string | null }>({
    avatar: null,
    cover: null
  });

  const [files, setFiles] = useState<{ avatar: File | null; cover: File | null }>({
    avatar: null,
    cover: null
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        location: user.location || "",
        website: user.website || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
        coverImage: user.coverImage || "",
      });
      setPreviews({
        avatar: user.avatar || null,
        cover: user.coverImage || null
      });
    }
  }, [user]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification("Invalid File", "Please upload an image file.", "error");
      return;
    }

    // Validate size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification("File Too Large", "Maximum image size is 5MB.", "error");
      return;
    }

    // Create local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
    };
    reader.readAsDataURL(file);

    // Save file for submission
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate required fields
    if (!formData.name?.trim()) {
      setFormError("Name is required");
      return;
    }

    try {
      // Create FormData to send both text and files
      const data = new FormData();
      data.append('name', formData.name || '');
      data.append('location', formData.location || '');
      data.append('website', formData.website || '');
      data.append('bio', formData.bio || '');
      
      if (files.avatar) {
        data.append('avatar', files.avatar);
      }
      if (files.cover) {
        data.append('coverImage', files.cover);
      }

      await updateProfile(data as any);

      // Show success notification
      showNotification(
        "Profile Updated",
        "Your changes have been saved successfully.",
        "success",
        3000
      );

      // Navigate back after short delay
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update profile. Please try again.";
      setFormError(errorMessage);
      showNotification(
        "Update Failed",
        errorMessage,
        "error",
        5000
      );
    }
  };

  const triggerUpload = (type: 'avatar' | 'cover') => {
    if (type === 'avatar') {
      avatarInputRef.current?.click();
    } else {
      coverInputRef.current?.click();
    }
  };

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to edit your profile</p>
          <button 
            onClick={() => navigate("/login")}
            className="mt-4 rounded-full bg-orange-500 px-6 py-2 font-bold text-white"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={avatarInputRef} 
        onChange={(e) => handleFileChange(e, 'avatar')}
        accept="image/*"
        className="hidden"
      />
      <input 
        type="file" 
        ref={coverInputRef} 
        onChange={(e) => handleFileChange(e, 'cover')}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/profile")}
              className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Edit Profile</h1>
          </div>
          <button 
            form="edit-profile-form"
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-orange-600 disabled:opacity-50 active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : <Save className="h-4 w-4" />}
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Error Alert */}
        {(formError || error) && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-500">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{formError || error}</p>
          </div>
        )}

        <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-8">
          
          {/* Cover & Avatar Upload */}
          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Profile Media</label>
            
            <div className="relative">
              {/* Cover */}
              <div className="group relative h-40 overflow-hidden rounded-2xl border border-border bg-secondary">
                {previews.cover ? (
                  <img src={previews.cover} alt="Cover" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-orange-500/20 to-purple-500/20" />
                )}
                <button 
                  type="button"
                  onClick={() => triggerUpload('cover')}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                >
                  <div className="flex flex-col items-center gap-2 text-white">
                    <Camera className="h-6 w-6" />
                    <span className="text-xs font-bold">Change Cover</span>
                  </div>
                </button>
              </div>

              {/* Avatar */}
              <div className="absolute -bottom-6 left-6">
                <div className="group relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-background bg-secondary shadow-xl">
                  {previews.avatar ? (
                    <img src={previews.avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500 to-pink-500">
                      <User className="h-10 w-10 text-white" />
                    </div>
                  )}
                  <button 
                    type="button"
                    onClick={() => triggerUpload('avatar')}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
            <div className="h-6" /> {/* Spacer for absolute avatar */}
          </div>

          {/* Form Fields */}
          <div className="space-y-6 pt-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                placeholder="Your display name"
                required
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                placeholder="City, Country"
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Globe className="h-4 w-4 text-muted-foreground" />
                Website URL
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-sm text-muted-foreground">https://</span>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card py-3 pl-[4.5rem] pr-4 text-foreground focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="example.com"
                />
              </div>
            </div>

            {/* Account Info (Static/Non-editable) */}
            <div className="mt-8 rounded-2xl border border-border bg-secondary/30 p-6">
              <h3 className="mb-2 text-sm font-bold text-foreground">Account Information</h3>
              <p className="text-xs text-muted-foreground">
                These details are linked to your account and cannot be changed here.
              </p>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-foreground">{user.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-medium text-foreground capitalize">{user.role}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="font-medium text-foreground">
                    {new Date(user.createdAt).toLocaleDateString("en-US", { 
                      month: "long", 
                      year: "numeric" 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
