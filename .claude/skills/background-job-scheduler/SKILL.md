---
name: background-job-scheduler
description: |
  This skill builds background job processing systems with queues, retries, and scheduling.
  Supports Python (Celery, RQ, Dramatiq), Node.js/Bun (Bull, BullMQ), with Redis/RabbitMQ backends.
  Creates async tasks, scheduled jobs (cron), retry logic, error handling, and monitoring.
  Activate when user says "background jobs", "async tasks", "queue system", "scheduled tasks", "process emails".
  Output: Complete job system with workers, queues, retries, monitoring, and deployment config.
---

# Background Job Scheduler

> **Purpose**: Build async task processing with queues, retries, and scheduling

---

## When to Use This Skill

Activate when:
- ✅ Need to process tasks asynchronously (don't block API response)
- ✅ Send emails, generate reports, process images/videos
- ✅ Scheduled tasks (cron jobs): daily reports, cleanup, backups
- ✅ Long-running tasks (>5 seconds)
- ✅ User says: "background job", "async task", "queue", "scheduled task"
- ✅ Examples: "send welcome email after signup", "generate PDF report", "process video upload"

---

## What This Skill Does

**Generates job processing system with**:
1. **Task definitions** - Define async tasks
2. **Queue management** - Redis/RabbitMQ queues
3. **Worker processes** - Background workers to process jobs
4. **Retry logic** - Exponential backoff on failures
5. **Scheduled tasks** - Cron-style periodic jobs
6. **Priority queues** - High/medium/low priority
7. **Monitoring** - Job status, failures, metrics
8. **Error handling** - Dead letter queues, alerting

---

## Supported Technologies

### Python
- **Celery** (recommended) - Most popular, feature-rich
- **RQ (Redis Queue)** - Simple, Redis-backed
- **Dramatiq** - Fast, reliable, Redis/RabbitMQ

### Node.js / Bun
- **BullMQ** (recommended) - Modern, TypeScript-first
- **Bull** - Popular, Redis-backed
- **Bee-Queue** - Simple, fast

### Message Brokers
- **Redis** (recommended) - Fast, simple setup
- **RabbitMQ** - Enterprise, more features
- **AWS SQS** - Managed, serverless

---

## Pattern 1: Celery (Python) - Email Sending

### Setup

```python
# celery_app.py
from celery import Celery
import os

# Create Celery app
app = Celery(
    'tasks',
    broker=os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
    backend=os.getenv('REDIS_URL', 'redis://localhost:6379/0')
)

# Configuration
app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,  # 5 minutes max
    worker_prefetch_multiplier=4,
    worker_max_tasks_per_child=1000
)
```

### Task Definitions

```python
# tasks.py
from celery_app import app
from typing import List
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import time

@app.task(bind=True, max_retries=3, default_retry_delay=60)
def send_email(self, to: str, subject: str, body: str):
    """
    Send email asynchronously with retry logic

    Args:
        to: Recipient email
        subject: Email subject
        body: Email body (HTML or plain text)

    Retries: 3 times with 60s delay
    """
    try:
        # Email configuration
        smtp_host = 'smtp.gmail.com'
        smtp_port = 587
        smtp_user = os.getenv('SMTP_USER')
        smtp_password = os.getenv('SMTP_PASSWORD')

        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = smtp_user
        msg['To'] = to
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))

        # Send email
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)

        return {'status': 'sent', 'to': to}

    except Exception as exc:
        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))

@app.task
def send_welcome_email(user_id: int):
    """Send welcome email to new user"""
    from models import User
    user = User.query.get(user_id)

    subject = f"Welcome to our platform, {user.name}!"
    body = f"""
    <h1>Welcome {user.name}!</h1>
    <p>Thank you for joining our platform.</p>
    <p>Get started by visiting your dashboard.</p>
    """

    send_email.delay(user.email, subject, body)

@app.task
def send_bulk_emails(user_ids: List[int], subject: str, body: str):
    """Send bulk emails (spawns multiple tasks)"""
    from models import User
    users = User.query.filter(User.id.in_(user_ids)).all()

    for user in users:
        personalized_body = body.replace('{{name}}', user.name)
        send_email.delay(user.email, subject, personalized_body)

    return {'total': len(users), 'status': 'queued'}

@app.task(bind=True, max_retries=5)
def generate_pdf_report(self, user_id: int, report_type: str):
    """Generate PDF report (long-running task)"""
    try:
        from reportlab.pdfgen import canvas
        import io

        # Simulate long-running task
        time.sleep(10)

        # Generate PDF
        buffer = io.BytesIO()
        pdf = canvas.Canvas(buffer)
        pdf.drawString(100, 750, f"Report for user {user_id}")
        pdf.save()

        # Upload to S3 or save to disk
        filename = f"report_{user_id}_{report_type}.pdf"
        with open(f"/reports/{filename}", 'wb') as f:
            f.write(buffer.getvalue())

        return {'status': 'generated', 'filename': filename}

    except Exception as exc:
        raise self.retry(exc=exc, countdown=120)

@app.task
def process_video_upload(video_id: int):
    """Process uploaded video (thumbnails, transcoding)"""
    from models import Video
    video = Video.query.get(video_id)

    try:
        # Generate thumbnail
        thumbnail_path = extract_thumbnail(video.path)
        video.thumbnail_url = upload_to_s3(thumbnail_path)

        # Transcode to multiple resolutions
        transcode_video.delay(video_id, '720p')
        transcode_video.delay(video_id, '1080p')

        video.status = 'processing'
        db.session.commit()

        return {'status': 'processing', 'video_id': video_id}

    except Exception as exc:
        video.status = 'failed'
        db.session.commit()
        raise exc
```

### Usage in API

```python
from fastapi import APIRouter, BackgroundTasks
from tasks import send_email, send_welcome_email, generate_pdf_report

router = APIRouter()

@router.post("/users", status_code=201)
async def create_user(user: UserCreate):
    """Create user and send welcome email asynchronously"""
    # Create user in database
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()

    # Queue welcome email (non-blocking)
    send_welcome_email.delay(db_user.id)

    return {"id": db_user.id, "message": "User created, welcome email queued"}

@router.post("/reports/{user_id}")
async def request_report(user_id: int, report_type: str):
    """Generate PDF report asynchronously"""
    # Queue report generation
    task = generate_pdf_report.delay(user_id, report_type)

    return {
        "task_id": task.id,
        "status": "queued",
        "message": "Report generation started"
    }

@router.get("/tasks/{task_id}")
async def get_task_status(task_id: str):
    """Check task status"""
    from celery.result import AsyncResult

    task = AsyncResult(task_id)

    return {
        "task_id": task_id,
        "status": task.state,
        "result": task.result if task.ready() else None,
        "error": str(task.info) if task.failed() else None
    }
```

### Scheduled Tasks (Celery Beat)

```python
# celery_app.py
from celery.schedules import crontab

app.conf.beat_schedule = {
    # Daily report at 9 AM
    'daily-report': {
        'task': 'tasks.generate_daily_report',
        'schedule': crontab(hour=9, minute=0)
    },

    # Cleanup old files every hour
    'cleanup-old-files': {
        'task': 'tasks.cleanup_old_files',
        'schedule': crontab(minute=0)  # Every hour
    },

    # Send weekly newsletter on Mondays
    'weekly-newsletter': {
        'task': 'tasks.send_weekly_newsletter',
        'schedule': crontab(day_of_week=1, hour=10, minute=0)
    },

    # Database backup every day at midnight
    'database-backup': {
        'task': 'tasks.backup_database',
        'schedule': crontab(hour=0, minute=0)
    }
}

# tasks.py
@app.task
def generate_daily_report():
    """Generate daily report at 9 AM"""
    from models import Order
    from datetime import datetime, timedelta

    yesterday = datetime.now() - timedelta(days=1)
    orders = Order.query.filter(Order.created_at >= yesterday).count()

    # Send report to admin
    send_email.delay(
        'admin@example.com',
        'Daily Report',
        f'<h1>Daily Report</h1><p>Orders yesterday: {orders}</p>'
    )

@app.task
def cleanup_old_files():
    """Delete files older than 30 days"""
    import os
    from datetime import datetime, timedelta

    cutoff = datetime.now() - timedelta(days=30)
    for filename in os.listdir('/tmp/uploads'):
        filepath = os.path.join('/tmp/uploads', filename)
        if os.path.getmtime(filepath) < cutoff.timestamp():
            os.remove(filepath)
```

---

## Pattern 2: BullMQ (Node.js/Bun)

### Setup

```typescript
// queue.ts
import { Queue, Worker, QueueScheduler } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null
});

// Create queues
export const emailQueue = new Queue('emails', { connection });
export const reportQueue = new Queue('reports', { connection });
export const videoQueue = new Queue('videos', { connection });

// Queue scheduler (for delayed/repeated jobs)
const emailScheduler = new QueueScheduler('emails', { connection });
const reportScheduler = new QueueScheduler('reports', { connection });
```

### Workers

```typescript
// workers.ts
import { Worker, Job } from 'bullmq';
import { emailQueue, reportQueue, videoQueue } from './queue';
import nodemailer from 'nodemailer';

// Email worker
const emailWorker = new Worker('emails', async (job: Job) => {
  const { to, subject, body } = job.data;

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html: body
    });

    return { status: 'sent', to };
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}, {
  connection,
  concurrency: 10,  // Process 10 emails in parallel
  limiter: {
    max: 100,  // Max 100 jobs
    duration: 60000  // Per minute
  }
});

// Report worker
const reportWorker = new Worker('reports', async (job: Job) => {
  const { userId, reportType } = job.data;

  // Simulate long-running task
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Generate report
  const filename = `report_${userId}_${reportType}.pdf`;
  // ... generate PDF ...

  return { status: 'generated', filename };
}, {
  connection,
  concurrency: 2  // Process 2 reports at a time (CPU-intensive)
});

// Error handling
emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
  // Send alert to Sentry, Slack, etc.
});

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

console.log('Workers started');
```

### Usage in API

```typescript
// api.ts
import { Hono } from 'hono';
import { emailQueue, reportQueue } from './queue';

const app = new Hono();

app.post('/users', async (c) => {
  const user = await c.req.json();

  // Create user
  const dbUser = await db.user.create({ data: user });

  // Queue welcome email
  await emailQueue.add('welcome-email', {
    to: dbUser.email,
    subject: `Welcome ${dbUser.name}!`,
    body: `<h1>Welcome!</h1>`
  }, {
    attempts: 3,  // Retry 3 times
    backoff: {
      type: 'exponential',
      delay: 5000  // Start with 5s delay
    }
  });

  return c.json({ id: dbUser.id, message: 'User created, email queued' }, 201);
});

app.post('/reports/:userId', async (c) => {
  const userId = parseInt(c.req.param('userId'));
  const { reportType } = await c.req.json();

  // Queue report generation with priority
  const job = await reportQueue.add('generate-report', {
    userId,
    reportType
  }, {
    priority: 1,  // High priority
    attempts: 5,
    backoff: 60000  // 1 minute retry delay
  });

  return c.json({ taskId: job.id, status: 'queued' });
});

app.get('/tasks/:taskId', async (c) => {
  const taskId = c.req.param('taskId');
  const job = await reportQueue.getJob(taskId);

  if (!job) {
    return c.json({ error: 'Task not found' }, 404);
  }

  return c.json({
    taskId,
    status: await job.getState(),
    progress: job.progress,
    result: job.returnvalue,
    error: job.failedReason
  });
});
```

### Scheduled Jobs (BullMQ)

```typescript
// scheduledJobs.ts
import { emailQueue, reportQueue } from './queue';

// Daily report at 9 AM
emailQueue.add('daily-report', {
  type: 'daily-report'
}, {
  repeat: {
    pattern: '0 9 * * *'  // Cron: 9 AM daily
  }
});

// Cleanup every hour
reportQueue.add('cleanup', {
  type: 'cleanup-old-files'
}, {
  repeat: {
    pattern: '0 * * * *'  // Cron: Every hour
  }
});

// Weekly newsletter on Mondays
emailQueue.add('weekly-newsletter', {
  type: 'newsletter'
}, {
  repeat: {
    pattern: '0 10 * * 1'  // Cron: Monday 10 AM
  }
});
```

---

## Best Practices

1. **Idempotency**
   - Tasks should be safe to retry (don't send duplicate emails)
   - Use unique identifiers to prevent duplicate processing

2. **Timeouts**
   - Set task time limits (5 minutes default)
   - Kill tasks that run too long

3. **Monitoring**
   - Track job success/failure rates
   - Set up alerts for failed jobs
   - Monitor queue sizes (detect bottlenecks)

4. **Resource Limits**
   - Limit concurrent workers (don't overwhelm database)
   - Use rate limiting for external APIs

5. **Error Handling**
   - Retry with exponential backoff
   - Move failed jobs to dead letter queue after max retries
   - Alert on critical failures

---

## Deployment

### Docker Compose (Celery)

```yaml
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  web:
    build: .
    command: uvicorn main:app --host 0.0.0.0 --port 8000
    ports:
      - "8000:8000"
    depends_on:
      - redis

  celery-worker:
    build: .
    command: celery -A celery_app worker --loglevel=info --concurrency=4
    depends_on:
      - redis
    deploy:
      replicas: 2  # Run 2 workers

  celery-beat:
    build: .
    command: celery -A celery_app beat --loglevel=info
    depends_on:
      - redis
```

---

## Integration with Other Skills

- **api-endpoint-builder** - Queue jobs from API endpoints
- **auth-flow-builder** - Send verification/reset emails
- **email-template-builder** - Use templated emails
- **cache-strategy-builder** - Cache job results

---

**Skill Version**: 1.0.0
**Technologies**: Python (Celery, RQ), Node/Bun (BullMQ, Bull), Redis, RabbitMQ
**Output**: Complete background job system with workers, queues, retries, scheduling, monitoring
