# Spinwheel UI 设计规范 v1.0

**Status:** Draft
**Created:** 2026-02-18
**Parent:** [Spinwheel Spec](./spinwheel-spec.md)

---

## 1. 概述

在奇点科技（Singularity Tech）UI 中添加 Spinwheel 任务管理界面，让 Ryan 可以：
- 直观地发布任务
- 查看 Spinwheel 流程
- 追踪执行进展
- 审查 PR
- 管理整个协作过程

---

## 2. UI 架构

### 2.1 页面结构

```
奇点科技 UI
├── Agents（现有）
├── Spinwheel（新增）
│   ├── Dashboard（概览）
│   ├── Tasks（任务列表）
│   ├── Create（发布任务）
│   ├── Timeline（流程时间线）
│   └── Settings（设置）
└── Settings（现有）
```

### 2.2 导航

在侧边栏添加 Spinwheel 入口：

```tsx
// src/features/navigation/Sidebar.tsx
const navItems = [
  { label: 'Agents', icon: Bot, path: '/' },
  { label: 'Spinwheel', icon: RefreshCw, path: '/spinwheel' }, // 新增
  { label: 'Settings', icon: Settings, path: '/settings' }
];
```

---

## 3. 页面设计

### 3.1 Dashboard（概览）

**路径：** `/spinwheel`

**布局：**

```
┌────────────────────────────────────────────┐
│ Spinwheel Dashboard                    [+] │
├────────────────────────────────────────────┤
│                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│  │ 总任务  │ │ 进行中  │ │ 已完成  │     │
│  │   10    │ │    3    │ │    5    │     │
│  └─────────┘ └─────────┘ └─────────┘     │
│                                            │
│  📊 最近活动                               │
│  ┌──────────────────────────────────────┐ │
│  │ • Issue #21: 实现用户注册 API        │ │
│  │   状态: in_progress  |  2小时前      │ │
│  │                                      │ │
│  │ • Issue #22: 实现用户登录 API        │ │
│  │   状态: review  |  30分钟前          │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  📋 待处理任务                             │
│  ┌──────────────────────────────────────┐ │
│  │ [P0] 🔴 紧急任务 #23                 │ │
│  │ [P1] 🟠 实现权限管理 #24             │ │
│  │ [P2] 🔵 优化性能 #25                 │ │
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

**组件：**

```tsx
// src/features/spinwheel/components/SpinwheelDashboard.tsx

interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  review: number;
  completed: number;
  overdue: number;
}

interface RecentActivity {
  task_id: string;
  title: string;
  status: TaskStatus;
  updated_at: string;
  agent: AgentRole;
}

