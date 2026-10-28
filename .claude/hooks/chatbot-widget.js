// Chatbot widget hook: a cute floating bot button, bottom right, linked to WhatsApp support.
// Clicking it speaks a greeting (Web Speech API) and opens the WhatsApp chat in a new tab.
// Self-contained: injects its own styles, reuses the page's :root custom properties.
(function () {
  var WHATSAPP_NUMBER = "6512345678"; // country code + number, digits only
  var WHATSAPP_MESSAGE = "Hi Gennie, I need IT support.";
  var GREETING = "HI, I am Gennie, your IT support assistant, How can i help you?";

  var CSS =
    ".gennie { position: fixed; right: 16px; bottom: 16px; z-index: 9; width: 64px; height: 64px; display: grid; place-items: center; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #d68bff, var(--data)); box-shadow: var(--glow-purple); text-decoration: none; animation: gennie-float 3s ease-in-out infinite; transition: transform 0.15s; }" +
    ".gennie:hover { transform: scale(1.08); }" +
    ".gennie svg { width: 44px; height: 44px; }" +
    ".gennie-tip { position: absolute; right: 74px; bottom: 14px; padding: 6px 12px; border-radius: 999px; background: var(--accent); color: var(--accent-ink); font-size: 13px; font-weight: 700; white-space: nowrap; box-shadow: var(--glow-lemon); opacity: 0; transform: translateX(8px); pointer-events: none; transition: opacity 0.15s, transform 0.15s; }" +
    ".gennie:hover .gennie-tip, .gennie:focus-visible .gennie-tip, .gennie.speaking .gennie-tip { opacity: 1; transform: none; }" +
    ".gennie.speaking { animation: gennie-pulse 0.6s ease-in-out infinite alternate; }" +
    ".gennie-eye { transform-origin: center; transform-box: fill-box; animation: gennie-blink 4s infinite; }" +
    "@keyframes gennie-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }" +
    "@keyframes gennie-pulse { from { transform: scale(1); } to { transform: scale(1.12); } }" +
    "@keyframes gennie-blink { 0%, 94%, 100% { transform: scaleY(1); } 97% { transform: scaleY(0.1); } }" +
    "@media (prefers-reduced-motion: reduce) { .gennie, .gennie.speaking, .gennie-eye { animation: none; } }";

  // Cute robot face: antenna, round head, big eyes, blushing cheeks, smile.
  var ICON =
    '<svg viewBox="0 0 48 48" aria-hidden="true">' +
    '<line x1="24" y1="5" x2="24" y2="11" stroke="#f5ff3d" stroke-width="2.5" stroke-linecap="round"/>' +
    '<circle cx="24" cy="4.5" r="3" fill="#f5ff3d"/>' +
    '<rect x="7" y="11" width="34" height="28" rx="13" fill="#f4efff"/>' +
    '<rect x="3" y="21" width="4" height="9" rx="2" fill="#f5ff3d"/>' +
    '<rect x="41" y="21" width="4" height="9" rx="2" fill="#f5ff3d"/>' +
    '<ellipse class="gennie-eye" cx="17" cy="24" rx="3.4" ry="4.2" fill="#14091f"/>' +
    '<ellipse class="gennie-eye" cx="31" cy="24" rx="3.4" ry="4.2" fill="#14091f"/>' +
    '<circle cx="18.2" cy="22.6" r="1.1" fill="#fff"/>' +
    '<circle cx="32.2" cy="22.6" r="1.1" fill="#fff"/>' +
    '<ellipse cx="12" cy="31" rx="3" ry="2" fill="#ff8fb5" opacity="0.7"/>' +
    '<ellipse cx="36" cy="31" rx="3" ry="2" fill="#ff8fb5" opacity="0.7"/>' +
    '<path d="M19.5 31.5 Q24 36 28.5 31.5" fill="none" stroke="#14091f" stroke-width="2.2" stroke-linecap="round"/>' +
    "</svg>";

  function speak(onEnd) {
    if (!("speechSynthesis" in window)) { onEnd(); return; }
    window.speechSynthesis.cancel();
    var utter = new SpeechSynthesisUtterance(GREETING);
    utter.lang = "en-US";
    utter.pitch = 1.3;
    utter.rate = 1;
    utter.onend = onEnd;
    utter.onerror = onEnd;
    window.speechSynthesis.speak(utter);
  }

  function init() {
    if (!/^\d{6,15}$/.test(WHATSAPP_NUMBER)) { return; }

    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var link = document.createElement("a");
    link.className = "gennie";
    link.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "Chat with Gennie, IT support, on WhatsApp (opens in a new tab)");
    link.innerHTML = ICON + '<span class="gennie-tip">Hi, I\'m Gennie!</span>';

    link.addEventListener("click", function () {
      link.classList.add("speaking");
      speak(function () { link.classList.remove("speaking"); });
    });

    document.body.appendChild(link);
  }

  if (document.body) { init(); } else { document.addEventListener("DOMContentLoaded", init); }
})();
