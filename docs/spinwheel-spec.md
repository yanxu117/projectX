# Spinwheel 任务编排规范 v1.0

**Status:** Draft
**Created:** 2026-02-18
**Authors:** Claw (CEO), Ryan (Chairman)

---

## 1. 概述

**Spinwheel（螺旋协作）** 是 Reality Distortion Education Technology 的多智能体任务编排协议，用于协调 CEO (Claw) 和 CTO (ProgrammerY) 之间的协作。

### 1.1 核心原则

1. **任务驱动** - 所有工作都从 Issue 开始
2. **分支开发** - 永远不在 main 分支直接修改
3. **清晰提交** - 使用 Conventional Commits 格式
4. **进度透明** - 在 Issue 中实时更新进度
5. **PR 审查** - 重大修改需要 PR 审查
6. **闭环迭代** - 不满足要求可以循环改进

---

## 2. 任务生命周期

```
Ryan 发布战略目标
       ↓
CEO 创建 Epic Issue
       ↓
CEO 分解为 Sub-task Issues
       ↓
CTO 确认任务
       ↓
CTO 创建 feature 分支
       ↓
CTO 开发并提交
       ↓
CTO 创建 Pull Request
       ↓
CEO 审查 PR
       ↓
    决策
    ↙  ↘
  通过  不通过
   ↓      ↓
 完成  Follow-up Issue
         ↓
      循环迭代
```

---

## 3. 任务格式

### 3.1 Epic Issue（父任务）

```markdown
# Epic: [任务名称]

## 战略目标

[Ryan 的原始需求]

## 分解任务

- [ ] #子任务1
- [ ] #子任务2
- [ ] #子任务3

## 验收标准

- [ ] 标准 1
- [ ] 标准 2

## 状态

🔄 进行中

---
*Created by CEO*
```

### 3.2 Sub-task Issue（子任务）

```markdown
# Sub-task: [具体任务]

## 父任务

Epic #父任务编号

## 任务描述

[具体要做什么]

## 技术要求

- 要求 1
- 要求 2

## 验收标准（Acceptance Criteria）

- [ ] 功能正常工作
- [ ] 无 Bug
- [ ] 代码质量符合标准
- [ ] 测试通过

## 截止时间

YYYY-MM-DD HH:MM (GMT+8)

## 执行流程

1. **确认任务**（1小时内）：回复 ✅ 并添加 `task:acknowledged` 标签
2. **创建分支**：`feature/[任务名称]`
3. **开发提交**：遵循 Conventional Commits
4. **创建 PR**：提交 Pull Request
5. **更新进度**：在 Issue 中评论进度

---
*Assigned to: @ProgrammerY*
*Created by: CEO*
```

---

## 4. 标签系统

### 4.1 任务状态标签

| 标签 | 含义 | 触发条件 |
|------|------|----------|
| `task` | 待处理任务 | CEO 创建任务 |
| `task:acknowledged` | CTO 已确认 | CTO 回复 ✅ |
| `task:in-progress` | 执行中 | CTO 开始开发 |
| `task:review` | 待审查 | CTO 提交 PR |
| `task:revision` | 需要修改 | CEO 审查不通过 |
| `task:completed` | 已完成 | CEO 审查通过 |

### 4.2 优先级标签

| 标签 | 含义 | 响应时间 |
|------|------|----------|
| `P0` | 紧急 | 24小时内 |
| `P1` | 高优先级 | 3天内 |
| `P2` | 中优先级 | 1周内 |
| `P3` | 低优先级 | 无明确截止时间 |

### 4.3 关系标签

| 标签 | 含义 |
|------|------|
| `epic` | 父任务 |
| `sub-task` | 子任务 |
| `follow-up` | 后续任务 |

---

## 5. 状态转换

```
pending → acknowledged (CTO 确认，1小时内)
acknowledged → in_progress (CTO 开始开发)
in_progress → review (CTO 提交 PR)
review → completed (CEO 审查通过)
review → revision (CEO 审查不通过)
revision → in_progress (CTO 修复)
```

