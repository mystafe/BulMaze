import PlacementWizard from '@/components/PlacementWizard';
import AuthButtons from '@/components/AuthButtons';

export default function CareerPage() {
  const authEnabled = process.env.FEATURE_AUTH === 'true';
  return (
    <div className="space-y-4">
      {authEnabled ? <AuthButtons /> : <PlacementWizard />}
    </div>
  );
}
