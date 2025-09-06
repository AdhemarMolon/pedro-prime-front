import { Skeleton } from '@/components/ui/skeleton';

export const CardSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-soft overflow-hidden border border-border">
      {/* Imagem skeleton */}
      <Skeleton className="w-full h-48" />
      
      {/* Conteúdo skeleton */}
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        
        {/* Características skeleton */}
        <div className="flex gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        {/* Botão skeleton */}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

export const GridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export const DetalheSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Galeria skeleton */}
      <div className="space-y-4">
        <Skeleton className="w-full h-96 rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="w-20 h-20 rounded-lg" />
          <Skeleton className="w-20 h-20 rounded-lg" />
          <Skeleton className="w-20 h-20 rounded-lg" />
        </div>
      </div>
      
      {/* Informações skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-48" />
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        
        {/* Características skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
        
        {/* CTA skeleton */}
        <Skeleton className="h-12 w-64" />
      </div>
    </div>
  );
};

export const FormularioSkeleton = () => {
  return (
    <div className="bg-card rounded-xl p-6 space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
};