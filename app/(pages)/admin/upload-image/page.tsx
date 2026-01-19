import { Card, CardTitle } from '@/components/ui/card';
import ImageSelectorForm from './image-selector-form';

const UploadImagePage = () => {
  return (
    <main className="flex flex-1 items-center justify-center">
      <Card className="flex w-full max-w-md flex-1">
        <CardTitle>
          <div className="flex justify-center">Select Rider Images</div>
        </CardTitle>
        <ImageSelectorForm />
      </Card>
    </main>
  );
};

export default UploadImagePage;
