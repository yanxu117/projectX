# Spinwheel API 规范 v1.0

**Status:** Draft
**Created:** 2026-02-18

---

## 1. 概述

Spinwheel API 定义了 CEO 和 CTO 之间的任务编排接口。

---

## 2. 数据模型

### 2.1 Task（任务）

```typescript
interface Task {
  id: string;                    // 任务 ID (Issue 编号)
  type: 'epic' | 'subtask' | 'follow-up';
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: AgentRole;
  parent_id?: string;            // 父任务 ID
  deadline?: string;             // ISO 8601 格式
  created_at: string;
  updated_at: string;
  labels: string[];
  acceptance_criteria: string[];
}

type TaskStatus = 
  | 'pending'
  | 'acknowledged'
  | 'in_progress'
  | 'review'
  | 'revision'
  | 'completed';

type Priority = 'P0' | 'P1' | 'P2' | 'P3';

type AgentRole = 'ceo' | 'cto';
```

### 2.2 Comment（评论）

```typescript
interface Comment {
  id: string;
  task_id: string;
  author: AgentRole;
  content: string;
  created_at: string;
  metadata?: {
    type?: 'confirmation' | 'progress' | 'review' | 'rejection';
    pr_number?: number;
    commit_sha?: string;
  };
}
```

### 2.3 PullRequest（拉取请求）

```typescript
interface PullRequest {
  id: number;
  task_id: string;
  title: string;
  description: string;
  branch: string;
  status: 'open' | 'merged' | 'closed';
  author: AgentRole;
  reviewers: AgentRole[];
  created_at: string;
  merged_at?: string;
}
```

---

## 3. API 端点

### 3.1 任务管理

#### 创建 Epic

```http
POST /api/spinwheel/epic
Content-Type: application/json

{
  "title": "开发用户管理模块",
  "description": "实现用户注册、登录、权限管理功能",
  "priority": "P1"
}
```

**响应：**
```json
{
  "id": "20",
  "type": "epic",
  "title": "开发用户管理模块",
  "status": "pending",
  "assignee": "cto",
  "created_at": "2026-02-18T10:00:00Z"
}
```

#### 创建 Sub-task

```http
POST /api/spinwheel/subtask
Content-Type: application/json

{
  "parent_id": "20",
  "title": "实现用户注册 API",
  "description": "POST /api/auth/register",
  "priority": "P1",
  "deadline": "2026-02-19T12:00:00Z"
}
```

#### 获取任务

```http
GET /api/spinwheel/tasks?status=pending&assignee=cto
```

#### 更新任务状态

```http
PATCH /api/spinwheel/tasks/21
Content-Type: application/json

{
  "status": "acknowledged"
}
```

#### 添加评论

```http
POST /api/spinwheel/tasks/21/comments
Content-Type: application/json

{
  "author": "cto",
  "content": "✅ 收到任务！开始执行。",
  "metadata": {
    "type": "confirmation"
  }
}
```

---

### 3.2 PR 管理

#### 提交 PR

```http
POST /api/spinwheel/pr
Content-Type: application/json

{
  "task_id": "21",
  "title": "feat: Add user registration API",
  "description": "Closes #21",
  "branch": "feature/user-register-api"
}
```

#### 审查 PR

```http
POST /api/spinwheel/pr/30/review
Content-Type: application/json

{
  "action": "approve" | "reject",
  "reviewer": "ceo",
  "reason": "需要改进" // 仅当 reject 时
}
```

---

### 3.3 查询

#### 获取待处理任务

```http
GET /api/spinwheel/pending?agent=cto
```

**响应：**
```json
{
  "tasks": [
    {
      "id": "21",
      "title": "实现用户注册 API",
      "priority": "P1",
      "deadline": "2026-02-19T12:00:00Z"
    }
  ]
}
```

#### 获取进展统计

```http
GET /api/spinwheel/stats
```

**响应：**
```json
{
  "total": 10,
  "completed": 3,
  "in_progress": 2,
  "pending": 5,
  "overdue": 1
}
```

---

## 4. Webhooks

### 4.1 任务创建

```json
POST /webhook/spinwheel/task-created
{
  "event": "task.created",
  "task": { ... },
  "timestamp": "2026-02-18T10:00:00Z"
}
```

### 4.2 状态变更

```json
POST /webhook/spinwheel/status-changed
{
  "event": "task.status_changed",
  "task_id": "21",
  "old_status": "pending",
  "new_status": "acknowledged",
  "timestamp": "2026-02-18T10:05:00Z"
}
```

### 4.3 PR 提交

```json
POST /webhook/spinwheel/pr-submitted
{
  "event": "pr.submitted",
  "pr": { ... },
  "task_id": "21",
  "timestamp": "2026-02-18T12:00:00Z"
}
```

---

## 5. 错误处理

### 5.1 错误格式

```json
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task #99 not found",
    "details": {}
  }
}
```

### 5.2 错误代码

| 代码 | 含义 |
|------|------|
| `TASK_NOT_FOUND` | 任务不存在 |
| `INVALID_STATUS` | 无效的状态转换 |
| `UNAUTHORIZED` | 无权限 |
| `VALIDATION_ERROR` | 验证失败 |
| `DEADLINE_PASSED` | 已过截止时间 |

---

## 6. 速率限制

- **标准限制：** 100 请求/分钟
- **通知限制：** 10 通知/分钟

---

## 7. 实现说明

### 7.1 当前实现

- **存储：** GitHub Issues
- **API：** GitHub REST API v3
- **通知：** OpenClaw sessions_send
- **自动化：** Cron jobs

### 7.2 未来实现

- **存储：** SQLite 数据库
- **API：** Express REST API
- **通知：** WebSocket 实时推送
- **自动化：** 事件驱动

---

*最后更新：2026-02-18*
