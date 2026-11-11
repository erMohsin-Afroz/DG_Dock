
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function FeedbackShowcase() {
  const [showSkeleton, setShowSkeleton] = useState(true);

  const handleSkeletonToggle = () => {
    setShowSkeleton(true);
    window.setTimeout(() => setShowSkeleton(false), 1500);
  };

  return (
    <Card className="gallery-theme">
      <CardHeader>
        <CardTitle>Feedback & Notifications</CardTitle>
        <CardDescription>
          Alerts, toast notifications, badges and loading states.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Alerts</h3>

          <Alert>
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This is a general information alert.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              This is an example of a destructive alert.
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Toast Notifications</h3>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                toast.success("Your changes have been saved.")
              }
            >
              Success Toast
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                toast.error("Unable to complete the action.")
              }
            >
              Error Toast
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                toast.info("Here is some useful information.")
              }
            >
              Info Toast
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                toast.warning("Please review your changes.")
              }
            >
              Warning Toast
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Badges</h3>

          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Skeleton Loading</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSkeletonToggle}
            >
              Reload
            </Button>
          </div>

          {showSkeleton ? (
            <div className="space-y-3 rounded-lg border border-border p-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : (
            <div className="rounded-lg border border-border p-4">
              <p className="font-medium">Content loaded</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The loading skeleton has been replaced with content.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default FeedbackShowcase;
