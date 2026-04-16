import { gsap } from "gsap";


gsap.from("#player1_runs", {
  yPercent: 50,
  opacity: 0,
  duration: 0.4,
  ease: "power2.out"
});