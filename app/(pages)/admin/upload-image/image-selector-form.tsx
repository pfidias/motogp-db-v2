'use client';

import { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Form } from '@/components/ui/form';
import { uploadImage } from '@/app/actions/upload-image';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Path, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { LoadingButton } from '@/components/loading-button';
import ImageSelector from '@/components/image-selector';

type Props = {
  // initialRiderImagesSrc?: (string | null)[];
  initialRiderImageSrc?: string | null;
  initialFlagImageSrc?: string | null;
  initialActionImageSrc?: string | null;
};

const imageFormSchema = z.object({
  // riderImages: z.array(z.string().nullable()).length(2),
  riderImage: z.string().nullable(),
  flagImage: z.string().nullable(),
  actionImage: z.string().nullable(),
});

export type ImageFormValues = z.infer<typeof imageFormSchema>;

const ImageSelectorForm = ({
  // initialRiderImagesSrc = [null, null],
  initialRiderImageSrc = null,
  initialFlagImageSrc = null,
  initialActionImageSrc = null,
}: Props) => {
  const router = useRouter();

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      // riderImages: initialRiderImagesSrc,
      riderImage: initialRiderImageSrc,
      flagImage: initialFlagImageSrc,
      actionImage: initialActionImageSrc,
    },
  });

  const { control, handleSubmit } = form;
  const { isDirty, isSubmitting } = form.formState;

  // const riderImagesField = 'riderImages' as const;
  const riderImageField = 'riderImage' as const;
  const flagImageField = 'flagImage' as const;
  const actionImageField = 'actionImage' as const;

  // const riderImagesSrc = form.watch(riderImagesField);
  const riderImageSrc = form.watch(riderImageField);
  const flagImageSrc = form.watch(flagImageField);
  const actionImageSrc = form.watch(actionImageField);

  const imageMissing =
    // riderImagesSrc.some((image) => !image) ||
    !riderImageSrc || !flagImageSrc || !actionImageSrc;

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: Path<ImageFormValues>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;
    const reader = new FileReader();

    reader.onloadend = () => {
      const data = reader.result as string;
      form.setValue(field, data, { shouldDirty: true });
    };

    // base64 encoded image
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async ({
    // riderImages,
    riderImage,
    flagImage,
    actionImage,
  }: ImageFormValues) => {
    if (
      /* riderImages.some((image) => !image) */ !riderImage ||
      !flagImage ||
      !actionImage
    )
      return;

    try {
      // const riderResponses = await Promise.all(
      //   riderImages.map((image, i) =>
      //     image !== initialRiderImagesSrc[i]
      //       ? uploadImage(image!, 'rider')
      //       : Promise.resolve({ secure_url: image! }),
      //   ),
      // );
      const riderResponse = await uploadImage(riderImage, 'rider');
      const flagResponse = await uploadImage(flagImage, 'flag');
      const actionResponse =
        actionImageSrc !== initialActionImageSrc
          ? await uploadImage(actionImage, 'action')
          : { secure_url: actionImage! };

      // const riderImagesUrl = riderResponses.map(
      //   (response) => response.secure_url,
      // );
      const riderImageUrl = riderResponse.secure_url;
      const flagImageUrl = flagResponse.secure_url;
      const actionImageUrl = actionResponse.secure_url;

      console.log(
        // riderImagesUrl,
        riderImageUrl,
        flagImageUrl,
        actionImageUrl,
      );
      toast.success('Images uploaded successfully.');
      form.reset({
        // riderImages: riderImages.map(() => null),
        riderImage: null,
        flagImage: null,
        actionImage: null,
      });
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
                  // for array of images: src={riderImagesSrc[i]}
                  src={riderImageSrc}
                  alt="Rider image"
                  control={control}
                  // for array of images: handleImageChange={(e) => handleImageChange(e, `riderImages.${i}`)}
                  handleImageChange={(e) =>
                    handleImageChange(e, riderImageField)
                  }
                  // for array of images: fieldName={`riderImages.${i}`}
                  fieldName={riderImageField}
                  // for array of images: handleImageReset={() => form.setValue(`riderImages.${i}`, null)}
                  handleImageReset={() => form.setValue(riderImageField, null)}
                />
                <label className="mt-2 text-xs">Rider</label>
              </div>
              <div className="flex flex-col items-center">
                <ImageSelector
                  className="size-36 border-2 border-amber-500 bg-zinc-100"
                  src={flagImageSrc}
                  alt="Rider image"
                  control={control}
                  handleImageChange={(e) =>
                    handleImageChange(e, flagImageField)
                  }
                  fieldName={flagImageField}
                  handleImageReset={() => form.setValue(flagImageField, null)}
                />
                <label className="mt-2 text-xs">Flag</label>
              </div>
            </section>
            <div className="flex flex-col items-center">
              <ImageSelector
                className="h-36 w-90 rounded-sm border-2 border-amber-500 bg-zinc-100"
                src={actionImageSrc}
                alt="Action image"
                control={control}
                handleImageChange={(e) =>
                  handleImageChange(e, actionImageField)
                }
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
