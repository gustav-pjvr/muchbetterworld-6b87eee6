import earthTexture from "@/assets/earth-texture.jpg";

export function SpinningEarth() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <div className="relative">
        <div className="earth-atmosphere absolute -inset-16 rounded-full" />
        <div
          className="earth-sphere rounded-full"
          style={
            {
              width: "min(70vw, 540px)",
              height: "min(70vw, 540px)",
              ["--earth-texture" as string]: `url(${earthTexture})`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}
