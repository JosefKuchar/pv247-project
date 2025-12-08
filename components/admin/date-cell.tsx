interface DateCellProps {
  date: Date;
}

export function DateCell({ date }: DateCellProps) {
  return (
    <div className="text-sm text-gray-600">
      {new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </div>
  );
}
