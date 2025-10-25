export const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-6">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
    <span className="ml-2 text-gray-600">Loading categories...</span>
  </div>
);

