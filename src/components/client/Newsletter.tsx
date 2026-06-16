export default function Newsletter() {
  return (
    <div className="mt-10 p-6 bg-green-50 rounded-xl text-center">
      <h3 className="text-lg font-semibold">
        Stay Healthy & Updated
      </h3>

      <p className="text-sm text-gray-600 mt-1">
        Get weekly tips on organic living.
      </p>

      <div className="mt-3 flex gap-2 justify-center">
        <input
          className="border px-3 py-2 rounded-md text-sm"
          placeholder="Enter email"
        />
        <button className="bg-green-700 text-white px-4 py-2 rounded-md text-sm">
          Subscribe
        </button>
      </div>
    </div>
  );
}