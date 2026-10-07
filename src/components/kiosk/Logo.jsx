import { useState, useEffect, memo } from "react";

const LOGO_URL =
  "https://media.base44.com/images/public/6ab9370302b206e05eb4eac9/2848b8ea2_LOGO-COLOARCHANGE.svg";

const Logo = memo(function Logo({ className, style }) {
  const [svg, setSvg] = useState(null);

  useEffect(() => {
    fetch(LOGO_URL)
      .then((r) => r.text())
      .then((text) => {
        const modified = text
          // Remove fixed width/height so CSS controls sizing
          .replace(/width="\d+"/, "")
          .replace(/height="\d+"/, "")
          // Replace any hardcoded fill with currentColor
          .replace(/fill="[^"]*"/g, 'fill="currentColor"')
          // No explicit fill in this SVG — add one on the <svg> so it cascades
          .replace(
            /<svg /,
            '<svg fill="currentColor" style="height:100%;width:auto;display:block" '
          );
        setSvg(modified);
      })
      .catch(() => {});
  }, []);

  if (!svg) return <div className={className} style={style} />;

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
});

export default Logo;