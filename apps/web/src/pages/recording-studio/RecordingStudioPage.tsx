import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ComingSoon } from '@/components/ComingSoon';
import { Button } from '@/components/ui/button';

export default function RecordingStudioPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/courses">
          <ArrowLeft /> Back
        </Link>
      </Button>
      <ComingSoon title="Recording studio" step="d" />
    </div>
  );
}
