import type { GatewayStatus } from "../lib/gateway/GatewayClient";

type HeaderBarProps = {
  projects: Array<{ id: string; name: string }>;
  activeProjectId: string | null;
  status: GatewayStatus;
  onProjectChange: (projectId: string) => void;
  onCreateProject: () => void;
  onDeleteProject: () => void;
  onToggleConnection: () => void;
  onNewAgent: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
};

const statusStyles: Record<GatewayStatus, string> = {
  disconnected: "bg-slate-200 text-slate-700",
  connecting: "bg-amber-200 text-amber-900",
  connected: "bg-emerald-200 text-emerald-900",
};

export const HeaderBar = ({
  projects,
  activeProjectId,
  status,
  onProjectChange,
  onCreateProject,
  onDeleteProject,
  onToggleConnection,
  onNewAgent,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: HeaderBarProps) => {
  const hasProjects = projects.length > 0;

  return (
    <div className="glass-panel flex flex-wrap items-center justify-between gap-4 px-6 py-4">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Project
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="h-10 rounded-full border border-slate-300 bg-white/80 px-4 text-sm font-semibold text-slate-900 outline-none"
            value={activeProjectId ?? ""}
            onChange={(event) => onProjectChange(event.target.value)}
            disabled={!hasProjects}
          >
            {hasProjects ? null : <option value="">No projects</option>}
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <button
            className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
            type="button"
            onClick={onCreateProject}
          >
            New Project
          </button>
          <button
            className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
            type="button"
            onClick={onDeleteProject}
            disabled={!activeProjectId}
          >
            Delete
          </button>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[status]}`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
          type="button"
          onClick={onToggleConnection}
        >
          Connection
        </button>
        <button
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          type="button"
          onClick={onNewAgent}
          disabled={!activeProjectId}
        >
          New Agent
        </button>
        <div className="flex items-center gap-2 rounded-full border border-slate-300 px-3 py-2">
          <button
            className="text-sm font-semibold text-slate-800"
            type="button"
            onClick={onZoomOut}
          >
            −
          </button>
          <span className="text-xs font-semibold text-slate-600">
            {Math.round(zoom * 100)}%
          </span>
          <button
            className="text-sm font-semibold text-slate-800"
            type="button"
            onClick={onZoomIn}
          >
            +
          </button>
          <button
            className="ml-2 text-xs font-semibold text-slate-500"
            type="button"
            onClick={onZoomReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
