"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const VALID_USERNAME = "Yanxu17";
const VALID_PASSWORD = "abcabcabc";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 模拟延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      // 设置登录状态
      localStorage.setItem("studio_auth", "true");
      localStorage.setItem("studio_user", username);
      router.push("/");
    } else {
      setError("用户名或密码错误");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glass-panel w-full max-w-md px-8 py-10">
        {/* 公司名称 */}
        <div className="mb-8 text-center">
          <h1 className="console-title text-4xl text-foreground">奇点科技</h1>
          <p className="mt-2 text-sm text-muted-foreground">智能体管理平台</p>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 w-full rounded-md border border-border bg-surface-3 px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="请输入用户名"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-md border border-border bg-surface-3 px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="请输入密码"
              required
            />
          </div>

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-md bg-primary px-4 text-sm font-semibold uppercase tracking-[0.1em] text-primary-foreground transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>

        {/* 底部信息 */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>© 2026 奇点科技. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
