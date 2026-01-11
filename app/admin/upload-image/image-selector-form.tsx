'use client';

import { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Form } from '@/components/ui/form';
import { uploadImage } from '@/app/actions/upload-image';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { LoadingButton } from '@/components/loading-button';
import ImageSelector from '@/components/image-selector';

type Props = {
  initialRiderImageSrc?: string | null;
  initialFlagImageSrc?: string | null;
  initialActionImageSrc?: string | null;
};

const imageFormSchema = z.object({
  riderImage: z.string().optional().nullable(),
  flagImage: z.string().optional().nullable(),
  actionImage: z.string().optional().nullable(),
});

export type ImageFormValues = z.infer<typeof imageFormSchema>;

const ImageSelectorForm = ({
  initialRiderImageSrc = null,
  initialFlagImageSrc = null,
  initialActionImageSrc = null,
}: Props) => {
  const router = useRouter();

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      riderImage: initialRiderImageSrc,
      flagImage: initialFlagImageSrc,
      actionImage: initialActionImageSrc,
    },
  });

  const { control, handleSubmit } = form;
  const { isDirty, isSubmitting } = form.formState;

  const riderImageField = 'riderImage' as const;
  const flagImageField = 'flagImage' as const;
  const actionImageField = 'actionImage' as const;

  const riderImageSrc = form.watch(riderImageField);
  const flagImageSrc = form.watch(flagImageField);
  const actionImageSrc = form.watch(actionImageField);

  const imageMissing = !riderImageSrc || !flagImageSrc || !actionImageSrc;

  const handleRiderImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    const reader = new FileReader();

    reader.onloadend = () => {
      // base64 encoded image
      const data = reader.result as string;
      form.setValue(riderImageField, data, { shouldDirty: true });
    };

    reader.readAsDataURL(file);
  };
  const handleFlagImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    const reader = new FileReader();

    reader.onloadend = () => {
      // base64 encoded image
      const data = reader.result as string;
      form.setValue(flagImageField, data, { shouldDirty: true });
    };

    reader.readAsDataURL(file);
  };
  const handleActionImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    const reader = new FileReader();

    reader.onloadend = () => {
      // base64 encoded image
      const data = reader.result as string;
      form.setValue(actionImageField, data, { shouldDirty: true });
    };

    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async ({
    riderImage,
    flagImage,
    actionImage,
  }: ImageFormValues) => {
    if (!riderImage || !flagImage || !actionImage) return;

    try {
      const riderResponse = await uploadImage(riderImage, 'rider');
      const flagResponse = await uploadImage(flagImage, 'flag');
      const actionResponse = await uploadImage(actionImage, 'action');

      const riderImageUrl = riderResponse.secure_url;
      const flagImageUrl = flagResponse.secure_url;
      const actionImageUrl = actionResponse.secure_url;

      console.log(riderImageUrl, flagImageUrl, actionImageUrl);
      toast.success('Images uploaded successfully.');
      form.reset({ riderImage: null, flagImage: null, actionImage: null });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        if (error.message === 'Unauthorized') {
          router.push('/');
        }
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="mx-auto flex flex-1 flex-col items-center justify-center">
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4">
          <section className="flex flex-col gap-y-6">
            <section className="flex justify-center gap-x-6">
              <div className="flex flex-col items-center">
                <ImageSelector
                  className="size-36 border-2 border-amber-500 bg-zinc-100"
                  src={riderImageSrc}
                  control={control}
                  handleImageChange={handleRiderImageChange}
                  fieldName={riderImageField}
                  handleImageReset={() => form.setValue(riderImageField, null)}
                />
                <label className="mt-2 text-xs">Rider</label>
              </div>
              <div className="flex flex-col items-center">
                <ImageSelector
                  className="size-36 border-2 border-amber-500 bg-zinc-100"
                  src={flagImageSrc}
                  control={control}
                  handleImageChange={handleFlagImageChange}
                  fieldName={flagImageField}
                  handleImageReset={() => form.setValue(flagImageField, null)}
                />
                <label className="mt-2 text-xs">Flag</label>
              </div>
            </section>
            <div className="flex flex-col items-center">
              <ImageSelector
                className="h-36 w-90 rounded-md border-2 border-amber-500 bg-zinc-100"
                src={actionImageSrc}
                control={control}
                handleImageChange={handleActionImageChange}
                fieldName={actionImageField}
                handleImageReset={() => form.setValue(actionImageField, null)}
              />
              <label className="mt-2 text-xs">Action</label>
            </div>
          </section>

          <LoadingButton
            type="submit"
            loading={isSubmitting}
            disabled={!isDirty || isSubmitting || imageMissing}
          >
            Save
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
};

export default ImageSelectorForm;
