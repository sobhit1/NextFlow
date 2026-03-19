export default function RightSidebar() {
  return (
    <div className="w-80 border-l border-[var(--color-card-border)] bg-[var(--color-card-background)] flex flex-col h-full flex-shrink-0 z-10 shadow-xl">
      <div className="p-4 border-b border-[var(--color-card-border)]">
        <h2 className="text-sm font-semibold tracking-wider text-[var(--color-foreground)]">WORKFLOW HISTORY</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {/* History entries will go here */}
      </div>
    </div>
  );
}
