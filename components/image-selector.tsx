'use client';

import { useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { FaCamera } from 'react-icons/fa';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type ImageSelectorProps<T extends FieldValues> =
  React.ComponentPropsWithoutRef<'div'> & {
    src: string | null | undefined;
    alt?: string;
    control: Control<T>;
    fieldName: Path<T>;
    handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleImageReset: () => void;
  };

const ImageSelector = <T extends FieldValues>({
  src,
  alt,
  control,
  fieldName,
  handleImageChange,
  handleImageReset,
  className,
  ...props
}: ImageSelectorProps<T>) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <>
      <FormField
        control={control}
        name={fieldName}
        render={() => (
          <FormItem>
            <FormControl>
              <Input
                ref={inputRef}
                className="hidden"
                type="file"
                accept="image/jpg,image/jpeg,image/png"
                onChange={handleImageChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="relative">
        <div
          className={cn(
            'group relative flex size-8 shrink-0 cursor-pointer overflow-hidden rounded-full text-2xl text-black',
            className,
          )}
          {...props}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex size-full items-center justify-center transition-colors duration-300 group-hover:bg-white/40">
            <FaCamera className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          {src && (
            <Image
              src={src}
              alt={alt ?? 'Form image'}
              fill
              className="pointer-events-none object-cover"
            />
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          className="absolute top-0 right-0 size-6 rounded-full"
          onClick={handleImageReset}
          aria-label="Remove image"
          disabled={!src}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    </>
  );
};

export default ImageSelector;
