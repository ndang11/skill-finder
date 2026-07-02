#!/bin/bash
set -e
BASE="/home/ndang-royalty/Desktop/skill-finder/skill-finder"
cd "$BASE"

# Helper: create a file with placeholder content if it doesn't exist
mkfile() {
  local path="$1"
  local content="$2"
  mkdir -p "$(dirname "$path")"
  if [ ! -f "$path" ]; then
    echo "$content" > "$path"
  fi
}

# ─── APP ROUTES ─────────────────────────────────────────────────────────────

# (auth) group
mkfile "app/(auth)/layout.tsx" 'export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen flex items-center justify-center">{children}</main>;
}'
mkfile "app/(auth)/login/page.tsx" 'export default function LoginPage() { return <div>Login</div>; }'
mkfile "app/(auth)/register/page.tsx" 'export default function RegisterPage() { return <div>Register</div>; }'
mkfile "app/(auth)/forgot-password/page.tsx" 'export default function ForgotPasswordPage() { return <div>Forgot Password</div>; }'

# (main) group
mkfile "app/(main)/layout.tsx" 'export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}'
mkfile "app/(main)/page.tsx" 'export default function HomePage() { return <div>Home</div>; }'
mkfile "app/(main)/search/page.tsx" 'export default function SearchPage() { return <div>Search</div>; }'
mkfile "app/(main)/categories/page.tsx" 'export default function CategoriesPage() { return <div>Categories</div>; }'
mkfile "app/(main)/categories/[slug]/page.tsx" 'export default function CategoryPage({ params }: { params: { slug: string } }) { return <div>Category: {params.slug}</div>; }'
mkfile "app/(main)/professionals/page.tsx" 'export default function ProfessionalsPage() { return <div>Professionals</div>; }'
mkfile "app/(main)/professionals/[id]/page.tsx" 'export default function ProfessionalProfilePage({ params }: { params: { id: string } }) { return <div>Professional: {params.id}</div>; }'
mkfile "app/(main)/feed/page.tsx" 'export default function FeedPage() { return <div>Feed</div>; }'

# (dashboard) group
mkfile "app/(dashboard)/layout.tsx" 'export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex">{children}</div>;
}'
# customer
mkfile "app/(dashboard)/customer/page.tsx" 'export default function CustomerDashboardPage() { return <div>Customer Dashboard</div>; }'
mkfile "app/(dashboard)/customer/bookmarks/page.tsx" 'export default function BookmarksPage() { return <div>Bookmarks</div>; }'
mkfile "app/(dashboard)/customer/reviews/page.tsx" 'export default function CustomerReviewsPage() { return <div>My Reviews</div>; }'
mkfile "app/(dashboard)/customer/settings/page.tsx" 'export default function CustomerSettingsPage() { return <div>Settings</div>; }'
# professional
mkfile "app/(dashboard)/professional/page.tsx" 'export default function ProfessionalDashboardPage() { return <div>Professional Dashboard</div>; }'
mkfile "app/(dashboard)/professional/profile/page.tsx" 'export default function EditProfilePage() { return <div>Edit Profile</div>; }'
mkfile "app/(dashboard)/professional/portfolio/page.tsx" 'export default function PortfolioPage() { return <div>Portfolio</div>; }'
mkfile "app/(dashboard)/professional/posts/page.tsx" 'export default function PostsPage() { return <div>My Posts</div>; }'
mkfile "app/(dashboard)/professional/posts/new/page.tsx" 'export default function NewPostPage() { return <div>New Post</div>; }'
mkfile "app/(dashboard)/professional/reviews/page.tsx" 'export default function ProfessionalReviewsPage() { return <div>Reviews Received</div>; }'
mkfile "app/(dashboard)/professional/settings/page.tsx" 'export default function ProfessionalSettingsPage() { return <div>Settings</div>; }'
# admin
mkfile "app/(dashboard)/admin/page.tsx" 'export default function AdminDashboardPage() { return <div>Admin Dashboard</div>; }'
mkfile "app/(dashboard)/admin/users/page.tsx" 'export default function AdminUsersPage() { return <div>Users</div>; }'
mkfile "app/(dashboard)/admin/professionals/page.tsx" 'export default function AdminProfessionalsPage() { return <div>Professionals</div>; }'
mkfile "app/(dashboard)/admin/verifications/page.tsx" 'export default function VerificationsPage() { return <div>Verifications</div>; }'
mkfile "app/(dashboard)/admin/categories/page.tsx" 'export default function AdminCategoriesPage() { return <div>Categories</div>; }'
mkfile "app/(dashboard)/admin/posts/page.tsx" 'export default function AdminPostsPage() { return <div>Posts</div>; }'
mkfile "app/(dashboard)/admin/analytics/page.tsx" 'export default function AnalyticsPage() { return <div>Analytics</div>; }'

