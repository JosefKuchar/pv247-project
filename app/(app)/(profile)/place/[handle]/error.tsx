'use client';

export default function Error() {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <div className="py-12 text-center">
        <h1 className="mb-2 text-2xl font-bold text-red-600">
          Failed to load place
        </h1>
        <p className="text-muted-foreground">
          Sorry, we couldn&apos;t load the place profile. Please try again
          later.
        </p>
      </div>
    </div>
  );
}
