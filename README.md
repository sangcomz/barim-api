# Barim API

External Plugin API Server for Barim ecosystem.

## Authentication

All API endpoints require GitHub Personal Access Token authentication.

```bash
Authorization: Bearer <your-github-access-token>
```

## API Reference

### Projects

Manage GitHub-based projects using labels with "project:" prefix.

#### List Projects
```http
GET /api/projects
```

**Response Example:**
```json
{
  "projects": [
    {
      "name": "barim-app",
      "label": "project:barim-app",
      "color": "ededed",
      "description": "Project: barim-app",
      "issueCount": 24
    }
  ]
}
```

#### Create Project
```http
POST /api/projects
```

**Request Body:**
```json
{
  "projectName": "string",
  "description": "string?"
}
```

**Response:**
```json
{
  "project": {
    "name": "MyProject",
    "label": "project:MyProject",
    "color": "ff5733",
    "issueCount": 0
  }
}
```

### Issues

Manage tasks and notes as GitHub issues.

#### List Issues
```http
GET /api/issues?repo=<project_name>&page=<page>
```

**Query Parameters:**
- `repo` *(required)* - Project name to filter issues
- `page` *(optional)* - Page number (default: 1)

#### Create Issue
```http
POST /api/issues
```

**Request Body:**
```json
{
  "title": "string",
  "body": "string?",
  "issueType": "Task" | "Note",
  "repo": "string",
  "tags": ["string"]?
}
```

#### Update Issue
```http
POST /api/issues/{issue_number}
```

Update issue state, labels, or other properties.

#### Add Comment
```http
POST /api/issues/{issue_number}/comments
```

**Request Body:**
```json
{
  "body": "string"
}
```

### Repositories

Access GitHub repositories.

#### List Repositories
```http
GET /api/repos
```

Get list of user's GitHub repositories (excluding barim-data).

#### Get Repository
```http
GET /api/repos/{repository_name}
```

Get detailed information about a specific repository.

## Status Codes

| Code | Description |
|------|-------------|
| `200` | OK - Request successful |
| `201` | Created - Resource created |
| `400` | Bad Request - Invalid parameters |
| `401` | Unauthorized - Invalid token |
| `409` | Conflict - Resource already exists |
| `500` | Internal Server Error |