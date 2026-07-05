import { SmoothCursor } from "@/components/ui/smooth-cursor";

export default function SmoothCursorDemo() {
  return (
    <div className="text-center py-4 text-sm text-[var(--text-muted)]">
      <span className="hidden md:block">Move your mouse around to experience the smooth fluid cursor</span>
      <span className="block md:hidden">Tap anywhere to see the cursor</span>
      <SmoothCursor />
    </div>
  );
}
