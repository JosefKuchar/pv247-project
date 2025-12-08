'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { EmptyState } from './empty-state';
import { approveClaim, rejectClaim } from '@/app/actions/admin';
import { getClaimsColumns, type ClaimData } from './claims-columns';

interface ClaimsTableProps {
  initialData: ClaimData[];
}

export function ClaimsTable({ initialData }: ClaimsTableProps) {
  const [claims, setClaims] = useState<ClaimData[]>(initialData);
  const [loadingClaims, setLoadingClaims] = useState<Set<string>>(new Set());

  const handleRemoveClaim = (claimId: string) => {
    setClaims(prev => prev.filter(claim => claim.id !== claimId));
  };

  const handleApprove = async (claimId: string) => {
    setLoadingClaims(prev => new Set(prev).add(claimId));
    try {
      await approveClaim(claimId);
      handleRemoveClaim(claimId);
    } catch (error) {
      console.error('Failed to approve claim:', error);
    } finally {
      setLoadingClaims(prev => {
        const next = new Set(prev);
        next.delete(claimId);
        return next;
      });
    }
  };

  const handleReject = async (claimId: string) => {
    setLoadingClaims(prev => new Set(prev).add(claimId));
    try {
      await rejectClaim(claimId);
      handleRemoveClaim(claimId);
    } catch (error) {
      console.error('Failed to reject claim:', error);
    } finally {
      setLoadingClaims(prev => {
        const next = new Set(prev);
        next.delete(claimId);
        return next;
      });
    }
  };

  const columns = getClaimsColumns(loadingClaims, handleApprove, handleReject);

  const table = useReactTable({
    data: claims,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (claims.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
