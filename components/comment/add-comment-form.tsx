import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addCommentToReviewAction } from '@/app/actions/comments';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@/components/ui/spinner';

const inputSchema = z.object({
  comment: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment is too long'),
});

type CommentInputType = z.infer<typeof inputSchema>;

type AddCommentFormProps = {
  review_id: string;
  callbackAddComment: () => void;
};

export const AddCommentForm = ({
  review_id,
  callbackAddComment,
}: AddCommentFormProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentInputType>({
    defaultValues: { comment: '' },
    resolver: zodResolver(inputSchema),
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ content }: { content: string }) =>
      addCommentToReviewAction(review_id, content),
    onSuccess: () => {
      reset();
      callbackAddComment();
      queryClient.invalidateQueries({ queryKey: ['comments', review_id] });
    },
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(data =>
          addCommentMutation.mutate({ content: data.comment }),
        )}
        className="flex gap-2"
      >
        <Input
          type="text"
          {...register('comment')}
          placeholder="Write a comment..."
          className="flex-1 rounded-md border px-2 py-1"
        />
        <button
          type="submit"
          disabled={addCommentMutation.isPending}
          className="rounded-md bg-blue-500 px-4 py-1 text-white disabled:opacity-50"
        >
          {addCommentMutation.isPending ? (
            <Spinner className="items-center" />
          ) : (
            'Post'
          )}
        </button>
      </form>
      {errors.comment && (
        <div className="mt-1 text-sm text-red-500">
          {errors.comment.message}
        </div>
      )}
    </>
  );
};
