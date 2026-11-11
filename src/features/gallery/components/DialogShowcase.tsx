
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function DialogShowcase() {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <Card className="gallery-theme">
      <CardHeader>
        <CardTitle>Dialogs & Sheets</CardTitle>
        <CardDescription>
          Confirmation dialog and side panel interaction.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger render={<Button />}>
            Open Dialog
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmation</DialogTitle>
              <DialogDescription>
                This is an interactive dialog example. You can cancel
                or confirm this action.
              </DialogDescription>
            </DialogHeader>

            {isConfirmed && (
              <p className="text-sm text-emerald-600">
                Action confirmed successfully.
              </p>
            )}

            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>

              <DialogClose
                render={
                  <Button onClick={() => setIsConfirmed(true)} />
                }
              >
                Confirm
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>
            Open Sheet
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>Settings Panel</SheetTitle>
              <SheetDescription>
                This side panel demonstrates the Sheet component.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-3 px-4 py-5">
              <p className="text-sm text-muted-foreground">
                Sheet content can contain forms, filters or other
                controls.
              </p>
            </div>

            <SheetFooter>
              <SheetClose render={<Button variant="outline" />}>
                Close Panel
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}

export default DialogShowcase;
