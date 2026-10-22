import { createImage } from './cropHelper';

export interface AutoCutResult {
  frontDataUrl: string;
  backDataUrl: string;
  dualDataUrl: string;
  frontWidth: number;
  frontHeight: number;
  backWidth: number;
  backHeight: number;
  detectedType: 'aadhaar' | 'pan' | 'general';
  bounds: {
    front: { x: number; y: number; width: number; height: number };
    back: { x: number; y: number; width: number; height: number };
  };
}

/**
 * Detects the dotted scissor cutting line (---------- ✂️ ----------) on an e-Aadhaar PDF/image
 */
function findScissorLineY(image: HTMLImageElement, W: number, H: number): number | null {
  try {
    const scanCanvas = document.createElement('canvas');
    // Scan strip between 69% and 76% of page height where UIDAI cutting line lives
    const startY = Math.round(H * 0.69);
    const scanH = Math.round(H * 0.08);
    scanCanvas.width = W;
    scanCanvas.height = scanH;
    const ctx = scanCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(image, 0, startY, W, scanH, 0, 0, W, scanH);
    const imgData = ctx.getImageData(0, 0, W, scanH);
    const data = imgData.data;

    let bestLocalY = -1;
    let maxTransitions = 0;

    // Scan horizontal strip across 15% to 45% of width (where scissor dashes occur on front card)
    const scanLeft = Math.round(W * 0.15);
    const scanRight = Math.round(W * 0.45);

    for (let y = 0; y < scanH; y++) {
      let transitions = 0;
      let lastDark = false;
      for (let x = scanLeft; x < scanRight; x++) {
        const idx = (y * W + x) * 4;
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
        const isDark = brightness < 120;
        if (isDark !== lastDark) {
          transitions++;
          lastDark = isDark;
        }
      }
      if (transitions > maxTransitions && transitions >= 10) {
        maxTransitions = transitions;
        bestLocalY = y;
      }
    }

    if (bestLocalY > 0 && maxTransitions >= 10) {
      // The dotted scissor line was found! Start right below the dots (+3px)
      return (startY + bestLocalY + 3) / H;
    }
  } catch {
    // Non-fatal, fallback to calibrated default
  }
  return null;
}

/**
 * Automatically cuts the front and back card from an uploaded document (e.g. e-Aadhaar A4 letter).
 * Calibrated specifically to cut right at the cutting dots line (---------- ✂️ ----------)
 * and bottom card frame, matching the exact physical ID-1 card dimensions (85.60 x 53.98 mm)
 * for flawless fit into standard card lamination pouches.
 */
export async function autoCutDocumentCards(
  imageSrc: string,
  docType: string = 'aadhaar',
  customBounds?: {
    front?: { xPct: number; yPct: number; wPct: number; hPct: number };
    back?: { xPct: number; yPct: number; wPct: number; hPct: number };
  },
  nudges?: {
    offsetYPct?: number;
    heightAdjustPct?: number;
  }
): Promise<AutoCutResult> {
  const image = await createImage(imageSrc);
  const W = image.naturalWidth || image.width;
  const H = image.naturalHeight || image.height;

  // Try intelligent detection of the dotted cut line
  const detectedScissorY = docType === 'aadhaar' ? findScissorLineY(image, W, H) : null;

  // Calibrated UIDAI e-Aadhaar card coordinates (normalized percentages of the page)
  // Cuts off the red slogan "ਮੇਰਾ ਆਧਾਰ..." and starts right at the cutting dots line.
  // Ends right at the bottom card border, eliminating bottom blank whitespace.
  const baseCardY = detectedScissorY ?? 0.728;
  const effectiveCardY = baseCardY + (nudges?.offsetYPct || 0);

  // Exact ID-1 Card Aspect Ratio: 85.60 mm / 53.98 mm = 1.5858
  const CARD_RATIO = 1.5858;
  const cardWPct = 0.412;
  // Calculate height in pixels to preserve exact physical ratio
  const cardWidthPx = Math.round(cardWPct * W);
  const baseCardHeightPx = Math.round(cardWidthPx / CARD_RATIO);
  const cardHeightPx = Math.round(baseCardHeightPx + (nudges?.heightAdjustPct || 0) * H);
  const cardHPct = cardHeightPx / H;

  const defaultFront = {
    xPct: 0.080,
    yPct: effectiveCardY,
    wPct: cardWPct,
    hPct: cardHPct,
  };

  const defaultBack = {
    xPct: 0.508,
    yPct: effectiveCardY,
    wPct: cardWPct,
    hPct: cardHPct,
  };

  const frontPct = customBounds?.front || defaultFront;
  const backPct = customBounds?.back || defaultBack;

  // Convert to absolute pixel coordinates
  const frontBox = {
    x: Math.max(0, Math.round(frontPct.xPct * W)),
    y: Math.max(0, Math.round(frontPct.yPct * H)),
    width: Math.min(W, Math.round(frontPct.wPct * W)),
    height: Math.min(H, Math.round(frontPct.hPct * H)),
  };

  const backBox = {
    x: Math.max(0, Math.round(backPct.xPct * W)),
    y: Math.max(0, Math.round(backPct.yPct * H)),
    width: Math.min(W, Math.round(backPct.wPct * W)),
    height: Math.min(H, Math.round(backPct.hPct * H)),
  };

  // 1. Render Front Card Canvas
  const frontCanvas = document.createElement('canvas');
  frontCanvas.width = frontBox.width;
  frontCanvas.height = frontBox.height;
  const fCtx = frontCanvas.getContext('2d');
  if (fCtx) {
    fCtx.imageSmoothingEnabled = true;
    fCtx.imageSmoothingQuality = 'high';
    fCtx.drawImage(
      image,
      frontBox.x,
      frontBox.y,
      frontBox.width,
      frontBox.height,
      0,
      0,
      frontBox.width,
      frontBox.height
    );
  }

  // 2. Render Back Card Canvas
  const backCanvas = document.createElement('canvas');
  backCanvas.width = backBox.width;
  backCanvas.height = backBox.height;
  const bCtx = backCanvas.getContext('2d');
  if (bCtx) {
    bCtx.imageSmoothingEnabled = true;
    bCtx.imageSmoothingQuality = 'high';
    bCtx.drawImage(
      image,
      backBox.x,
      backBox.y,
      backBox.width,
      backBox.height,
      0,
      0,
      backBox.width,
      backBox.height
    );
  }

  // 3. Render Combined Dual Strip Canvas (Front + Back side-by-side)
  const dualCanvas = document.createElement('canvas');
  dualCanvas.width = frontBox.width + backBox.width;
  dualCanvas.height = Math.max(frontBox.height, backBox.height);
  const dCtx = dualCanvas.getContext('2d');
  if (dCtx) {
    dCtx.imageSmoothingEnabled = true;
    dCtx.imageSmoothingQuality = 'high';
    dCtx.drawImage(frontCanvas, 0, 0);
    dCtx.drawImage(backCanvas, frontBox.width, 0);
  }

  return {
    frontDataUrl: frontCanvas.toDataURL('image/png'),
    backDataUrl: backCanvas.toDataURL('image/png'),
    dualDataUrl: dualCanvas.toDataURL('image/png'),
    frontWidth: frontBox.width,
    frontHeight: frontBox.height,
    backWidth: backBox.width,
    backHeight: backBox.height,
    detectedType: docType === 'pan' ? 'pan' : 'aadhaar',
    bounds: {
      front: frontBox,
      back: backBox,
    },
  };
}
