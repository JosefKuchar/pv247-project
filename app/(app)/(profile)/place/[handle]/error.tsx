'use client';

export default function Error() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Failed to load place</h1>
        <p className="text-muted-foreground">
          Sorry, we couldn't load the place profile. Please try again later.
        </p>
      </div>
    </div>
  );
}
