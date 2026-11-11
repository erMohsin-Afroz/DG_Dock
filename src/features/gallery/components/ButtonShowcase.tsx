
import { useState } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ButtonShowcase() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoading = () => {
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <Card className="gallery-theme">
      <CardHeader>
        <CardTitle>Buttons</CardTitle>
        <CardDescription>
          Button variants, sizes and interactive states.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Variants</h3>
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Sizes</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Save">
              <Save />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">States</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={handleLoading}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Loading...
                </>
              ) : (
                "Click to Load"
              )}
            </Button>

            <Button disabled>Disabled</Button>

            <Button variant="destructive">
              <Trash2 />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ButtonShowcase;
