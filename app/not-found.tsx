import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#070a13] text-gray-100 font-sans p-6 text-center">
      <div className="space-y-4">
        <h1 className="text-6xl font-display font-black text-[#f27447]">404</h1>
        <h2 className="text-xl font-sans font-bold text-[#dfd3eb]">Page Not Found</h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved to another location.
        </p>
        <div className="pt-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f27447] hover:bg-[#d65f33] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
