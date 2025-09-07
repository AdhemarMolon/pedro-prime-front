import { Skeleton } from './ui/skeleton';

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* Imagem skeleton com gradiente */}
      <div className="relative">
        <Skeleton className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        <div className="absolute top-3 right-3">
          <Skeleton className="w-8 h-8 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Conteúdo skeleton */}
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg" />
          <Skeleton className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-md" />
          <Skeleton className="h-4 w-2/3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-md" />
        </div>

        {/* Preço skeleton */}
        <div className="py-2">
          <Skeleton className="h-8 w-32 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 animate-pulse rounded-lg" />
        </div>

        {/* Características skeleton */}
        <div className="flex gap-4 py-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
            <Skeleton className="h-4 w-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
            <Skeleton className="h-4 w-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
            <Skeleton className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
          </div>
        </div>

        {/* Botão skeleton */}
        <Skeleton className="h-12 w-full bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 animate-pulse rounded-xl" />
      </div>
    </div>
  );
};

export const GridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg" />
              <Skeleton className="h-10 w-28 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Price */}
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg" />
              <Skeleton className="h-6 w-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-md" />
              <Skeleton className="h-12 w-56 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 animate-pulse rounded-lg" />
            </div>

            {/* Features Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <Skeleton className="h-6 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                    <Skeleton className="h-8 w-8 mx-auto mb-3 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 animate-pulse rounded-full" />
                    <Skeleton className="h-6 w-12 mx-auto mb-2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
                    <Skeleton className="h-4 w-16 mx-auto bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <Skeleton className="h-6 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
                <Skeleton className="h-4 w-5/6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
                <Skeleton className="h-4 w-4/6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
                <Skeleton className="h-4 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
              </div>
            </div>

            {/* Gallery Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <Skeleton className="h-6 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg mb-4" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-xl" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <Skeleton className="h-6 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg mb-6" />
              <div className="text-center space-y-4">
                <Skeleton className="h-12 w-48 mx-auto bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 animate-pulse rounded-lg" />
                <Skeleton className="h-4 w-24 mx-auto bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
              </div>
              <div className="space-y-3 mt-6">
                <Skeleton className="h-12 w-full bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 animate-pulse rounded-xl" />
                <Skeleton className="h-12 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-xl" />
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <Skeleton className="h-6 w-40 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg mb-4" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
                    <Skeleton className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FormSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 lg:p-8 shadow-xl border border-blue-100">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-10 w-10 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 animate-pulse rounded-full" />
        <div>
          <Skeleton className="h-6 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg mb-2" />
          <Skeleton className="h-4 w-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
        </div>
      </div>

      <div className="space-y-5">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <Skeleton className="h-12 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-xl" />
          </div>
        ))}
        <Skeleton className="h-12 w-full bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 animate-pulse rounded-xl" />
      </div>

      <div className="mt-6">
        <Skeleton className="h-20 w-full bg-gradient-to-r from-blue-100 via-indigo-50 to-blue-100 animate-pulse rounded-xl" />
      </div>
    </div>
  );
};

// List view skeleton
export const ListSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="w-full md:w-64 h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-xl" />
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg" />
                <Skeleton className="h-4 w-1/2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
              </div>
              <Skeleton className="h-8 w-32 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 animate-pulse rounded-lg" />
              <div className="flex gap-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
                    <Skeleton className="h-4 w-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-32 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};