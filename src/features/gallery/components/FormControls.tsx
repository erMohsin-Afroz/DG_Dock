
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function FormControls() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("developer");
  const [notifications, setNotifications] = useState(true);
  const [terms, setTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <Card className="gallery-theme">
      <CardHeader>
        <CardTitle>Form Controls</CardTitle>
        <CardDescription>
          Inputs, textarea, select, checkbox and switch.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="gallery-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="gallery-name"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setSubmitted(false);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Default input with focus and hover states.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="gallery-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="gallery-email"
              type="email"
              placeholder="Enter email"
              aria-invalid={!name.trim()}
            />
            <p className="text-xs text-destructive">
              Example invalid state.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="gallery-disabled" className="text-sm font-medium">
              Disabled Input
            </label>
            <Input
              id="gallery-disabled"
              value="This field is disabled"
              disabled
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="gallery-message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="gallery-message"
              placeholder="Write something..."
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setSubmitted(false);
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Role</label>
            <Select value={role} onValueChange={(value)=> setRole(value ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="gallery-terms"
              checked={terms}
              onCheckedChange={(checked) => {
                setTerms(checked === true);
                setSubmitted(false);
              }}
            />
            <label htmlFor="gallery-terms" className="text-sm">
              I agree to the terms and conditions
            </label>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive notification updates
              </p>
            </div>

            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
              aria-label="Toggle notifications"
            />
          </div>

          <Button type="submit">Submit Controls</Button>

          {submitted && (
            <p className="text-sm font-medium text-emerald-600">
              Form controls submitted successfully.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default FormControls;
