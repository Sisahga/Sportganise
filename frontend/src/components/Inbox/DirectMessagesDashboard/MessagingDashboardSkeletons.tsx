export function MessageSkeleton() {
  return (
    <div className="px-4 relative max-w-screen-lg left-1/2 -translate-x-1/2">
      <div className="py-3 bg-white mt-4 rounded-lg shadow-lg border border-navbar mb-8">
        <div className="flex flex-col">
          <div>
            <h2 className="px-4 text-lg primary-colour font-bold">Messages</h2>
          </div>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center px-4 py-3 w-full">
              <div className="w-12 h-12 rounded-full animate-skeleton" />

              <div className="ml-4 flex justify-between flex-1 min-w-0">
                <div className="flex flex-col overflow-hidden w-3/4">
                  <div className="h-5 w-1/3 animate-skeleton rounded-sm mb-2" />
                  <div className="h-4 w-2/3 animate-skeleton rounded-sm" />
                </div>

                <div className="flex flex-col min-w-fit">
                  <div className="h-4 w-16 animate-skeleton rounded-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GroupSkeleton() {
  return (
    <div className="px-4 relative max-w-screen-lg left-1/2 -translate-x-1/2">
      <div className="px-4 py-3 bg-white mt-4 rounded-lg shadow-lg border border-navbar">
        <div className="flex flex-col">
          <div>
            <h2 className="text-lg primary-colour font-bold">Groups</h2>
          </div>
          <div className="flex justify-start mt-4 gap-2 overflow-x-scroll">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex flex-col items-center p-2 w-20">
                <div className="w-12 h-12 rounded-full animate-skeleton" />
                <div className="h-3 w-14 animate-skeleton rounded-sm mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
