import { ExternalLink, Prose } from "./primitives"
import { SyncDiagram } from "./sync-diagram"
import type { Content } from "@/content"
import { jobIds, jobs, projectIds, projects, site } from "@/content"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function About({ content }: { content: Content }) {
  return (
    <div className="flex flex-col gap-10">
      <Prose paragraphs={content.about.paragraphs} />
      <dl className="grid border-t border-l sm:grid-cols-3">
        {content.about.principles.map((principle) => (
          <div
            key={principle.key}
            className="flex flex-col gap-2 border-r border-b p-4"
          >
            <dt className="text-xs tracking-widest text-primary uppercase">
              {principle.key}
            </dt>
            <dd className="text-muted-foreground">{principle.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function Frontline({ content }: { content: Content }) {
  const { frontline } = content

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <p className="text-xs tracking-widest text-muted-foreground uppercase">
          {frontline.kicker}
        </p>
        <h3 className="text-3xl leading-none font-medium tracking-tight">
          Frontline
        </h3>
      </div>
      <Prose paragraphs={frontline.paragraphs} />
      <SyncDiagram copy={frontline.diagram} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-wrap gap-1.5">
          {site.frontline.stack.map((tech) => (
            <li key={tech}>
              <Badge variant="outline">{tech}</Badge>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-5">
          <ExternalLink href={site.frontline.site}>
            {frontline.siteLabel}
          </ExternalLink>
          <ExternalLink href={site.frontline.launch}>
            {frontline.launchLabel}
          </ExternalLink>
        </div>
      </div>
    </div>
  )
}

// A rail down the left with a branch per entry.
export function Agents({ content }: { content: Content }) {
  const { items } = content.agents

  return (
    <div className="flex flex-col gap-8">
      <p className="max-w-[30ch] text-xl leading-snug text-balance md:text-2xl">
        {content.agents.lead}
      </p>
      <dl>
        {items.map((item, index) => (
          <div key={item.key} className="relative pb-4 pl-8 last:pb-0">
            <span
              aria-hidden
              className={cn(
                "absolute top-0 left-0 w-px bg-foreground/30",
                index === items.length - 1 ? "h-3" : "h-full"
              )}
            />
            <span
              aria-hidden
              className="absolute top-3 left-0 h-px w-5 bg-foreground/30"
            />
            <dt className="text-primary">{item.key}</dt>
            <dd className="max-w-[68ch]">{item.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

// A timeline: one node per role, newest first.
export function Experience({ content }: { content: Content }) {
  const { education } = content.experience
  const entries = [
    ...jobIds.map((id) => ({
      id,
      title: content.experience.jobs[id].role,
      organisation: jobs[id].company,
      href: jobs[id].href,
      period: content.experience.jobs[id].period,
      highlights: content.experience.jobs[id].highlights,
    })),
    {
      id: "education",
      title: education.degree,
      organisation: education.school,
      href: undefined,
      period: education.period,
      highlights: education.highlights,
    },
  ]

  return (
    <ol>
      {entries.map((entry, index) => (
        <li key={entry.id} className="relative pb-10 pl-8 last:pb-0">
          {index < entries.length - 1 && (
            <span
              aria-hidden
              className="absolute top-3 -bottom-2 left-[5px] w-px bg-foreground/30"
            />
          )}
          <span
            aria-hidden
            className={cn(
              "absolute top-[6px] left-0 size-[11px] border",
              index === 0
                ? "border-primary bg-primary"
                : "border-foreground/50 bg-background"
            )}
          />
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <h3 className="flex flex-wrap items-center gap-x-2 font-medium">
                <span>
                  {entry.title} <span className="text-muted-foreground">@</span>{" "}
                  {entry.href ? (
                    <ExternalLink href={entry.href}>
                      {entry.organisation}
                    </ExternalLink>
                  ) : (
                    entry.organisation
                  )}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground tabular-nums">
                {entry.period}
              </p>
            </div>
            <ul className="flex max-w-[68ch] flex-col gap-1.5">
              {entry.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="grid grid-cols-[1rem_minmax(0,1fr)]"
                >
                  <span aria-hidden className="text-primary">
                    +
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function Projects({ content }: { content: Content }) {
  return (
    <ul className="flex flex-col gap-4 sm:gap-1.5">
      {projectIds.map((id) => {
        const project = projects[id]

        return (
          <li
            key={id}
            className="grid gap-x-6 gap-y-0.5 sm:grid-cols-[5rem_16rem_minmax(0,1fr)] sm:items-baseline"
          >
            <span className="hidden text-xs text-muted-foreground sm:block">
              {project.tag}
            </span>
            <ExternalLink href={project.href} className="w-fit">
              {project.name}
            </ExternalLink>
            <span className="text-muted-foreground">
              {content.projects.descriptions[id]}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export function Contact({ content }: { content: Content }) {
  const channels = [
    { href: `mailto:${site.email}`, text: site.email, external: false },
    {
      href: site.github,
      text: site.github.replace("https://", ""),
      external: true,
    },
    {
      href: site.linkedin,
      text: site.linkedin.replace("https://www.", "").replace(/\/$/, ""),
      external: true,
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <p>
        <span className="text-xl md:text-2xl">{content.contact.lead}</span>{" "}
        <span className="text-muted-foreground">{content.contact.body}</span>
      </p>
      <ul className="flex flex-col gap-x-8 gap-y-2 sm:flex-row sm:flex-wrap">
        {channels.map((channel) => (
          <li key={channel.href} className="min-w-0 break-words">
            <ExternalLink
              href={channel.href}
              target={channel.external ? "_blank" : undefined}
            >
              {channel.text}
            </ExternalLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
