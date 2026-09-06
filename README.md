# RentFlow Client

The RentFlow client is an Angular application for a property rental and tenancy management platform. It provides role-aware workflows for public visitors, tenants, property owners, and administrators while delegating authentication, authorization, and business rules to the RentFlow API.

## Product Scope

Implemented client workflows include:

- Public discovery of published properties and available units.
- Tenant registration, authentication, application submission, tracking, and withdrawal.
- Owner property and unit management.
- Owner review, approval, and rejection of rental applications.
- Administrator user-status management and platform oversight.
- JWT authentication with access-token refresh handling.
- Role-protected routes for Owner, Tenant, and Admin areas.

The client does not bypass backend rules. The API remains authoritative for identity, permissions, ownership checks, resource state, and validation.

## Technology Stack

- Angular 22
- TypeScript 6
- RxJS 7
- Angular Router
- Angular Reactive Forms
- Vitest through the Angular CLI

## Prerequisites

- Node.js compatible with Angular 22
- npm 10 or later
- A running RentFlow API

The backend repository and setup instructions are maintained separately in `rentflow-api`.

## Installation

Install the exact dependency versions recorded in the lockfile:

```bash
npm ci
```

## Environment Configuration

Angular uses file replacement for environment-specific API configuration:

| Build mode  | Configuration file                            | Default API URL                 |
| ----------- | --------------------------------------------- | ------------------------------- |
| Development | `src/environments/environment.development.ts` | `http://localhost:5118/api/v1`  |
| Production  | `src/environments/environment.ts`             | `https://localhost:7249/api/v1` |

The local API CORS policy allows requests from:

```text
http://localhost:4200
http://127.0.0.1:4200
```

Do not place passwords, JWT signing keys, access tokens, refresh tokens, or other secrets in the client source tree.

## Local Development

Start the API first using its documented launch profile. Then, from this repository, run:

```bash
npm start
```

The development server is available at:

```text
http://localhost:4200
```

## Application Routes

| Route             | Access        | Responsibility                                       |
| ----------------- | ------------- | ---------------------------------------------------- |
| `/`               | Public        | Published property listings                          |
| `/properties/:id` | Public        | Property details, units, and tenant application form |
| `/login`          | Public        | Account authentication                               |
| `/register`       | Public        | Owner or tenant registration                         |
| `/owner`          | Active Owner  | Properties, units, and rental applications           |
| `/tenant`         | Active Tenant | Tenant application tracking                          |
| `/admin`          | Active Admin  | User and platform administration                     |

Route guards improve the user experience, but they are not a security boundary. Every protected request is also authorized by the API.

## Role Workflows

### Public visitor

1. Browse published properties.
2. Inspect property details and available units.
3. Register or sign in to continue as a tenant or owner.

### Tenant

1. Register an account.
2. Wait for administrator activation.
3. Sign in again after activation.
4. Submit an application for an available unit.
5. Track or withdraw an eligible application.

### Owner

1. Register an account.
2. Wait for administrator activation.
3. Create and manage properties.
4. Create and manage units.
5. Publish a property.
6. Review, approve, or reject tenant applications.

### Administrator

1. Review registered users.
2. Activate, suspend, or deactivate accounts.
3. Review platform properties and applications.

## Project Structure

```text
src/
  app/
    core/
      guards/          Route authorization
      interceptors/    JWT request and refresh handling
      models/          API-aligned TypeScript models
      services/        Backend-facing HTTP services
    features/
      auth/            Login and registration
      admin/           Administrator dashboard
      owner/           Owner dashboard
      public/          Property listings and details
      tenant/          Tenant dashboard
  environments/        Development and production API configuration
  styles.scss          Global styles
```

Feature components should use core services and models rather than duplicating HTTP calls or API contracts inside templates.

## Validation Commands

Build the production bundle:

```bash
npm run build
```

Run unit tests:

```bash
npm test
```

Run the development server:

```bash
npm start
```

Before committing:

```bash
git status
```

## Demonstration Flow

For a project demonstration, use this end-to-end sequence:

```text
Browse properties
  -> Register tenant
  -> Administrator activates tenant
  -> Tenant signs in again
  -> Submit rental application
  -> Owner reviews application
  -> Owner approves or rejects application
```

Run the API and client in separate terminals. Do not display credentials, tokens, or local secret configuration during screen recording.

## Known Limitations

The following capabilities are outside the current client scope:

- Online payments
- Maintenance management
- Notifications and document management
- Server-side property search and filtering
- Dedicated tenancy management screens
- Automated end-to-end browser tests

Approved applications create tenancies in the API, but the client does not yet expose a dedicated tenancy dashboard.

## Contribution Guidelines

Keep changes focused on one feature or maintenance concern. Before opening a pull request:

1. Run `npm run build`.
2. Run `npm test` when tests cover the changed area.
3. Verify the affected workflow against a running API.
4. Review the diff for credentials, generated files, and unrelated formatting changes.
5. Use a commit message that describes the user-visible or architectural change.

## Related Repository

The ASP.NET Core backend is maintained in the sibling `rentflow-api` repository.
