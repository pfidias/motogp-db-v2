import { Card, CardTitle } from '@/components/ui/card';
import ImageSelector from './image-selector';
import ImageSelectorForm from './image-selector-form';

const UploadImagePage = () => {
  return (
    <main className="flex flex-1 items-center justify-center">
      <Card className="flex h-76 w-full max-w-md flex-1">
        <CardTitle>
          <div className="flex justify-center">Choose a Rider</div>
        </CardTitle>
        <ImageSelectorForm folder="rider" />
      </Card>
    </main>
  );
};

export default UploadImagePage;
