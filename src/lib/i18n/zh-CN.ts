// OpenClaw Studio 中文本地化
// 集中管理所有 UI 文本

export const zhCN = {
  // 通用
  common: {
    connect: "连接",
    connecting: "连接中...",
    connected: "已连接",
    disconnected: "未连接",
    disconnect: "断开",
    cancel: "取消",
    save: "保存",
    delete: "删除",
    edit: "编辑",
    create: "创建",
    close: "关闭",
    confirm: "确认",
    loading: "加载中...",
    error: "错误",
    success: "成功",
    copy: "复制",
    copied: "已复制",
    search: "搜索",
    refresh: "刷新",
    back: "返回",
    next: "下一步",
    previous: "上一步",
    submit: "提交",
    send: "发送",
    clear: "清除",
    all: "全部",
    none: "无",
    yes: "是",
    no: "否",
    ok: "确定",
  },

  // 顶部导航栏
  header: {
    title: "OpenClaw Studio",
    brain: "资料",
    gatewayConnection: "网关连接",
    connecting: "连接中",
  },

  // 网关连接页面
  gateway: {
    localGateway: "本地网关",
    remoteGateway: "远程网关",
    runLocally: "本地运行",
    upstreamUrl: "上游地址",
    upstreamToken: "上游令牌",
    upstreamTokenPlaceholder: "网关令牌",
    keepTokenSecret: "请妥善保管此令牌。",
    usingTailscale: "使用 Tailscale？",
    tailscaleUrlHint: "地址：wss://<你的-tailnet-主机>",
    tailscaleTokenHint: "令牌：你的网关令牌",
    noLocalGateway: "未找到本地网关。",
    notConnected: "未连接到网关。",
    localGatewayDetected: "检测到本地网关，端口 {port}。正在连接...",
    connectingRemote: "正在连接远程网关...",
    runLocalHint: "在源码目录中使用",
    useLocalDefaults: "使用本地默认配置",
    useTokenFrom: "使用来自 ~/.openclaw/openclaw.json 的令牌。",
    connectFailed: "连接失败",
  },

  // Agent 列表侧边栏
  fleet: {
    agents: "智能体",
    newAgent: "新建智能体",
    creating: "创建中...",
    filter: {
      all: "全部",
      running: "运行中",
      idle: "空闲",
    },
    status: {
      idle: "空闲",
      running: "运行中",
      error: "错误",
    },
    needsApproval: "需审批",
    noAgents: "暂无智能体。",
  },

  // Agent 创建
  agentCreate: {
    title: "新建智能体",
    launchAgent: "启动智能体",
    chooseAvatar: "选择头像",
    agentName: "智能体名称",
    agentNamePlaceholder: "输入智能体名称",
    identitySection: "身份",
    identityDescription: "为你的智能体定义个性。",
    name: "名称",
    namePlaceholder: "例如：助手",
    emoji: "表情符号",
    selectEmoji: "选择表情",
    personality: "个性",
    personalityPlaceholder: "描述智能体的行为方式...",
    advanced: "高级",
    model: "模型",
    selectModel: "选择模型",
    thinking: "思考",
    thinkingEnabled: "启用",
    thinkingDisabled: "禁用",
    workspace: "工作区",
    selectWorkspace: "选择工作区路径",
    create: "创建智能体",
    creating: "创建中...",
  },

  // Agent 设置面板
  agentSettings: {
    title: "设置",
    agentName: "智能体名称",
    model: "模型",
    selectModel: "选择模型",
    thinking: "思考模式",
    thinkingOn: "开启",
    thinkingOff: "关闭",
    workspace: "工作区",
    noWorkspace: "未设置工作区",
    cronJobs: "定时任务",
    noCronJobs: "暂无定时任务",
    addCronJob: "添加定时任务",
    heartbeats: "心跳任务",
    noHeartbeats: "暂无心跳任务",
    addHeartbeat: "添加心跳",
    saveChanges: "保存更改",
    deleteAgent: "删除智能体",
    deleteConfirm: "确定要删除此智能体吗？此操作不可撤销。",
    restartAgent: "重启智能体",
    agentInfo: "智能体信息",
    agentId: "智能体 ID",
    sessionKey: "会话密钥",
    status: "状态",
  },

  // 聊天面板
  chat: {
    placeholder: "输入消息...",
    send: "发送",
    typing: "正在输入...",
    noMessages: "暂无消息。开始对话吧！",
    waitingForConnection: "等待连接...",
    stop: "停止",
    settings: "设置",
    model: "模型",
    thinking: "思考",
    loadMore: "加载更多历史记录",
    noHistory: "没有更多历史记录",
  },

  // 审批
  approval: {
    title: "执行审批",
    description: "智能体请求执行以下命令：",
    approve: "批准",
    deny: "拒绝",
    approveAll: "全部批准",
    denyAll: "全部拒绝",
    command: "命令",
    workingDirectory: "工作目录",
    timeout: "超时时间",
    elevated: "需要提升权限",
    securityLevel: "安全级别",
  },

  // Cron 任务
  cron: {
    title: "定时任务",
    add: "添加任务",
    edit: "编辑任务",
    delete: "删除任务",
    name: "名称",
    schedule: "调度",
    schedulePlaceholder: "例如：0 9 * * *（每天 9:00）",
    enabled: "启用",
    disabled: "禁用",
    lastRun: "上次运行",
    nextRun: "下次运行",
    neverRun: "从未运行",
    message: "消息内容",
    messagePlaceholder: "输入要发送的消息...",
  },

  // 空状态
  empty: {
    noAgents: "暂无智能体",
    noAgentsDescription: "创建一个新智能体开始使用。",
    noMessages: "暂无消息",
    noMessagesDescription: "选择一个智能体开始对话。",
    noResults: "无结果",
    noResultsDescription: "没有找到匹配的内容。",
  },

  // 错误消息
  errors: {
    connectionFailed: "连接失败",
    disconnected: "连接已断开",
    unauthorized: "未授权，请检查令牌",
    notFound: "未找到",
    serverError: "服务器错误",
    unknownError: "未知错误",
    fieldRequired: "此字段必填",
    invalidUrl: "无效的 URL",
    invalidToken: "无效的令牌",
  },

  // Brain 文件面板
  brain: {
    title: "脑",
    description: "智能体的知识文件",
    files: "文件",
    noFiles: "暂无文件",
    addFile: "添加文件",
    editFile: "编辑文件",
    deleteFile: "删除文件",
    fileName: "文件名",
    content: "内容",
    save: "保存",
    cancel: "取消",
  },

  // 主题
  theme: {
    light: "浅色",
    dark: "深色",
    system: "跟随系统",
  },
} as const;

export type Translations = typeof zhCN;
