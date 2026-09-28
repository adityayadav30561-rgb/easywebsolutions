# HQ — multi-agency CRM

HQ is the client, project, ticket, quotation, invoice and care-plan system behind EasyWebSolns, built so it can be
offered to other agencies. Each agency gets its own private workspace: its team and clients never see another
agency's data.

Stack: **Next.js 16 · TypeScript · Tailwind v4 · PostgreSQL · Prisma 7**. Authentication is built in (bcrypt
passwords, httpOnly session cookies, hashed session tokens).

## Who uses it

| Area | Who | What they see |
| --- | --- | --- |
| `/app` | Agency staff | Dashboard, leads (pipeline and list), clients, projects and tasks, tickets, quotations, invoices, care plans, settings |
| `/portal` | An agency's clients | Only their own company's projects, requests, quotations, invoices and care-plan usage |
| `/admin` | Platform admin (you) | Create agencies, choose each one's modules, suspend. Record counts only, never an agency's data |
| `/q/…`, `/i/…` | Anyone with the link | A public quotation (view, download, accept or decline) or invoice |

## How isolation works

- **One database, every business row tagged with `organizationId`.** All tenant queries go through `withTenant()`
  (`src/lib/tenant.ts`), a Prisma extension that adds the organisation to every `where` clause and forces it on every
  create. If someone opens another agency's record by its id, the lookup finds nothing and they get a 404.
- **Referenced ids are checked in every action.** When a user picks a client, project, stage, tax rate and so on,
  the action confirms it belongs to their organisation before saving.
- **Clients are pinned to their own company.** Portal queries also filter by the member's `clientId`. Projects and
  tasks must be marked *visible to client*, and internal ticket notes are never loaded for client users.
- **Record-level scope.** A staff role can be set to *Assigned only*, so its members see only the leads they own,
  the projects they manage or belong to, and the tickets assigned to them.
- **Tests:** `npm test` runs against a real database and proves two agencies can't read, change, delete or spoof
  each other's rows. It also covers concurrent document numbering, totals maths and care billing periods.

## RBAC

Permissions are a fixed catalogue (`src/lib/permissions.ts`, mirrored into the `Permission` table). Each agency gets
five built-in roles (Owner, Admin, Manager, Team member, Client) and can create its own roles with a permission
matrix (Settings → Roles).

A permission only takes effect when its module is switched on for the agency. For example, `careplans:*` does
nothing for an agency without the Care plans module. The Owner role always keeps every permission, and the last
active owner can't be demoted or disabled.

## Modules per agency

The platform admin turns modules on or off for each agency: Leads, Projects, Tickets, Quotations, Invoices,
**Care plans** and Client portal. Care plans are on for EasyWebSolns and off for new agencies by default. When a
module is off, its menu items, pages, permissions and actions are all disabled.

## Quotations and invoices (built in)

Quotes and invoices are built into HQ rather than bolted on from an outside generator, because the CRM already
has the client, the lead, the service catalogue and the payment terms.

- **Auto-generated:** "Create quotation" from a lead or client pre-fills the recipient, title, validity date,
  default terms and payment term. You then pick a **package** (e.g. Professional Website) or catalogue items, and
  totals, discounts and tax are worked out automatically. Numbers come from each agency's own sequence
  (`Q-0001`, `INV-0001`, …), assigned atomically.
- **Share and accept:** each document has an unguessable public link. The client can accept online by typing
  their name, and the acceptance is recorded with a timestamp.