---

## 6. 通信协议

### 6.1 通知格式

**CEO → CTO（新任务）**
```
📌 新任务通知 (Issue #N)

标题：[任务标题]

查看详情：https://github.com/yanxu117/projectX/issues/N

---
**请确认任务并在 1 小时内回复 ✅**
```

**CTO → CEO（完成）**
```
🚀 任务完成 (Issue #N)

PR 已提交：#PR编号

请 CEO 审查。

---
*ProgrammerY (CTO)*
```

**CEO → CTO（通过）**
```
✅ PR #N 已通过审查并合并

感谢 @ProgrammerY 的出色工作！

---
*Claw (CEO)*
```

**CEO → CTO（不通过）**
```
⚠️ PR #N 需要改进

原因：[具体原因]

Follow-up Issue: #M

请修复问题后重新提交。

---
*Claw (CEO)*
```

---

## 7. 自动化系统

### 7.1 Cron Jobs

| 任务 | 频率 | 脚本 |
|------|------|------|
| CTO 新任务检查 | 30分钟 | `check-cto-new-tasks.sh` |
| CEO 进展检查 | 30分钟 | `check-ceo-tasks.sh` |
| Spinwheel 追踪 | 15分钟 | `spinwheel/track.sh` |

### 7.2 智能特性

**活跃检测：**
- 如果 Agent 最近30分钟内活跃 → 跳过通知
- 如果 Agent 空闲 → 发送任务提醒

**任务去重：**
- 同一 Issue 只通知一次
- 状态文件记录已通知的 Issue

**超时升级：**
- 未确认任务（>1小时）→ 通知 CEO
- 超时任务（>截止时间）→ 通知 CEO

---

## 8. Conventional Commits 格式

### 8.1 提交类型

| 类型 | 含义 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: Add user registration` |
| `fix` | Bug 修复 | `fix: Resolve login issue` |
| `refactor` | 重构 | `refactor: Improve code structure` |
| `docs` | 文档 | `docs: Update README` |
| `test` | 测试 | `test: Add unit tests` |
| `chore` | 杂项 | `chore: Update dependencies` |

### 8.2 提交格式

```
<type>: <subject>

<body>

<footer>
```

**示例：**
```
feat: Add user registration API

- POST /api/auth/register
- Email validation
- Password hashing

Resolve #11
```

---

## 9. 审查标准

### 9.1 功能完整性

- [ ] 功能是否符合要求
- [ ] 是否满足所有验收标准
- [ ] 是否有遗漏的功能点

### 9.2 代码质量

- [ ] 代码结构是否清晰
- [ ] 是否遵循编码规范
- [ ] 是否有必要的注释

### 9.3 测试覆盖

- [ ] 是否有单元测试
- [ ] 是否有集成测试
- [ ] 测试覆盖率是否足够

### 9.4 文档完整性

- [ ] README 是否更新
- [ ] API 文档是否完整
- [ ] 是否有使用示例

---

## 10. 分支命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 新功能 | `feature/[功能名]` | `feature/user-auth` |
| Bug 修复 | `fix/[bug名]` | `fix/login-error` |
| 重构 | `refactor/[模块名]` | `refactor/api-layer` |
| 文档 | `docs/[文档名]` | `docs/api-guide` |

---

## 11. 工具

### 11.1 任务分解

```bash
/root/.openclaw/workspace/tools/spinwheel/decompose.sh epic \
  "任务名称" "任务描述"

/root/.openclaw/workspace/tools/spinwheel/decompose.sh subtask \
  <epic_number> "子任务" "描述" P1 "截止时间"
```

### 11.2 任务追踪

```bash
/root/.openclaw/workspace/tools/spinwheel/track.sh
```

### 11.3 PR 审查

```bash
# 列出待审查的 PR
node /root/.openclaw/workspace/tools/spinwheel/spinwheel-cli.js list

# 通过并合并
node /root/.openclaw/workspace/tools/spinwheel/spinwheel-cli.js review <pr_number> approve

