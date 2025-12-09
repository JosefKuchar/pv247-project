import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { addCommentToReviewAction } from '@/app/actions/comments';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@/components/ui/spinner';
import { commentSchema } from '@/lib/validation';
import { FormTextarea } from '@/components/form/form-textarea';

const inputSchema = z.object({
  comment: commentSchema,
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

  const methods = useForm<CommentInputType>({
    defaultValues: { comment: '' },
    resolver: zodResolver(inputSchema),
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ content }: { content: string }) =>
      addCommentToReviewAction(review_id, content),
    onSuccess: () => {
      methods.reset();
      callbackAddComment();
      queryClient.invalidateQueries({ queryKey: ['comments', review_id] });
    },
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(data =>
          addCommentMutation.mutate({ content: data.comment }),
        )}
        className="space-y-2"
      >
        <FormTextarea
          name="comment"
          placeholder="Write a comment..."
          maxLength={500}
          showCharCount={true}
          warningThreshold={400}
          className="min-h-[80px]"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={addCommentMutation.isPending}
            className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          >
            {addCommentMutation.isPending ? (
              <Spinner className="items-center" />
            ) : (
              'Post'
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
