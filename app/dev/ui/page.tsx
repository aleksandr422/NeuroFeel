"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { Chip } from "@/components/ui/Chip";
import { Tag } from "@/components/ui/Tag";
import { NavPill } from "@/components/ui/NavPill";
import { useState } from "react";

export default function UiDevPage() {
  const [sliderValue, setSliderValue] = useState(3);
  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">UI Primitives</h1>
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </Card>
      <Card className="space-y-3" tone="muted">
        <h2 className="text-lg font-semibold">Form</h2>
        <Input placeholder="Input" />
        <Select defaultValue="a">
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </Select>
        <Textarea placeholder="Textarea" />
        <Slider value={sliderValue} min={1} max={5} onChange={setSliderValue} />
      </Card>
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Chips, Tags, NavPill</h2>
        <div className="flex gap-2">
          <Chip>Neutral</Chip>
          <Chip tone="primary">Primary</Chip>
          <Chip tone="muted">Muted</Chip>
        </div>
        <div className="flex gap-2">
          <Tag>Tag</Tag>
          <Tag tone="muted">Muted</Tag>
        </div>
        <div className="flex gap-2">
          <NavPill href="#" active>
            Active
          </NavPill>
          <NavPill href="#">Default</NavPill>
        </div>
      </Card>
    </main>
  );
}
