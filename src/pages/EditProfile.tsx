import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Camera, 
  Save, 
  MapPin,
  Globe,
  User,
  Briefcase
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { showNotification } from "@/components/ui/custom-notification";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUserStore();
  
  const [formData, setFormData] = useState({
    name: user.name,
    role: user.role,
    location: user.location,
    website: user.website,
    avatar: user.avatar,
    cover: user.cover,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUser(formData);
      setIsSubmitting(false);

      // Show success notification
      showNotification(
        "Profile Updated",
        "Your changes have been saved successfully.",
        "success",
        3000
      );

      // Navigate back after toast
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    }, 800);
  };

  const handleImageUpload = (type: 'avatar' | 'cover') => {
    // Mock image upload
    const mockImages = {
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
      cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1200&q=80"
    };
    
    setFormData(prev => ({ ...prev, [type]: mockImages[type] }));
  };

  return (
    <div className="min-h-screen bg-background pb-32">
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
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-orange-600 disabled:opacity-50 active:scale-95"
          >
            {isSubmitting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : <Save className="h-4 w-4" />}
            Save
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-8">
          
          {/* Cover & Avatar Upload */}
          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Profile Media</label>
            
            <div className="relative">
              {/* Cover */}
              <div className="group relative h-40 overflow-hidden rounded-2xl border border-border bg-secondary">
                <img src={formData.cover} alt="Cover" className="h-full w-full object-cover" />
                <button 
                  type="button"
                  onClick={() => handleImageUpload('cover')}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
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
                  <img src={formData.avatar} alt="Avatar" className="h-full w-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => handleImageUpload('avatar')}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
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
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name
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

              {/* Role */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  Role / Title
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="e.g. Music Producer, DJ"
                  required
                />
              </div>
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

            {/* Account Info (Static/Non-editable for now) */}
            <div className="mt-8 rounded-2xl border border-border bg-secondary/30 p-6">
              <h3 className="mb-2 text-sm font-bold text-foreground">Account Information</h3>
              <p className="text-xs text-muted-foreground">
                These details were set when you joined and are used for billing and administrative purposes.
              </p>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="font-medium text-foreground">{user.joinedDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Beat Count</span>
                  <span className="font-medium text-foreground">{user.stats.beats}</span>
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