# ─── COMPONENTS ─────────────────────────────────────────────────────────────

# ui
for f in Button Input Textarea Select Badge Avatar Card Modal Spinner Skeleton Toast StarRating; do
  mkfile "components/ui/${f}.tsx" "export default function ${f}() { return null; }"
done

# layout
for f in Header Footer Sidebar MobileNav DashboardLayout; do
  mkfile "components/layout/${f}.tsx" "export default function ${f}() { return null; }"
done

# home
for f in Hero HowItWorks CategoryGrid FeaturedProfessionals Testimonials CallToAction; do
  mkfile "components/home/${f}.tsx" "export default function ${f}() { return null; }"
done

# professional
for f in ProfessionalCard ProfessionalList ProfessionalProfile VerificationBadge WhatsAppButton RatingStars ServicesList PortfolioGrid AvailabilityBadge; do
  mkfile "components/professional/${f}.tsx" "export default function ${f}() { return null; }"
done

# review
for f in ReviewCard ReviewList ReviewForm; do
  mkfile "components/review/${f}.tsx" "export default function ${f}() { return null; }"
done

# feed
for f in PostCard PostList PostActions CommentSection CommentItem CreatePostForm; do
  mkfile "components/feed/${f}.tsx" "export default function ${f}() { return null; }"
done

# search
for f in SearchBar FilterPanel SearchResults EmptyState; do
  mkfile "components/search/${f}.tsx" "export default function ${f}() { return null; }"
done

# auth
for f in LoginForm RegisterForm OtpInput; do
  mkfile "components/auth/${f}.tsx" "export default function ${f}() { return null; }"
done

# ─── HOOKS ──────────────────────────────────────────────────────────────────
for f in useAuth useProfessionals useSearch useReviews usePosts useBookmarks useWhatsApp useDebounce; do
  mkfile "hooks/${f}.ts" "// ${f} hook"
done

# ─── SERVICES ───────────────────────────────────────────────────────────────
mkfile "services/api.ts" "// Base API client"
for f in auth professional category review post upload; do
  mkfile "services/${f}.service.ts" "// ${f} service"
done

# ─── STORE ──────────────────────────────────────────────────────────────────
for f in authStore searchStore bookmarkStore; do
  mkfile "store/${f}.ts" "// ${f}"
done

# ─── TYPES ──────────────────────────────────────────────────────────────────
for f in user professional category review post api; do
  mkfile "types/${f}.types.ts" "// ${f} types"
done

# ─── CONSTANTS ──────────────────────────────────────────────────────────────
mkfile "constants/categories.ts" "// Skill Finder categories"
mkfile "constants/regions.ts" "// Cameroon regions and cities"
mkfile "constants/whatsapp.ts" "// WhatsApp message templates"

# ─── UTILS ──────────────────────────────────────────────────────────────────
mkfile "utils/format.ts" "// Date, phone, number formatters"
mkfile "utils/whatsapp.ts" "// WhatsApp URL builder"
mkfile "utils/cn.ts" '// Tailwind class name merge helper
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}'

echo "✅ Scaffold complete!"
