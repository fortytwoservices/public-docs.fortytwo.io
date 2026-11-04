# Synchronization

A connector import copies source data into connector objects. A full sync then
reads those objects and applies the customer's [sync rules](syncrules.md) to
create, change, delete or restore IAM Core objects. Importing data and
synchronizing it are separate jobs.

Each import or full sync runs as a sync job. Jobs are queued and claimed by a
worker, so the job history can show what ran, when it ran and which worker ran
it.

## How a job runs

Before creating a job, IAM Core checks that the connector is enabled and that
there is no similar job already waiting or running. Connector imports and full
syncs never overlap. A conflicting request is refused; it does not wait in the
queue behind the other job.

Once accepted, the job is saved with the status `pending` and a ticket is put
in a queue. A worker picks up the ticket and claims the job using its own ID.
The job becomes `processing`, and the ticket is removed from the queue
immediately. This prevents another worker from claiming the same job.

When the work finishes, the job is marked `completed` or `failed`. If the
worker crashes after claiming it, the job remains `processing` until it times
out. The ticket is not put back in the queue, so a crashed job is never run
again automatically.

## Failures

Some problems stop the whole run. These include an unavailable source system,
changed source-system credentials, an IAM Core object being edited during the
sync, or repeated database failures. A database version check prevents a sync
from overwriting changes made by someone else.

Other problems affect only one record, and the rest of the run continues:

| Problem | Result |
|-|-|
| A rule is faulty | The affected detail is left empty. |
| A record matches more than one IAM Core object | The ambiguous record is flagged rather than choosing an object. |
| A link cannot be resolved | The broken link is cleaned up. |
| An event fails | The failure is noted in the log. |

## Logs and history

Each worker writes a log for its job. The log includes the job and customer,
progress after every 1,000 records, each IAM Core object created, changed,
deleted or restored, and any warnings or errors.

Sync job history shows each job's status, the worker that ran it and when it
ran. Jobs remain in history for 30 days. The history does not explain why a job
failed; search the worker logs by job ID to investigate.

Use the preview tool to see, step by step, how one record would be synchronized
before diagnosing its result in a full run.

## Retries and timeouts

When the database is busy, IAM Core waits and retries automatically, up to
nine times. The version check prevents these retries from overwriting a newer
change made by another process.

A maintenance job checks for stuck jobs every 10 seconds. It marks a job
`timed out` if it has been `pending` for more than 15 minutes or
`processing` for more than two hours. Once timed out, a new job can be
started.

Failed jobs are not retried automatically. Create a new job to run the work
again. A full sync recalculates everything from scratch, so the next successful
full sync repairs the effects of an earlier failed run. Recycle bins allow
deleted data to be restored.