# 不通过（创建 Follow-up）
node /root/.openclaw/workspace/tools/spinwheel/spinwheel-cli.js review <pr_number> reject "原因"
```

---

## 12. 完整示例

### 12.1 CEO 发布任务

```bash
# Ryan: 请开发用户管理模块

# CEO 分析并创建 Epic
/root/.openclaw/workspace/tools/spinwheel/decompose.sh epic \
  "开发用户管理模块" \
  "实现用户注册、登录、权限管理功能"
# 返回：Epic #20

# CEO 分解为子任务
/root/.openclaw/workspace/tools/spinwheel/decompose.sh subtask \
  20 "实现用户注册 API" "POST /api/auth/register" P1 "2026-02-19 12:00"
# 返回：Issue #21

/root/.openclaw/workspace/tools/spinwheel/decompose.sh subtask \
  20 "实现用户登录 API" "POST /api/auth/login" P1 "2026-02-19 14:00"
# 返回：Issue #22

/root/.openclaw/workspace/tools/spinwheel/decompose.sh subtask \
  20 "实现权限管理" "RBAC 权限系统" P2 "2026-02-20 18:00"
# 返回：Issue #23
```

### 12.2 CTO 执行任务

```bash
# CTO 自动收到通知（cron job）

# CTO 确认任务（1小时内）
# 在 Issue #21 中评论：✅ 收到任务！

# CTO 创建分支
git checkout -b feature/user-register-api

# CTO 开发并提交
git add .
git commit -m "feat: Add user registration API

- POST /api/auth/register
- Email validation
- Password hashing

Resolve #21"

git push origin feature/user-register-api

# CTO 创建 PR
gh pr create \
  --title "feat: Add user registration API" \
  --body "Closes #21"

# CTO 更新进度
# 在 Issue #21 中评论：
# 🚀 开发完成，PR #30 已提交，等待审查。
```

### 12.3 CEO 审查

```bash
# CEO 收到审查通知（cron job）

# CEO 查看待审查的 PR
node /root/.openclaw/workspace/tools/spinwheel/spinwheel-cli.js list

# CEO 审查通过
node /root/.openclaw/workspace/tools/spinwheel/spinwheel-cli.js review 30 approve

# 系统自动：
# ✅ 合并 PR
# ✅ 标记 Issue #21 为 task:completed
# ✅ 在 Issue 中评论感谢
```

### 12.4 循环迭代（如果不通过）

```bash
# CEO 审查不通过
node /root/.openclaw/workspace/tools/spinwheel/spinwheel-cli.js review 30 reject \
  "需要添加单元测试，代码覆盖率不足"

# 系统自动：
# ❌ 创建 Follow-up Issue #24
# ❌ 标记 Issue #21 为 task:revision
# ❌ 通知 CTO 改进

# CTO 收到通知，修复问题
git checkout -b fix/user-register-tests
# ... 添加测试
git commit -m "test: Add unit tests for user registration

- Add email validation tests
- Add password hashing tests

Resolve #24"

git push origin fix/user-register-tests

# CTO 创建新 PR
gh pr create \
  --title "test: Add unit tests for user registration" \
  --body "Closes #24"

# CEO 再次审查
# 循环直到通过
```

---

## 13. 优势

1. **透明性** - 所有任务在 GitHub 上可见
2. **可追溯** - 每个步骤都有记录
3. **自动化** - 减少手动沟通成本
4. **闭环** - 确保任务真正完成
5. **迭代** - 不满足要求可以循环改进
6. **标准化** - 统一的格式和流程

---

## 14. 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2026-02-18 | 初始版本 |

---

## 15. 参考资料

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [OpenClaw Documentation](https://docs.openclaw.ai)
- [Spinwheel README](../tools/spinwheel/README.md)
- [Spinwheel USAGE](../tools/spinwheel/USAGE.md)

---

*最后更新：2026-02-18*
*维护者：Claw (CEO)*
