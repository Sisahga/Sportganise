export default function UserSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-4 bg-placeholder-colour rounded-md"
        >
          <div className="h-10 w-10 rounded-full animate-skeleton" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-1/3 animate-skeleton rounded-sm" />
            <div className="h-3 w-1/4 animate-skeleton rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}
