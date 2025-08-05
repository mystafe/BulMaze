import PlacementWizard from '@/components/PlacementWizard';
import AuthButtons from '@/components/AuthButtons';

export default function CareerPage() {
  return (
    <div className="space-y-4">
      <AuthButtons />
      <PlacementWizard />
    </div>
  );
}
