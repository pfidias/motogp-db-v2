'use client';

import { useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/user-avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { uploadImage } from '@/app/actions/upload-image';
import { FaCamera } from 'react-icons/fa';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { LoadingButton } from '@/components/loading-button';

type Props = {
  folder?: string;
  initialImageSrc?: string | null;
};

const imageFormSchema = z.object({
  image: z.string().optional().nullable(),
});

export type ImageFormValues = z.infer<typeof imageFormSchema>;

const ImageSelectorForm = ({ folder = '', initialImageSrc = null }: Props) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      image: initialImageSrc,
    },
  });

  const { control, handleSubmit } = form;
  const { isDirty, isSubmitting } = form.formState;

  const imageSrc = form.watch('image');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    const reader = new FileReader();

    reader.onloadend = () => {
      // base64 encoded image
      const data = reader.result as string;
      form.setValue('image', data, { shouldDirty: true });
    };

    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async ({ image }: ImageFormValues) => {
    console.log(image);
    if (!image) return;

    try {
      const response = await uploadImage(image, folder);

      console.log(response);
      toast.success('Image uploaded successfully.');
      form.reset({ image });
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
          <FormField
            control={control}
            name="image"
            render={() => (
              <FormItem>
                <FormControl>
                  <Input
                    ref={inputRef}
                    className="hidden"
                    type="file"
                    accept="image/jpg,image/jpeg,image/png"
                    onChange={handleChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="relative size-36">
            <div
              className="cursor-pointer rounded-full"
              onClick={() => inputRef.current?.click()}
            >
              <UserAvatar
                image={imageSrc}
                className="size-36 border-2 border-amber-500"
                name={''}
              />
              <div className="group absolute inset-0 flex size-36 items-center justify-center rounded-full transition-colors duration-300 hover:bg-white/40">
                <FaCamera className="text-3xl text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="absolute top-0 right-0 size-6 rounded-full"
              onClick={() => form.reset({ image: null })}
              aria-label="Remove image"
              disabled={!imageSrc}
            >
              <XIcon className="size-4" />
            </Button>
          </div>

          <LoadingButton
            type="submit"
            loading={isSubmitting}
            disabled={!isDirty || isSubmitting}
          >
            Save
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
};

export default ImageSelectorForm;
