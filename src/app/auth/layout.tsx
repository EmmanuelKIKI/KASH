import { KashLogoSVG } from '@/components/ui/KashLogoSVG';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] via-white to-[#E6F7F1] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="mb-8">
          <KashLogoSVG width={180} height={60} />
        </div>
        <div className="w-full max-w-md">
          {children}
        </div>
        <p className="mt-8 text-xs text-gray-400 text-center">
          Développé par Emmanuel KIKI &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
