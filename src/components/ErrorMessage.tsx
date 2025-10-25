export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="py-6 text-center text-red-600 bg-red-100 rounded-md p-4">
    {message}
  </div>
);
