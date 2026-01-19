'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { uploadImage } from '@/app/actions/upload-image';
import { FaCamera } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

type Props = {
  folder: string;
  initialImageSrc?: string | null;
};

const ImageSelector = ({ folder: type, initialImageSrc = null }: Props) => {
  const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(
    initialImageSrc,
  );
  const [imageSrc, setImageSrc] = useState<string | null>(initialImageSrc);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setImageSrc(data);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setIsUploading(true);

    const type = inputRef.current?.getAttribute('data-type');
    console.log('Type:', type);
    if (!type || !imageSrc) return;

    try {
      const res = await uploadImage(imageSrc, type);
      setCurrentImageSrc(imageSrc);
      console.log(res.secure_url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred.');
      }
    }

    setIsUploading(false);
  };

  return (
    <div className="mx-auto flex flex-1 flex-col items-center justify-center">
      <input
        data-type={type}
        ref={inputRef}
        type="file"
        accept="image/jpg,image/jpeg,image/png"
        className="hidden"
        onChange={handleChange}
      />
      <div
        className="group relative flex size-36 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-amber-500 bg-zinc-50/50"
        onClick={handleClick}
      >
        {imageSrc && (
          <Image
            src={imageSrc as string}
            alt="Uploaded Image"
            width={0}
            height={0}
            sizes="100vw"
            className="h-full w-full object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/0 group-hover:bg-white/40">
          <FaCamera className="text-3xl text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </div>
      <div
        onClick={handleSubmit}
        className={cn(
          'mt-4 cursor-pointer rounded bg-amber-500 px-6 py-2 text-white',
          {
            'cursor-not-allowed opacity-50':
              imageSrc === currentImageSrc || isUploading,
          },
        )}
      >
        Upload
      </div>
    </div>
  );
};

export default ImageSelector;
