import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-12">

        {/* Page title */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">UI Components</h1>
          <p className="mt-1 text-slate-500">All variants on a single page</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

          {/* ── Buttons ─────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-800">Button</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <Section title="Variants">
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </Section>
              <Section title="Sizes">
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </Section>
              <Section title="States">
                <div className="flex flex-wrap gap-2">
                  <Button isLoading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </Section>
            </CardBody>
          </Card>

          {/* ── Inputs ──────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-800">Input</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input label="Normal" placeholder="Enter value…" />
              <Input label="With value" defaultValue="Hello world" />
              <Input
                label="Error state"
                defaultValue="bad input"
                error="This field is required"
              />
              <Input placeholder="No label" />
              <Input label="Disabled" placeholder="Can't touch this" disabled />
            </CardBody>
          </Card>

          {/* ── Badges ──────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-800">Badge</h3>
            </CardHeader>
            <CardBody>
              <Section title="Variants">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                </div>
              </Section>
            </CardBody>
            <CardFooter>
              <p className="text-xs text-slate-400">Used for status labels and tags</p>
            </CardFooter>
          </Card>

          {/* ── Avatars ─────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-800">Avatar</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <Section title="Initials (sizes)">
                <div className="flex items-end gap-3">
                  <Avatar name="Alice Brown" size="sm" />
                  <Avatar name="Bob Carter" size="md" />
                  <Avatar name="Diana Prince" size="lg" />
                </div>
              </Section>
              <Section title="With image">
                <div className="flex items-end gap-3">
                  <Avatar
                    name="Eve Adams"
                    src="https://i.pravatar.cc/56?img=1"
                    size="sm"
                  />
                  <Avatar
                    name="Frank Miller"
                    src="https://i.pravatar.cc/80?img=3"
                    size="md"
                  />
                  <Avatar
                    name="Grace Lee"
                    src="https://i.pravatar.cc/112?img=5"
                    size="lg"
                  />
                </div>
              </Section>
              <Section title="Single name">
                <div className="flex items-center gap-3">
                  <Avatar name="Madonna" size="md" />
                  <span className="text-sm text-slate-500">"Madonna" → M</span>
                </div>
              </Section>
            </CardBody>
          </Card>

          {/* ── Spinners ────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-800">Spinner</h3>
            </CardHeader>
            <CardBody>
              <Section title="Sizes">
                <div className="flex items-end gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size="sm" />
                    <span className="text-xs text-slate-400">sm</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size="md" />
                    <span className="text-xs text-slate-400">md</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size="lg" />
                    <span className="text-xs text-slate-400">lg</span>
                  </div>
                </div>
              </Section>
            </CardBody>
          </Card>

          {/* ── Card anatomy ────────────────────────────────── */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-800">Card</h3>
            </CardHeader>
            <CardBody className="space-y-2">
              <p className="text-sm text-slate-600">
                Cards compose <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">CardHeader</code>,{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">CardBody</code>, and{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">CardFooter</code> sections.
                All sections are optional and accept a <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">className</code> override.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="success">rounded-xl</Badge>
                <Badge variant="primary">shadow-sm</Badge>
                <Badge variant="default">dark mode</Badge>
              </div>
            </CardBody>
            <CardFooter className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Footer with actions</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">Cancel</Button>
                <Button variant="primary" size="sm">Confirm</Button>
              </div>
            </CardFooter>
          </Card>

        </div>
      </div>
    </div>
  );
}
