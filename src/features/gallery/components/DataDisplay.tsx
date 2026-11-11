
import { useState } from "react";
import { Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const members = [
  { id: 1, name: "Aarav Sharma", role: "Developer", status: "Active" },
  { id: 2, name: "Priya Verma", role: "Designer", status: "Active" },
  { id: 3, name: "Rahul Singh", role: "Manager", status: "Inactive" },
];

function DataDisplay() {
  const [showTable, setShowTable] = useState(true);

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Cards & Tabs</CardTitle>
          <CardDescription>
            Content grouping and tab navigation.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="rounded-lg border border-border p-4">
                <p className="font-medium">Overview Content</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  This is the overview tab content.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="rounded-lg border border-border p-4">
                <p className="font-medium">Recent Activity</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recent user activities appear here.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="rounded-lg border border-border p-4">
                <p className="font-medium">Settings Content</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Configure your preferences here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

     <Card>
        <CardHeader>
            <CardTitle>Accordion</CardTitle>
            <CardDescription>
            Expand and collapse content sections.
            </CardDescription>
        </CardHeader>

        <CardContent>
            <Accordion>
            <AccordionItem value="item-1">
                <AccordionTrigger>
                What is shadcn/ui?
                </AccordionTrigger>
                <AccordionContent>
                shadcn/ui is a collection of reusable UI components
                that you can add and customise in your project.
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
                <AccordionTrigger>
                Can components be customised?
                </AccordionTrigger>
                <AccordionContent>
                Yes. You own the component code and can customise
                its styles and behaviour.
                </AccordionContent>
            </AccordionItem>
            </Accordion>
        </CardContent>
        </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tooltip</CardTitle>
          <CardDescription>
            Helpful information on hover or keyboard focus.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" />}>
                <Info />
                Hover or focus me
              </TooltipTrigger>
              <TooltipContent>
                This is a tooltip description.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Data Table</CardTitle>
              <CardDescription>
                Example table with status badges.
              </CardDescription>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTable((current) => !current)}
            >
              {showTable ? "Show Skeleton" : "Show Table"}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {showTable ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.name}
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            member.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DataDisplay;
