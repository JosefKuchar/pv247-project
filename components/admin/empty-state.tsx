export function EmptyState() {
  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
      <div className="text-center">
        <h3 className="text-lg font-semibold">No pending claims</h3>
        <p className="mt-2 text-sm text-gray-500">
          All location management claims have been processed.
        </p>
      </div>
    </div>
  );
}
