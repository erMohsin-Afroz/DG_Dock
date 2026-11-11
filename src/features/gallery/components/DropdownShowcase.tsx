
import { useState } from "react";
import { Check, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const options = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Zustand",
  "TanStack Query",
];

function DropdownShowcase() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("React");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Card className="gallery-theme">
      <CardHeader>
        <CardTitle>Dropdowns</CardTitle>
        <CardDescription>
          Action menu and searchable selection.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Action Dropdown</h3>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              <MoreHorizontal />
              Actions
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSelected("Edit action")}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelected("Duplicate action")}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setSelected("Delete action")}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <p className="text-xs text-muted-foreground">
            Selected action: {selected}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Searchable Dropdown</h3>

          <Input
            placeholder="Search technologies..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="max-h-48 overflow-y-auto rounded-lg border border-border p-1">
            {filteredOptions.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => {
                  setSelected(option);
                  setSearch("");
                }}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {option}
                {selected === option && (
                  <Check className="h-4 w-4 text-emerald-600" />
                )}
              </button>
            ))}

            {filteredOptions.length === 0 && (
              <p className="p-3 text-sm text-muted-foreground">
                No matching options found.
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Selected technology: {selected}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default DropdownShowcase;