- **Convert:** turn an accepted quote into a full invoice, a deposit invoice (the payment term's deposit %) and
  later a balance invoice. Record payments and the status updates to Partially paid or Paid.
- **PDF:** every document has print-ready styling. Use "Download PDF / Print".
- **Care billing:** "Invoice next period" on a subscription creates that month's invoice and moves the billing
  date forward.

## Care plans

For each subscription you track the client, the plan (Basic / Plus / Priority, each with its included hours),
the website covered, the **billing day** and **next billing date**, **update hours used this billing month**
against the allowance (with an over-allowance warning), and the **change-request log**. Change requests are
tickets linked to the plan, and the time logged on them counts toward the hours used. Clients see the same usage
in their portal.

## Masters

These are editable per agency under Settings → Masters: lead sources, pipeline stages (open/won/lost, probability,
colour), project statuses, ticket statuses, ticket priorities (with SLA hours that set due dates), ticket categories
(marked as change requests or not), tax rates, payment terms (due days and deposit %), the services catalogue and
packages. Currencies and permissions are global masters.

## Database

`prisma/schema.prisma` is the source of truth, and migrations live in `prisma/migrations`.

- **Global:** `User`, `Session`, `Organization`, `OrganizationFeature`, `Permission`, `Currency`
- **Access:** `Role`, `RolePermission`, `Membership` (staff or client, linked to a client company), `Invitation`
- **Masters:** `LeadSource`, `PipelineStage`, `ProjectStatus`, `TicketStatus`, `TicketPriority`, `TicketCategory`,
  `TaxRate`, `ServiceItem`, `Package`, `PackageItem`, `PaymentTerm`, `NumberSequence`
- **CRM:** `Client`, `Contact`, `Lead`, `Activity` (timeline and follow-ups for any record)
- **Delivery:** `Project`, `ProjectMember`, `Task`, `Ticket`, `TicketComment`
- **Sales:** `Quotation`, `QuotationItem`, `Invoice`, `InvoiceItem`, `Payment`
- **Care:** `CarePlan`, `CareSubscription`, `CareTimeLog`
- **Audit:** `AuditLog`

## Run it locally

```bash
cd hq
cp .env.example .env          # set DATABASE_URL to a PostgreSQL database
npm install                   # also generates the Prisma client
npm run db:deploy             # create the tables
npm run db:seed               # permissions, currencies, platform admin, EasyWebSolns + its catalogue & care plans
npm run db:seed:demo          # optional: labelled demo data and a second demo agency
npm run dev                   # http://localhost:3000
```

Seeded login: `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env` (defaults `admin@easywebsolns.com` /
`ChangeMe!2026`; **change it** under Account). The demo seed also creates `designer@demo.test` (team member),
`client@demo.test` (client portal) and `owner@northwind.demo.test` (another agency), all with password `Demo!2026`.

Other scripts: `npm test`, `npm run lint`, `npm run typecheck`, `npm run db:migrate` (after schema changes) and
`npm run db:studio`.

## Deploy on Vercel (as a second project)

The `vercel-build` script applies migrations and runs the (idempotent) base seed on every deploy, so no commands are
needed on your computer.

1. Vercel → **Add New → Project** → import this repo → **Root Directory: `hq`** (framework: Next.js).
2. Environment variables: `SEED_ADMIN_EMAIL` (your login email) and `SEED_ADMIN_PASSWORD` (your first password).
   Optional: `APP_URL=https://hq.easywebsolns.com` (otherwise links use the address the app is opened on).
3. Add a database: project → **Storage → Create Database → Neon (Postgres)** → connect it to the project. This sets
   `DATABASE_URL` (and `DATABASE_URL_UNPOOLED`, used for migrations) automatically. Any other PostgreSQL works if you
   set `DATABASE_URL` yourself.
4. **Deployments → Redeploy.** Sign in at the `.vercel.app` address and change your password under Account.
5. Domain: **Settings → Domains → add `hq.easywebsolns.com`**, then in Hostinger DNS add a **CNAME** record, name
   `hq`, pointing to the value Vercel shows.

## Hardening roadmap

- PostgreSQL row-level security as a second isolation layer under the Prisma extension
- Transactional email (Resend) for invitations, quotation, invoice and ticket notifications (today, invitation and
  document links are copied and sent by you)
- Online card payments (e.g. Stripe or Razorpay payment links) on public invoices
- File attachments on tickets and projects (Vercel Blob or S3)
- Two-factor authentication for staff
