// app/dashboard/loading.tsx

const Loading = () => {
    return (
      <div className="p-6 min-h-screen min-w-5xl space-y-8 animate-pulse bg-white">
        {/* Dashboard header */}
        <div className="h-10 bg-gray-300 rounded w-1/4" />
  
        {/* Grid of placeholder cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="p-6 space-y-4 border rounded-lg shadow-sm bg-gray-100"
            >
              {/* Large image or chart placeholder */}
              <div className="h-32 bg-gray-200 rounded" />
              {/* Title */}
              <div className="h-5 bg-gray-200 rounded w-2/3" />
              {/* Paragraph lines */}
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Loading;
  