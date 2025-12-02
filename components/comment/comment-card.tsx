'use client';

import { CommentDataType } from '@/modules/comment/server';

type CommentCardProps = { comment: CommentDataType };

export const CommentCard = ({ comment }: CommentCardProps) => {
  return (
    <div key={comment.id} className="w-full">
      <p className="font-medium text-gray-400">@{comment.user.handle}</p>
      <p>{comment.content}</p>
      <p className="text-muted-foreground text-sm">
        {new Date(comment.createdAt).toLocaleString()}
      </p>
    </div>
  );
};
