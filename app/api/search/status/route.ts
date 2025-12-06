import { NextResponse } from 'next/server';

type Status = {
  value: string;
  label: string;
};

const statuses: Status[] = [
  {
    value: 'backlog',
    label: 'Backlog',
  },
  {
    value: 'todo',
    label: 'Todo',
  },
  {
    value: 'in progress',
    label: 'In Progress',
  },
  {
    value: 'done',
    label: 'Done',
  },
  {
    value: 'canceled',
    label: 'Canceled',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  // For now, return hardcoded list
  // In the future, this can filter based on query
  const filteredStatuses = query
    ? statuses.filter(
        status =>
          status.label.toLowerCase().includes(query.toLowerCase()) ||
          status.value.toLowerCase().includes(query.toLowerCase()),
      )
    : statuses;

  return NextResponse.json(filteredStatuses);
}
