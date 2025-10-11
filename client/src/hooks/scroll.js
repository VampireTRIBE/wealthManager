import { useRef, useEffect } from "react";

/**
 * Hook for drag + wheel scrolling (horizontal or vertical) with hover activation
 * @param {"horizontal"|"vertical"} direction - scroll direction
 * @param {number} speed - scroll speed multiplier
 */
export default function useScroll(direction = "horizontal", speed = 1.5) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isHovered = false;
    let isDown = false;
    let startPos;
    let scrollStart;

    /** --- Hover tracking --- */
    const handleMouseEnter = () => (isHovered = true);
    const handleMouseLeave = () => {
      isHovered = false;
      isDown = false;
    };

    /** --- Drag scroll --- */
    const mouseDownHandler = (e) => {
      if (!isHovered) return;
      isDown = true;
      startPos =
        direction === "horizontal"
          ? e.pageX - el.offsetLeft
          : e.pageY - el.offsetTop;
      scrollStart =
        direction === "horizontal" ? el.scrollLeft : el.scrollTop;
      el.style.cursor = "grabbing";
    };

    const mouseUpHandler = () => {
      isDown = false;
      el.style.cursor = "grab";
    };

    const mouseMoveHandler = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const pos =
        direction === "horizontal"
          ? e.pageX - el.offsetLeft
          : e.pageY - el.offsetTop;
      const walk = (pos - startPos) * 2;
      if (direction === "horizontal") el.scrollLeft = scrollStart - walk;
      else el.scrollTop = scrollStart - walk;
    };

    /** --- Wheel scroll --- */
    let scrollTimeout;
    const wheelHandler = (e) => {
      if (!isHovered) return; // only scroll when hovered
      e.preventDefault();

      if (direction === "horizontal") el.scrollLeft += e.deltaY * speed;
      else el.scrollTop += e.deltaY * speed;

      el.style.scrollBehavior = "auto";
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        el.style.scrollBehavior = "smooth";
      }, 50);
    };

    /** --- Add Listeners --- */
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mousedown", mouseDownHandler);
    el.addEventListener("mouseup", mouseUpHandler);
    el.addEventListener("mousemove", mouseMoveHandler);
    el.addEventListener("wheel", wheelHandler, { passive: false });

    /** --- Cleanup --- */
    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mousedown", mouseDownHandler);
      el.removeEventListener("mouseup", mouseUpHandler);
      el.removeEventListener("mousemove", mouseMoveHandler);
      el.removeEventListener("wheel", wheelHandler);
    };
  }, [direction, speed]);

  return scrollRef;
}
