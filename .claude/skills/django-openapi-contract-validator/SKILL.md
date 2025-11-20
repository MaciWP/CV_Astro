---
name: openapi-contract-validator
description: Validates Django REST Framework endpoints against OpenAPI specification. This skill should be used when implementing or modifying API endpoints to ensure request/response schemas, status codes, authentication, and parameters match the contract specification.
activation:
  keywords:
    - openapi
    - contract validation
    - api compliance
    - endpoint validation
    - schema validation
    - contract-first
    - api contract
  triggers:
    - class.*ViewSet
    - @action
    - serializers.Serializer
    - Response(
    - status.HTTP_
---

# OpenAPI Contract Validator

Ensures Django REST Framework endpoints match the OpenAPI specification in binora-contract submodule.

**Version**: 1.0.0

## What This Skill Does
- Validates request/response schemas match contract
- Checks status codes compliance
- Verifies authentication requirements
- Validates parameter definitions
- Ensures endpoint paths match spec

## Critical Rules

### 1. Contract-First Development
- OpenAPI spec is source of truth
- Implementation must match contract exactly
- NO deviations without contract update first

### 2. Schema Validation
- Request bodies match input schemas
- Response bodies match output schemas
- Field types must be exact (string, integer, etc.)
- Required fields enforced

### 3. Status Codes
- Success: 200/201/204 as per contract
- Errors: 400/401/403/404/500 as per contract
- NO custom status codes without contract update

## Quick Reference

**Validate endpoint**: `apps/core/views/user.py:23`
**Contract location**: `binora-contract/openapi.yaml`
**Check script**: `/check-contract [app]`

## Structure
- examples/ - Real contract validation scenarios
- checklists/ - Validation procedures
- templates/ - Compliant endpoint templates
- references/ - Contract-first guide

See individual files for details.
