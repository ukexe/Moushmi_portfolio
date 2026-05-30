/**
 * ProjectCardSkeleton — lightweight placeholder shown while a project card's
 * WebGL canvas chunk is loading. A dark charcoal field with a faint pulsing
 * shimmer, matching the card's footprint.
 */
export function ProjectCardSkeleton() {
  return (
    <div className="absolute inset-0 animate-pulse bg-charcoal">
      <div className="absolute inset-6 border border-white/5" />
    </div>
  );
}
