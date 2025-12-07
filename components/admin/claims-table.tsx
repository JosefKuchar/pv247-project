'use client';

import { useState } from 'react';
import { ClaimRow } from './claim-row';
import { EmptyState } from './empty-state';
import { tableColumns } from './claims-table-columns';

type ClaimData = {
  id: string;
  userId: string;
  locationId: string;
  approved: boolean;
  createdAt: Date;
  userName: string;
  userHandle: string;
  userImage: string | null;
  locationName: string;
  locationHandle: string;
  locationAddress: string | null;
};

interface ClaimsTableProps {
  initialData: ClaimData[];
}

export function ClaimsTable({ initialData }: ClaimsTableProps) {
  const [claims, setClaims] = useState<ClaimData[]>(initialData);

  const handleRemoveClaim = (claimId: string) => {
    setClaims(prev => prev.filter(claim => claim.id !== claimId));
  };

  if (claims.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              {tableColumns.map(column => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {claims.map(claim => (
              <ClaimRow
                key={claim.id}
                claim={claim}
                onRemove={handleRemoveClaim}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