export function SpinwheelDashboard() {
  const { stats, activities, pendingTasks } = useSpinwheelDashboard();
  
  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="总任务" value={stats.total} icon={ListTodo} />
        <StatCard label="进行中" value={stats.inProgress} icon={Clock} />
        <StatCard label="待审查" value={stats.review} icon={Eye} />
        <StatCard label="已完成" value={stats.completed} icon={CheckCircle} />
      </div>
      
      {/* 最近活动 */}
      <Card>
        <CardHeader>
          <CardTitle>📊 最近活动</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityList activities={activities} />
        </CardContent>
      </Card>
      
      {/* 待处理任务 */}
      <Card>
        <CardHeader>
          <CardTitle>📋 待处理任务</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskList tasks={pendingTasks} />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### 3.2 Tasks（任务列表）

**路径：** `/spinwheel/tasks`

**布局：**

```
┌────────────────────────────────────────────┐
│ 任务列表                    [+ 新建任务]   │
├────────────────────────────────────────────┤
│                                            │
│  筛选: [全部▼] [P0-P3▼] [CEO/CTO▼]        │
│                                            │
│  ┌────────────────────────────────────────┐│
│  │ #21 实现用户注册 API         [进行中] ││
│  │ Epic: 开发用户管理模块                 ││
│  │ 指派: CTO | 截止: 2026-02-19 12:00     ││
│  │ 进度: ████████░░ 80%                  ││
│  │ [查看详情]                             ││
│  └────────────────────────────────────────┘│
│                                            │
│  ┌────────────────────────────────────────┐│
│  │ #22 实现用户登录 API         [待审查] ││
│  │ Epic: 开发用户管理模块                 ││
│  │ 指派: CTO | 截止: 2026-02-19 14:00     ││
│  │ 进度: ██████████ 100%                 ││
│  │ [查看详情] [审查 PR]                   ││
│  └────────────────────────────────────────┘│
│                                            │
└────────────────────────────────────────────┘
```

**组件：**

```tsx
// src/features/spinwheel/components/TaskList.tsx

export function TaskListPage() {
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignee: 'all'
  });
  
  const { tasks, isLoading } = useTasks(filters);
  
  return (
    <div className="space-y-4">
      {/* 筛选器 */}
      <TaskFilters filters={filters} onChange={setFilters} />
      
      {/* 任务列表 */}
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Badge variant={getPriorityVariant(task.priority)}>
              {task.priority}
            </Badge>
            <span className="ml-2 text-sm text-gray-500">
              #{task.id}
            </span>
          </div>
          <TaskStatusBadge status={task.status} />
        </div>
        <CardTitle className="text-lg mt-2">{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Epic: {task.parent_title}</span>
          <span>指派: {task.assignee === 'cto' ? 'CTO' : 'CEO'}</span>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>进度</span>
            <span>{calculateProgress(task)}%</span>
          </div>
          <Progress value={calculateProgress(task)} />
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm">
            查看详情
          </Button>
          {task.status === 'review' && (
            <Button size="sm">
              审查 PR
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### 3.3 Create（发布任务）

**路径：** `/spinwheel/create`

**布局：**

```
┌────────────────────────────────────────────┐
│ 发布新任务                                │
├────────────────────────────────────────────┤
│                                            │
│  任务类型:  ○ Epic (父任务)                │
│             ● Sub-task (子任务)            │
│                                            │
│  父任务:    [选择 Epic ▼]                  │
│                                            │
│  任务标题:  [________________________]     │
│                                            │
│  详细描述:                                 │
│  ┌──────────────────────────────────────┐ │
│  │                                      │ │
│  │                                      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  优先级:    ○ P0  ● P1  ○ P2  ○ P3       │
│                                            │
│  截止时间:  [2026-02-19] [12:00]          │
│                                            │
│  验收标准:                                 │
│  [+ 添加验收标准]                          │
│                                            │
│  [取消]              [发布任务]            │
│                                            │
└────────────────────────────────────────────┘
```

**组件：**

```tsx
// src/features/spinwheel/components/CreateTaskForm.tsx

export function CreateTaskPage() {
  const [formData, setFormData] = useState({
    type: 'subtask',
    parent_id: '',
    title: '',
    description: '',
    priority: 'P1',
    deadline: '',
    acceptance_criteria: []
  });
  
  const { createTask, isCreating } = useCreateTask();
  
  const handleSubmit = async () => {
    await createTask(formData);
    // 跳转到任务列表
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>发布新任务</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {/* 任务类型 */}
          <div className="space-y-2">
            <Label>任务类型</Label>
            <RadioGroup value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="epic" id="epic" />
                <Label htmlFor="epic">Epic (父任务)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="subtask" id="subtask" />
                <Label htmlFor="subtask">Sub-task (子任务)</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* 父任务选择（如果是 Sub-task） */}
          {formData.type === 'subtask' && (
            <div className="space-y-2">
              <Label>父任务</Label>
              <Select value={formData.parent_id} onValueChange={(v) => setFormData({...formData, parent_id: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="选择 Epic" />
                </SelectTrigger>
                <SelectContent>
                  {epics.map(epic => (
                    <SelectItem key={epic.id} value={epic.id}>
                      #{epic.id} {epic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* 任务标题 */}
          <div className="space-y-2">
            <Label>任务标题</Label>
            <Input 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="例如：实现用户注册 API"
            />
          </div>
          
          {/* 详细描述 */}
          <div className="space-y-2">
            <Label>详细描述</Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="描述任务的具体要求..."
              rows={4}
            />
          </div>
          
          {/* 优先级 */}
          <div className="space-y-2">
            <Label>优先级</Label>
            <RadioGroup value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v})}>
              {['P0', 'P1', 'P2', 'P3'].map(p => (
                <div key={p} className="flex items-center space-x-2">
                  <RadioGroupItem value={p} id={p} />
                  <Label htmlFor={p} className={getPriorityColor(p)}>
                    {getPriorityLabel(p)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          {/* 截止时间 */}
          <div className="space-y-2">
            <Label>截止时间</Label>
            <div className="flex gap-2">
              <Input 
                type="date" 
                value={formData.deadline.split('T')[0]}
                onChange={(e) => setFormData({...formData, deadline: e.target.value + 'T' + formData.deadline.split('T')[1]})}
              />
              <Input 
                type="time" 
                value={formData.deadline.split('T')[1]}
                onChange={(e) => setFormData({...formData, deadline: formData.deadline.split('T')[0] + 'T' + e.target.value})}
              />
            </div>
          </div>
          
          {/* 验收标准 */}
          <div className="space-y-2">
            <Label>验收标准</Label>
            <AcceptanceCriteriaEditor 
              value={formData.acceptance_criteria}
              onChange={(criteria) => setFormData({...formData, acceptance_criteria: criteria})}
            />
          </div>
          
          {/* 提交按钮 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">取消</Button>
            <Button onClick={handleSubmit} disabled={isCreating}>
              {isCreating ? '发布中...' : '发布任务'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
```

---

### 3.4 Timeline（流程时间线）

**路径：** `/spinwheel/timeline/[task_id]`

**布局：**

```
┌────────────────────────────────────────────┐
│ #21 实现用户注册 API                       │
├────────────────────────────────────────────┤
│                                            │
│  Spinwheel 流程时间线                      │
│                                            │
│  ●───●───●───○───○                         │
│  1   2   3   4   5                         │
│                                            │
│  1. ✅ 任务创建 (2026-02-18 10:00)         │
│     CEO 创建任务并指派 CTO                 │
│                                            │
│  2. ✅ 任务确认 (2026-02-18 10:15)         │
│     CTO 确认任务                           │
│                                            │
│  3. ✅ 开发完成 (2026-02-18 14:00)         │
│     CTO 提交 PR #30                        │
│     [查看 PR]                              │
│                                            │
│  4. ⏳ 等待审查                            │
│     CEO 需要审查 PR                        │
│     [审查 PR]                              │
│                                            │
│  5. ⏸️ 任务完成                            │
│     等待前置步骤完成                       │
│                                            │
│  ─────────────────────────────────────     │
│                                            │
│  💬 评论历史                               │
│  ┌──────────────────────────────────────┐ │
│  │ CTO (10:15): ✅ 收到任务！开始执行   │ │
│  │ CTO (14:00): 🚀 开发完成，PR #30    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [添加评论]                                │
│                                            │
└────────────────────────────────────────────┘
```

**组件：**

```tsx
// src/features/spinwheel/components/TaskTimeline.tsx

export function TaskTimelinePage({ taskId }: { taskId: string }) {
  const { task, timeline, comments } = useTaskTimeline(taskId);
  
  return (
    <div className="space-y-6">
      {/* 任务标题 */}
      <div>
        <h1 className="text-2xl font-bold">
          <span className="text-gray-500">#{task.id}</span> {task.title}
        </h1>
        <div className="flex gap-2 mt-2">
          <TaskStatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
      </div>
      
      {/* 时间线 */}
      <Card>
        <CardHeader>
          <CardTitle>Spinwheel 流程时间线</CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline>
            <TimelineItem completed={true}>
              <TimelinePoint>
                <CheckCircle className="w-5 h-5" />
              </TimelinePoint>
              <TimelineContent>
                <TimelineTitle>任务创建</TimelineTitle>
                <TimelineDescription>
                  {formatTime(task.created_at)} - CEO 创建任务并指派 CTO
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            
            <TimelineItem completed={task.status !== 'pending'}>
              <TimelinePoint>
                {task.status === 'pending' ? <Circle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              </TimelinePoint>
              <TimelineContent>
                <TimelineTitle>任务确认</TimelineTitle>
                <TimelineDescription>
                  CTO 确认任务
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            
            {/* 更多时间线项... */}
          </Timeline>
        </CardContent>
      </Card>
      
      {/* 评论历史 */}
      <Card>
        <CardHeader>
          <CardTitle>💬 评论历史</CardTitle>
        </CardHeader>
        <CardContent>
          <CommentList comments={comments} />
          <AddComment taskId={task.id} />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### 3.5 Settings（设置）

**路径：** `/spinwheel/settings`

**配置项：**

```tsx
// src/features/spinwheel/components/SpinwheelSettings.tsx

export function SpinwheelSettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>通知设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>新任务通知</Label>
                <p className="text-sm text-gray-500">CTO 收到新任务时通知</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>审查提醒</Label>
                <p className="text-sm text-gray-500">CEO 收到待审查 PR 时通知</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>超时警告</Label>
                <p className="text-sm text-gray-500">任务超时时发送警告</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>自动化设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>智能检测</Label>
                <p className="text-sm text-gray-500">检测 Agent 活跃状态，避免打断工作</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label>检查频率</Label>
              <Select defaultValue="15">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">每 5 分钟</SelectItem>
                  <SelectItem value="15">每 15 分钟</SelectItem>
                  <SelectItem value="30">每 30 分钟</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 4. API 集成

### 4.1 前端 API 客户端

```tsx
// src/lib/spinwheel/api.ts

export const spinwheelApi = {
  // 任务管理
  getTasks: (filters?: TaskFilters) => 
    fetch('/api/spinwheel/tasks?' + new URLSearchParams(filters)).then(r => r.json()),
  
  getTask: (id: string) => 
    fetch(`/api/spinwheel/tasks/${id}`).then(r => r.json()),
  
  createTask: (task: CreateTaskRequest) => 
    fetch('/api/spinwheel/tasks', {
      method: 'POST',
      body: JSON.stringify(task)
    }).then(r => r.json()),
  
  updateTask: (id: string, update: UpdateTaskRequest) => 
    fetch(`/api/spinwheel/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(update)
    }).then(r => r.json()),
  
  // 评论
  getComments: (taskId: string) => 
    fetch(`/api/spinwheel/tasks/${taskId}/comments`).then(r => r.json()),
  
  addComment: (taskId: string, comment: AddCommentRequest) => 
    fetch(`/api/spinwheel/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment)
    }).then(r => r.json()),
  
  // 统计
  getStats: () => 
    fetch('/api/spinwheel/stats').then(r => r.json()),
  
  // PR 审查
  reviewPR: (prId: number, review: ReviewRequest) => 
    fetch(`/api/spinwheel/pr/${prId}/review`, {
      method: 'POST',
      body: JSON.stringify(review)
    }).then(r => r.json()),
};
```

### 4.2 React Query Hooks

```tsx
// src/lib/spinwheel/hooks.ts

export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: ['spinwheel', 'tasks', filters],
    queryFn: () => spinwheelApi.getTasks(filters)
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['spinwheel', 'task', id],
    queryFn: () => spinwheelApi.getTask(id)
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: spinwheelApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spinwheel', 'tasks'] });
    }
  });
}

export function useTaskTimeline(id: string) {
  const { data: task } = useTask(id);
  const { data: comments } = useComments(id);
  
  const timeline = useMemo(() => {
    if (!task) return [];
    
    return [
      {
        step: 1,
        title: '任务创建',
        completed: true,
        timestamp: task.created_at
      },
      {
        step: 2,
        title: '任务确认',
        completed: task.status !== 'pending',
        timestamp: task.acknowledged_at
      },
      // ...
    ];
  }, [task]);
  
  return { task, timeline, comments };
}
```

---

## 5. 数据流

### 5.1 状态管理

```tsx
// src/features/spinwheel/state/store.ts

interface SpinwheelState {
  tasks: Task[];
  filters: TaskFilters;
  selectedTask: Task | null;
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  setFilters: (filters: TaskFilters) => void;
  selectTask: (task: Task | null) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
}

export const useSpinwheelStore = create<SpinwheelState>((set) => ({
  tasks: [],
  filters: {},
  selectedTask: null,
  
  setTasks: (tasks) => set({ tasks }),
  setFilters: (filters) => set({ filters }),
  selectTask: (task) => set({ selectedTask: task }),
  updateTaskStatus: (id, status) => set((state) => ({
    tasks: state.tasks.map(t => 
      t.id === id ? { ...t, status } : t
    )
  }))
}));
```

### 5.2 实时更新

```tsx
// src/features/spinwheel/state/realtime.ts

export function useSpinwheelRealtime() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // WebSocket 连接
    const ws = new WebSocket('ws://localhost:3000/api/spinwheel/ws');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // 根据事件类型更新缓存
      if (data.type === 'task.created') {
        queryClient.invalidateQueries({ queryKey: ['spinwheel', 'tasks'] });
      } else if (data.type === 'task.status_changed') {
        queryClient.invalidateQueries({ queryKey: ['spinwheel', 'task', data.task_id] });
      }
    };
    
    return () => ws.close();
  }, [queryClient]);
}
```

---

## 6. 路由配置

```tsx
// src/app/spinwheel/layout.tsx

export default function SpinwheelLayout({ children }) {
  return (
    <div className="flex h-screen">
      <SpinwheelSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

// src/app/spinwheel/page.tsx
export default function SpinwheelDashboardPage() {
  return <SpinwheelDashboard />;
}

// src/app/spinwheel/tasks/page.tsx
export default function TasksPage() {
  return <TaskListPage />;
}

// src/app/spinwheel/create/page.tsx
export default function CreateTaskPage() {
  return <CreateTaskPage />;
}

// src/app/spinwheel/timeline/[id]/page.tsx
export default function TimelinePage({ params }) {
  return <TaskTimelinePage taskId={params.id} />;
}
```

---

## 7. 实施计划

### Phase 1: 基础 UI（1-2天）
- [ ] 创建路由和布局
- [ ] 实现 Dashboard 页面
- [ ] 实现任务列表页面
- [ ] 集成 GitHub API

### Phase 2: 任务创建（1天）
- [ ] 实现创建任务表单
- [ ] Epic 和 Sub-task 选择
- [ ] 验收标准编辑器
- [ ] 提交到 GitHub

### Phase 3: 时间线和详情（1天）
- [ ] 实现任务详情页
- [ ] 实现 Timeline 组件
- [ ] 评论功能
- [ ] 进度追踪

### Phase 4: 实时更新（1天）
- [ ] WebSocket 集成
- [ ] 实时状态更新
- [ ] 通知推送

### Phase 5: 优化和测试（1天）
- [ ] UI 优化
- [ ] 性能优化
- [ ] 测试
- [ ] 文档

---

## 8. 技术栈

- **UI 框架：** Next.js 15 App Router
- **组件库：** shadcn/ui
- **状态管理：** React Query + Zustand
- **样式：** Tailwind CSS
- **类型：** TypeScript

---

*最后更新：2026-02-18*
*维护者：Claw (CEO)*
