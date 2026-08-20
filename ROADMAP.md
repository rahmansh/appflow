# AppFlow Roadmap

AppFlow started as a simple MVP (CRUD job application tracker). This roadmap
tracks features to add on top of it — partly to make it a stronger showcase
project, and partly as a sandbox for learning new things (AWS, testing,
auth, etc.) by implementing them for real.

Check items off as they're completed. Feel free to reorder — suggested
priority is noted per section.

## Backend / Software Engineering Depth

- [ ] **Auth (JWT or sessions)** — add user accounts, scope `Job` documents to a `userId`.
      Highest priority: unlocks realistic per-user data and is a strong resume item.
- [ ] **Validation layer** (Zod or Joi) instead of relying on Mongoose schema validation alone
- [ ] **Backend pagination + search/filter** on `/api/jobs` (currently likely all client-side)
- [ ] **Testing**
  - [ ] Jest/Vitest + Supertest for the API (controllers, routes)
  - [ ] React Testing Library for frontend components/pages
- [ ] **Error handling middleware** (centralized, consistent error responses)
- [ ] **Request logging** (winston or pino)
- [ ] **Rate limiting** on the API

## AWS Learning Path

Suggested order: easiest/cheapest first, building toward a full IaC + CI/CD setup.

- [ ] **S3 + CloudFront** — host the frontend as a static site with a CDN
- [ ] **Secrets Manager / SSM Parameter Store** — move `MONGO_URI` and other secrets out of `.env` in prod
- [ ] **Elastic Beanstalk or ECS Fargate** — host the backend (skip raw EC2)
- [ ] **DynamoDB or RDS (Postgres)** — migrate off MongoDB Atlas, learn NoSQL vs relational tradeoffs + IAM roles
- [ ] **S3 presigned URLs** — file uploads (e.g. attach a resume/cover letter per job)
- [ ] **CI/CD** — GitHub Actions (or CodePipeline) deploying to AWS on push
- [ ] **Infra as Code** — Terraform or AWS CDK for everything above (the real differentiator over manual console setup)
- [ ] **Load balancing + autoscaling** on the backend service

## Frontend Polish

- [ ] Loading and error states across pages
- [ ] Optimistic UI updates (add/edit/delete without waiting on round-trip)
- [ ] Dashboard charts (application trends over time)
- [ ] Better empty states
- [ ] Dark mode

## Notes

- Don't build everything at once — incremental, well-explained commits/PRs
  are a better interview story than one giant rewrite.
- Suggested sequencing: **Auth → Tests for existing features → one AWS
  migration (S3+CloudFront) → deeper AWS (ECS/Fargate + RDS) → Terraform.**

## Beyond This Project

This project alone won't be enough to land an AWS/cloud-focused role — it's
one leg of a three-legged stool. Track these alongside it:

- [ ] **AWS certification** — start with Cloud Practitioner or Solutions
      Architect Associate. Many job postings filter on this directly (ATS/
      recruiter screens), especially without prior professional cloud
      experience. Higher leverage than extending this project further once
      the core AWS migration items above are done.
- [ ] **A second, differently-shaped project** — this one is CRUD/request-
      response. A good complement is something event-driven, e.g. Lambda
      triggered by an S3 upload, or an SQS/SNS-based pipeline. Shows range
      beyond "CRUD app on a server."
- [ ] **Observability** — CloudWatch alarms/dashboards, X-Ray tracing.
      Not covered by the AWS migration steps above but commonly expected
      for DevOps/cloud/SRE-leaning roles.
