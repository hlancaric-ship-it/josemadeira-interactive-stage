/** Club haze + a slow moving spotlight sweep — the room, not a toy. */
export const StageAtmosphere = () => {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      <div className="haze-blob haze-blob-1" />
      <div className="haze-blob haze-blob-2" />
      <div className="haze-blob haze-blob-3" />
      <div className="light-sweep" />
    </div>
  );
};
