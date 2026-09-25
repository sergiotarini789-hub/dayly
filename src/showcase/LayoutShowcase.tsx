import {
  AppTopBar,
  CalendarShell,
  Cluster,
  DashboardGrid,
  LayoutGrid,
  MasterDetail,
  PageContainer,
  PageHeader,
  Panel,
  Section,
  SectionHeader,
  SplitPane,
  Stack,
  TimelineContainer,
  ThreeColumn,
  TwoColumn,
} from "@/components/layout";
import { Badge, Button, Separator } from "@/components/ui";

function PlaceholderPanel({ title, description, variant = "standard" as const }: { title: string; description: string; variant?: "standard" | "elevated" | "bordered" }) {
  return <Panel variant={variant} className="layout-showcase__placeholder"><strong>{title}</strong><span>{description}</span></Panel>;
}

export function LayoutShowcase() {
  return (
    <div className="layout-showcase">
      <PageContainer width="wide">
        <PageHeader
          eyebrow="PHASE 1D · layout foundation"
          title="Application shell and layout system"
          description="A structural showcase for Dayly navigation, page composition, responsive regions, and scroll behavior. Every panel contains placeholder content only."
          primaryActions={<Button>Primary action</Button>}
          secondaryActions={<Button variant="outline">Secondary action</Button>}
        />

        <Section className="layout-showcase__section">
          <SectionHeader title="Responsive shell" description="Resize the preview to see the desktop sidebar, tablet rail/portrait hybrid, and mobile bottom navigation." actions={<Badge variant="info">No product data</Badge>} />
          <Panel variant="elevated" className="layout-showcase__shell-note">
            <AppTopBar
              left={<span className="layout-showcase__slot-label">Top bar · left slot</span>}
              center={<strong>Context title</strong>}
              right={<Cluster><Button size="sm" variant="ghost">Context</Button><Button size="sm" variant="outline">Action</Button></Cluster>}
              aria-label="Top bar slot preview"
            />
            <p>Top bar slots remain composable. The application shell owns positioning, while a route can supply title, context controls, or inert utility placeholders.</p>
          </Panel>
        </Section>

        <Section className="layout-showcase__section">
          <SectionHeader title="Dashboard grid" description="The generic grid becomes one column on mobile, flexible columns at tablet widths, and a wider multi-column field on desktop." />
          <DashboardGrid>
            <PlaceholderPanel title="Panel one" description="Flexible content region" variant="bordered" />
            <PlaceholderPanel title="Panel two" description="Flexible content region" variant="elevated" />
            <PlaceholderPanel title="Panel three" description="Flexible content region" />
          </DashboardGrid>
        </Section>

        <Section className="layout-showcase__section">
          <SectionHeader title="Page and section composition" description="Primitives compose without page-specific layout knowledge." />
          <TwoColumn>
            <Stack>
              <PlaceholderPanel title="Reading column" description="A comfortable content region." />
              <PlaceholderPanel title="Supporting column" description="A secondary region that stacks on mobile." />
            </Stack>
            <ThreeColumn>
              <PlaceholderPanel title="Column A" description="Equal-width composition." />
              <PlaceholderPanel title="Column B" description="Equal-width composition." />
              <PlaceholderPanel title="Column C" description="Equal-width composition." />
            </ThreeColumn>
          </TwoColumn>
          <Separator />
          <LayoutGrid>
            <PlaceholderPanel title="Auto-fit grid item" description="Natural wrapping with token-driven gaps." />
            <PlaceholderPanel title="Auto-fit grid item" description="Natural wrapping with token-driven gaps." />
          </LayoutGrid>
        </Section>

        <Section className="layout-showcase__section">
          <SectionHeader title="Master / detail foundation" description="A generic list-to-detail structure; selection and domain records are intentionally absent." />
          <MasterDetail
            listLabel="Example list"
            detailLabel="Example detail"
            list={<Stack gap="sm"><PlaceholderPanel title="List item one" description="Representative placeholder" variant="bordered" /><PlaceholderPanel title="List item two" description="Representative placeholder" variant="bordered" /><PlaceholderPanel title="List item three" description="Representative placeholder" variant="bordered" /></Stack>}
            detail={<Stack><Badge>Detail region</Badge><h3>Detail content slot</h3><p className="layout-showcase__muted">On narrow screens, the detail region follows the list. A future route can replace this composition with an explicit navigation transition.</p><Button variant="outline">Placeholder action</Button></Stack>}
          />
        </Section>

        <Section className="layout-showcase__section">
          <SectionHeader title="Calendar layout foundation" description="Only structural slots are present: no events, tasks, drag/drop, recurrence, or scheduling logic." />
          <CalendarShell
            header={<><strong>Calendar header slot</strong><span className="layout-showcase__muted">Day / week controls belong to a future consumer</span></>}
            body={<TimelineContainer label="Calendar timeline placeholder"><div className="layout-showcase__timeline-placeholder"><span>Timeline body slot</span><span>Time axis slot</span><span>Content rows slot</span></div></TimelineContainer>}
          />
        </Section>

        <Section className="layout-showcase__section">
          <SectionHeader title="Split pane and overflow" description="Panel scrolling is opt-in; the application content owns the primary scroll region." />
          <SplitPane>
            <Panel variant="bordered" className="layout-showcase__scroll-panel" scrollable><Stack><strong>Scrollable panel</strong><p className="layout-showcase__muted">This region demonstrates a justified local scroll boundary for a bounded panel. It does not create feature behavior.</p><div className="layout-showcase__long-placeholder" aria-hidden="true" /></Stack></Panel>
            <Panel variant="standard"><Stack><strong>Content region</strong><p className="layout-showcase__muted">Wide content stays within the shell and collapses to one column on mobile.</p></Stack></Panel>
          </SplitPane>
        </Section>
      </PageContainer>
    </div>
  );
}
