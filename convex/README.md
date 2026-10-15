# Figart account storage

This directory contains Figart's Convex schema, Clerk authentication
configuration, and account-file operations. Browser-only documents use
`lib/design/storage.ts` and do not require an account save.

## Files

| File             | Responsibility                                                 |
| ---------------- | -------------------------------------------------------------- |
| `schema.ts`      | The `designs` table and its owner/update index                 |
| `designs.ts`     | Authenticated queries and mutations, validation, and revisions |
| `auth.config.ts` | Clerk JWT issuer and the `convex` application ID               |
| `_generated/`    | Convex-generated client API, server helpers, and data types    |

## Configuration

The frontend reads `NEXT_PUBLIC_CONVEX_URL` and mounts
`ConvexProviderWithClerk` in `app/ConvexClientProvider.tsx`. Clerk supplies the
signed-in identity. Set up Clerk's `convex` JWT template and configure
`CLERK_JWT_ISSUER_DOMAIN` on the corresponding Convex deployment. It must match
the issuer used by that template.

Account editing requires the schema and functions to be provisioned in the
selected deployment. A running Next.js server alone does not provision them.
Use a separate development deployment for backend development. Do not run
`convex dev`, deploy schema changes, or write test records against an existing
production deployment as a local check. Do not remove old remote tables or data
as part of documentation updates or frontend testing.

## Data model

The `designs` table stores:

| Field       | Meaning                                                             |
| ----------- | ------------------------------------------------------------------- |
| `owner`     | Authenticated Clerk identity subject                                |
| `title`     | File title mirrored from the editable document                      |
| `document`  | Complete validated design document                                  |
| `updatedAt` | Last content/title update timestamp                                 |
| `revision`  | Optional revision counter; older missing values are treated as zero |
| `starred`   | Optional favorite flag                                              |
| `trashedAt` | Optional trash timestamp                                            |

`by_owner_updated` indexes `owner` and `updatedAt`. Embedded images are part of
the document; these functions do not upload them to a separate storage service.

## API behavior

| Function                 | Behavior                                                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `designs.list`           | Lists the current owner's files, including trash; returns an empty list to guests                                      |
| `designs.get`            | Returns an owned, non-trashed file; returns null for unavailable or unauthorized files                                 |
| `designs.create`         | Validates the document, derives the owner from authentication, and creates revision zero                               |
| `designs.save`           | Checks ownership, trash status, and expected revision, then saves the document and returns the new revision            |
| `designs.updateMetadata` | Updates favorites, trash state, or title after checking ownership; title changes also update the document and revision |
| `designs.remove`         | Permanently deletes an owned file only after it has been moved to trash                                                |

Clients do not choose an owner. Changing a route ID must never give access to
another user's document. Mutations reject unauthorized operations rather than
returning a successful-looking result.

## Validation and conflicts

Both creation and saving normalize documents using
`lib/design/document.ts`. Validation checks supported fields, finite geometry,
node identity, and parent relationships, including hierarchy cycles. The
normalized JSON must fit within 900,000 UTF-8 bytes. The editor separately limits
individual embedded account images to 350,000 bytes; the total document limit
still applies when several images are included.

Saving requires `expectedRevision`. If it differs from the stored revision, the
mutation rejects the save instead of overwriting newer work from another tab.
Title changes also increment the revision. Favorite and trash changes do not
increment the content revision.

The editor writes browser recovery data around account saves. On a failed save,
it retains pending recovery data and reports the error. On a later open, the
loader can offer a pending browser copy that differs from the account document.
Public template-copy actions create a local backup before attempting account
creation. These browser copies are recovery data, not proof of a successful
cloud save.

## Local verification

```sh
npm run test:design
```

`tests/database.test.mjs` exercises the real query and mutation handlers against
a local fake database and authentication context. It covers ownership, guest
behavior, revisions, metadata, trash, deletion, and invalid documents. These
checks do not deploy functions or access a remote database. Separate tests cover
creation backups, the document model, and local editor loading.

See the [project README](../README.md) for frontend setup, routes, supported
features, and broader validation commands.
