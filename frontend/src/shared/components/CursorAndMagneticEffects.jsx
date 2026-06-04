import { useEffect, useRef } from 'react';

export default function CursorAndMagneticEffects() {
  const dotRef = useRef(null);
  const outlineRef = useRef(null);

  useEffect(() => {
    // Check if the device is mobile/touch-based
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    // Enable custom cursor cursor-none styling on body
    document.body.classList.add('has-custom-cursor');

    // Smooth scroll position/cursor tracking
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let dotX = 0;
    let dotY = 0;

    let hasMoved = false;
    const handleMouseMove = (e) => {
      if (!hasMoved) {
        hasMoved = true;
        dotX = e.clientX;
        dotY = e.clientY;
        outlineX = e.clientX;
        outlineY = e.clientY;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (outlineRef.current) outlineRef.current.style.opacity = '1';
      }
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Smooth inertia tracking loop
    let animId;
    const updateCursor = () => {
      // Linear interpolation (Lerp) for smooth tracking
      // Dot moves faster, outline has more lag
      dotX += (mouseX - dotX) * 0.3;
      dotY += (mouseY - dotY) * 0.3;
      outlineX += (mouseX - outlineX) * 0.14;
      outlineY += (mouseY - outlineY) * 0.14;

      if (dotRef.current) {
        dotRef.current.style.left = `${dotX}px`;
        dotRef.current.style.top = `${dotY}px`;
      }
      if (outlineRef.current) {
        outlineRef.current.style.left = `${outlineX}px`;
        outlineRef.current.style.top = `${outlineY}px`;
      }

      animId = requestAnimationFrame(updateCursor);
    };
    animId = requestAnimationFrame(updateCursor);

    // ── Hover effects on interactive elements ──
    const addHoverState = (e) => {
      const el = e.target;
      if (!el) return;

      const isText = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.closest('[contenteditable]');
      const isInteractive = 
        el.tagName === 'A' || 
        el.tagName === 'BUTTON' || 
        el.closest('.btn') || 
        el.closest('.hover-lift') || 
        el.closest('a') || 
        el.closest('button') ||
        el.tagName === 'SELECT';

      if (isText) {
        document.body.classList.add('cursor-text-hover');
      } else if (isInteractive) {
        document.body.classList.add('cursor-hover');
      }
    };

    const removeHoverState = () => {
      document.body.classList.remove('cursor-hover', 'cursor-text-hover');
    };

    document.addEventListener('mouseover', addHoverState);
    document.addEventListener('mouseout', removeHoverState);

    // ── Magnetic Button Effect ──
    const magneticElements = new Map();

    const handleMagneticMove = (e, el) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      // Restrict magnetic movement to max 6px for subtle snapping feel
      const maxMove = 6;
      const pullX = Math.max(-maxMove, Math.min(maxMove, distX * 0.22));
      const pullY = Math.max(-maxMove, Math.min(maxMove, distY * 0.22));

      // Translate the element
      el.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.01)`;
      
      // Pull outline cursor towards the center of button slightly for a visual snap feel
      outlineX += (centerX - outlineX) * 0.08;
      outlineY += (centerY - outlineY) * 0.08;
    };

    const handleMagneticLeave = (el) => {
      el.style.transform = '';
    };

    const attachMagneticEvents = () => {
      const elements = document.querySelectorAll('.magnetic-btn, .btn, .notif-btn, .avatar-circle, .sidebar-link, .nav-item, button:not(.hamburger-btn)');
      elements.forEach(el => {
        if (!magneticElements.has(el)) {
          const moveListener = (e) => handleMagneticMove(e, el);
          const leaveListener = () => handleMagneticLeave(el);
          
          el.addEventListener('mousemove', moveListener);
          el.addEventListener('mouseleave', leaveListener);
          
          magneticElements.set(el, { moveListener, leaveListener });
        }
      });
    };

    // Initial attach
    attachMagneticEvents();

    // Re-evaluate whenever DOM updates (e.g. dynamic routing page changes)
    const observer = new MutationObserver(attachMagneticEvents);
    observer.observe(document.body, { childList: true, subtree: true });

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      document.removeEventListener('mouseover', addHoverState);
      document.removeEventListener('mouseout', removeHoverState);
      document.body.classList.remove('has-custom-cursor', 'cursor-hover', 'cursor-text-hover');
      
      magneticElements.forEach((listeners, el) => {
        el.removeEventListener('mousemove', listeners.moveListener);
        el.removeEventListener('mouseleave', listeners.leaveListener);
        el.style.transform = '';
      });
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={outlineRef} className="custom-cursor-outline" />
    </>
  );
}
