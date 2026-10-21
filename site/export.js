/* Local-only exports: no third-party renderer, upload, or external asset URLs. */
const LeaderboardExport = (() => {
  const escape = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
  const number = value => Number(value.toFixed(3));
  const rootStyle = () => getComputedStyle(document.documentElement);
  const color = name => rootStyle().getPropertyValue(name).trim();
  const transparent = value => !value || value === "transparent" || value === "rgba(0, 0, 0, 0)";
  const text = (value, x, y, style = {}) =>
    `<text x="${number(x)}" y="${number(y)}" dominant-baseline="text-before-edge" fill="${escape(style.color || color("--text"))}" font-family="${escape(style.fontFamily || rootStyle().getPropertyValue("--sans"))}" font-size="${escape(style.fontSize || "14px")}" font-weight="${escape(style.fontWeight || "400")}">${escape(value)}</text>`;
  const rect = (x, y, width, height, fill, stroke = "none") =>
    `<rect x="${number(x)}" y="${number(y)}" width="${number(width)}" height="${number(height)}" fill="${escape(fill)}" stroke="${escape(stroke)}"/>`;
  const frame = (width, height, title, content) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(width)}" height="${Math.ceil(height)}" viewBox="0 0 ${Math.ceil(width)} ${Math.ceil(height)}" role="img"><title>${escape(title)}</title>${rect(0, 0, width, height, color("--surface"))}${text(title, 18, 16, { fontSize: "22px", fontWeight: "600" })}${content}</svg>`;

  function cellText(cell) {
    const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
    const parts = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement.closest(".sort-arrow, [aria-hidden='true']")) continue;
      const value = node.textContent.trim();
      if (value) parts.push(value);
    }
    const value = parts.join(" ").replace(/\s+/g, " ");
    return cell.tagName === "TH" ? value.toUpperCase() : value;
  }

  function markdown(table, title) {
    const clean = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;").replaceAll("\\", "\\\\").replaceAll("|", "\\|")
      .replaceAll("\n", " ");
    const row = cells => `| ${cells.map(value => clean(value)).join(" | ")} |`;
    const headers = [...table.tHead.rows[0].cells].map(cellText);
    const body = [...table.tBodies[0].rows].filter(item => !item.querySelector("[colspan]"))
      .map(item => row([...item.cells].map(cellText)));
    return `# ${clean(title)}\n\n${row(headers)}\n${row(headers.map(() => "---"))}\n${body.join("\n")}\n`;
  }

  const assets = new Map();
  function localImage(src) {
    if (!assets.has(src)) {
      const url = new URL(src, location.href);
      if (url.origin !== location.origin || !["http:", "https:"].includes(url.protocol)) {
        return Promise.reject(new Error("Only local image assets can be exported"));
      }
      const pending = fetch(url).then(response => {
        if (!response.ok) throw new Error("Image unavailable");
        return response.blob();
      }).then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));
      pending.catch(() => assets.delete(src));
      assets.set(src, pending);
    }
    return assets.get(src);
  }

  async function tableSvg(table, title) {
    // Capture all row geometry before awaiting assets. Sticky headers and the
    // scrollport's clipping do not affect the exported row positions.
    const bounds = table.getBoundingClientRect();
    const parts = [];
    let y = 60;
    for (const row of table.rows) {
      const rowHeight = row.getBoundingClientRect().height;
      const rowTop = Math.min(...[...row.cells].map(cell => cell.getBoundingClientRect().top));
      for (const cell of row.cells) {
        const cellBounds = cell.getBoundingClientRect();
        const dx = 18 - bounds.left;
        const dy = y - rowTop;
        const cellStyle = getComputedStyle(cell);
        if (!transparent(cellStyle.backgroundColor)) {
          parts.push(rect(cellBounds.left + dx, cellBounds.top + dy, cellBounds.width, cellBounds.height, cellStyle.backgroundColor));
        }
        const labelStyle = getComputedStyle(cell, "::before");
        if (cell.dataset.label && !["none", "normal"].includes(labelStyle.content)) {
          parts.push(text(cell.dataset.label.toUpperCase(),
            cellBounds.left + dx + parseFloat(cellStyle.paddingLeft),
            cellBounds.top + dy + (cellBounds.height - parseFloat(labelStyle.lineHeight)) / 2, labelStyle));
        }
        for (const node of cell.querySelectorAll(".accuracy-track, .accuracy-fill, .accuracy-ci, .accuracy-cap")) {
          const box = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          parts.push(rect(box.left + dx, box.top + dy, box.width, box.height,
            transparent(style.backgroundColor) ? "none" : style.backgroundColor,
            parseFloat(style.borderWidth) ? style.borderColor : "none"));
        }
        for (const image of cell.querySelectorAll("img")) {
          const box = image.getBoundingClientRect();
          if (!box.width || !box.height) continue;
          const filter = getComputedStyle(image).filter;
          parts.push(localImage(image.src).then(src =>
            `<image x="${number(box.left + dx)}" y="${number(box.top + dy)}" width="${number(box.width)}" height="${number(box.height)}" href="${escape(src)}" style="filter:${escape(filter)}"/>`));
        }
        const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          const value = node.textContent.trim();
          if (!value) continue;
          const range = document.createRange();
          const start = node.textContent.search(/\S/);
          range.setStart(node, start);
          range.setEnd(node, start + node.textContent.trim().length);
          const box = range.getBoundingClientRect();
          const style = getComputedStyle(node.parentElement);
          const paint = (value, box) => parts.push(text(style.textTransform === "uppercase" ? value.toUpperCase() : value,
            box.left + dx, box.top + dy, style));
          if (range.getClientRects().length <= 1) {
            paint(value, box);
          } else {
            // Responsive cells may wrap. Preserve their rendered line breaks
            // instead of exporting one overflowing line of text.
            let line = "", lineBox, offset = start;
            for (const character of value) {
              range.setStart(node, offset);
              offset += character.length;
              range.setEnd(node, offset);
              const characterBox = range.getBoundingClientRect();
              if (lineBox && Math.abs(characterBox.top - lineBox.top) > 1) {
                paint(line.trimEnd(), lineBox);
                line = "";
                lineBox = null;
              }
              if (!lineBox && !character.trim()) continue;
              lineBox ||= characterBox;
              line += character;
            }
            if (lineBox) paint(line.trimEnd(), lineBox);
          }
        }
      }
      y += rowHeight;
      parts.push(`<path d="M18 ${number(y)}H${number(bounds.width + 18)}" stroke="${escape(color("--table-line"))}"/>`);
    }
    const content = await Promise.all(parts);
    return frame(bounds.width + 36, y + 18, title, content.join(""));
  }

  function chartSvg(container, title) {
    const source = container.querySelector("svg");
    if (!source) {
      return frame(900, 160, title, text(container.textContent.trim(), 18, 80));
    }
    const clone = source.cloneNode(true);
    const originals = [source, ...source.querySelectorAll("*")];
    const copies = [clone, ...clone.querySelectorAll("*")];
    // Bake theme variables and typography into the SVG so it is standalone.
    const properties = ["fill", "stroke", "stroke-width", "stroke-dasharray", "stroke-linecap",
      "stroke-linejoin", "opacity", "font-family", "font-size", "font-weight", "paint-order",
      "text-anchor", "display", "visibility"];
    originals.forEach((node, index) => {
      const style = getComputedStyle(node);
      copies[index].removeAttribute("style");
      for (const property of properties) copies[index].style.setProperty(property, style.getPropertyValue(property));
    });
    clone.querySelectorAll(".pareto-point-hit, .pareto-label-leader").forEach(node => node.remove());
    clone.removeAttribute("aria-describedby");
    const { width, height } = source.viewBox.baseVal;
    clone.setAttribute("width", width);
    clone.setAttribute("height", height);
    clone.setAttribute("x", 18);
    clone.setAttribute("y", 60);
    clone.style.display = "block";
    return frame(width + 36, height + 78, title, new XMLSerializer().serializeToString(clone));
  }

  async function png(svg) {
    const source = new DOMParser().parseFromString(svg, "image/svg+xml").documentElement;
    const width = Number(source.getAttribute("width"));
    const height = Number(source.getAttribute("height"));
    // Bound memory/texture size for long result tables while retaining 2×
    // output for ordinary charts and filtered tables.
    const scale = Math.min(2, 8192 / Math.max(width, height), Math.sqrt(16000000 / (width * height)));
    if (!(width > 0 && height > 0 && scale > 0)) throw new Error("Invalid image size");
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(width * scale);
      canvas.height = Math.ceil(height * scale);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      return await new Promise((resolve, reject) => canvas.toBlob(blob =>
        blob ? resolve(blob) : reject(new Error("PNG encoding failed")), "image/png"));
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  return { markdown, tableSvg, chartSvg, png, download };
})();
