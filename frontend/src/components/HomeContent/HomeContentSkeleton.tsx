const HomeContentSkeleton = () => {
  return (
    <div className="bg-primaryColour full mt-32 z-40">
      <div
        className="flex-1 max-w-[100vw] bg-white shadow-md rounded-t-2xl pb-16 bg-gradient-to-b
                      from-secondaryColour/20 to-white to-[20%]"
      >
        <div className="min-h-screen">
          <div className="py-4 px-8 lg:px-4 flex flex-col gap-8">
            <div className="lg:mx-24 mt-6 flex flex-col gap-6 sm:gap-8">
              <div className="mt-8 flex justify-between items-center">
                <div className="h-8 w-64 rounded-md animate-skeleton"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 p-4 rounded-lg border border-gray-200 shadow-sm"
                  >
                    <div className="h-10 w-10 rounded-full animate-skeleton mb-2"></div>
                    <div className="h-6 w-3/4 rounded-md animate-skeleton"></div>
                    <div className="h-4 w-full rounded-md animate-skeleton"></div>
                    <div className="h-4 w-5/6 rounded-md animate-skeleton"></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "0 !important" }}>
              <div className="flex flex-col gap-4">
                <div className="h-8 w-48 rounded-md animate-skeleton mb-2"></div>
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="h-16 w-16 rounded-md animate-skeleton"></div>
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="h-6 w-3/4 rounded-md animate-skeleton"></div>
                      <div className="h-4 w-1/2 rounded-md animate-skeleton"></div>
                    </div>
                    <div className="h-10 w-24 rounded-md animate-skeleton"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="h-10 w-36 rounded-md animate-skeleton"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContentSkeleton;
