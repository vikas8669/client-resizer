import { MM_TO_PT, PaperSizeConfig, PAPER_SIZES } from '../config/documentPresets';

export interface CardSlotPosition {
  copyIndex: number;
  pageIndex: number;
  row: number;
  col: number;
  xMm: number;
  yMm: number;
  widthMm: number;
  heightMm: number;
  xPt: number;
  yPt: number;
  widthPt: number;
  heightPt: number;
}

export interface CutMarkCorner {
  // L-shaped cut mark corner lines in mm
  horizontal: { x1: number; y1: number; x2: number; y2: number };
  vertical: { x1: number; y1: number; x2: number; y2: number };
}

export interface PageLayoutResult {
  paper: PaperSizeConfig;
  orientation: 'portrait' | 'landscape';
  effectivePaperWidthMm: number;
  effectivePaperHeightMm: number;
  cardWidthMm: number;
  cardHeightMm: number;
  marginMm: number;
  gapMm: number;
  cols: number;
  rows: number;
  cardsPerPage: number;
  copiesRequested: number;
  totalPages: number;
  slots: CardSlotPosition[];
  printableAreaWidthMm: number;
  printableAreaHeightMm: number;
  printableAreaEfficiencyPct: number;
  fitsOnSinglePage: boolean;
  warnings: string[];
}

export interface CalculateLayoutOptions {
  paperKey?: 'A4' | '4x6' | 'Letter';
  customPaper?: { widthMm: number; heightMm: number; name: string };
  cardWidthMm: number;
  cardHeightMm: number;
  marginMm?: number;
  gapMm?: number;
  copies?: number;
  orientation?: 'auto' | 'portrait' | 'landscape';
}

export function calculateCardLayout(options: CalculateLayoutOptions): PageLayoutResult {
  const {
    paperKey = 'A4',
    customPaper,
    cardWidthMm,
    cardHeightMm,
    marginMm = 6, // 6mm minimal margin
    gapMm = 3,    // 3mm spacing between cards
    copies = 1,
    orientation = 'auto',
  } = options;

  const basePaper = customPaper
    ? {
        id: 'A4' as const,
        name: customPaper.name,
        widthMm: customPaper.widthMm,
        heightMm: customPaper.heightMm,
        description: 'Custom paper size',
      }
    : PAPER_SIZES[paperKey] || PAPER_SIZES.A4;

  const warnings: string[] = [];

  const evalOrientation = (isLandscape: boolean) => {
    const pWidth = isLandscape
      ? Math.max(basePaper.widthMm, basePaper.heightMm)
      : Math.min(basePaper.widthMm, basePaper.heightMm);
    const pHeight = isLandscape
      ? Math.min(basePaper.widthMm, basePaper.heightMm)
      : Math.max(basePaper.widthMm, basePaper.heightMm);

    const usableW = Math.max(0, pWidth - 2 * marginMm);
    const usableH = Math.max(0, pHeight - 2 * marginMm);

    const cols = Math.max(0, Math.floor((usableW + gapMm) / (cardWidthMm + gapMm)));
    const rows = Math.max(0, Math.floor((usableH + gapMm) / (cardHeightMm + gapMm)));
    const cardsPerPage = cols * rows;

    return { pWidth, pHeight, usableW, usableH, cols, rows, cardsPerPage };
  };

  const portraitResult = evalOrientation(false);
  const landscapeResult = evalOrientation(true);

  let chosenIsLandscape = false;
  if (orientation === 'landscape') {
    chosenIsLandscape = true;
  } else if (orientation === 'portrait') {
    chosenIsLandscape = false;
  } else {
    // Auto: choose orientation that yields more cards per page or fewer pages
    if (landscapeResult.cardsPerPage > portraitResult.cardsPerPage) {
      chosenIsLandscape = true;
    } else {
      chosenIsLandscape = false;
    }
  }

  const chosen = chosenIsLandscape ? landscapeResult : portraitResult;
  const effectivePaperWidthMm = chosen.pWidth;
  const effectivePaperHeightMm = chosen.pHeight;
  const cols = chosen.cols;
  const rows = chosen.rows;
  const cardsPerPage = chosen.cardsPerPage;

  if (cardsPerPage === 0) {
    warnings.push(
      `Document size (${cardWidthMm} × ${cardHeightMm} mm) exceeds the printable area of ${basePaper.name}. Consider reducing margins or choosing a larger paper.`
    );
  }

  const safeCopies = Math.max(1, Math.min(100, Math.round(copies)));
  const totalPages = cardsPerPage > 0 ? Math.ceil(safeCopies / cardsPerPage) : 1;
  const fitsOnSinglePage = safeCopies <= cardsPerPage;

  // Center the grid within the printable area for clean aesthetics
  const totalGridWidthMm = cols > 0 ? cols * cardWidthMm + (cols - 1) * gapMm : 0;
  const totalGridHeightMm = rows > 0 ? rows * cardHeightMm + (rows - 1) * gapMm : 0;
  const startXOffsetMm = marginMm + Math.max(0, (chosen.usableW - totalGridWidthMm) / 2);
  const startYOffsetMm = marginMm + Math.max(0, (chosen.usableH - totalGridHeightMm) / 2);

  const slots: CardSlotPosition[] = [];
  for (let copyIdx = 0; copyIdx < safeCopies; copyIdx++) {
    const pageIndex = cardsPerPage > 0 ? Math.floor(copyIdx / cardsPerPage) : 0;
    const slotOnPage = cardsPerPage > 0 ? copyIdx % cardsPerPage : 0;
    const col = cols > 0 ? slotOnPage % cols : 0;
    const row = cols > 0 ? Math.floor(slotOnPage / cols) : 0;

    const xMm = startXOffsetMm + col * (cardWidthMm + gapMm);
    const yMm = startYOffsetMm + row * (cardHeightMm + gapMm);

    slots.push({
      copyIndex: copyIdx,
      pageIndex,
      row,
      col,
      xMm,
      yMm,
      widthMm: cardWidthMm,
      heightMm: cardHeightMm,
      xPt: xMm * MM_TO_PT,
      yPt: yMm * MM_TO_PT,
      widthPt: cardWidthMm * MM_TO_PT,
      heightPt: cardHeightMm * MM_TO_PT,
    });
  }

  const printableArea = chosen.usableW * chosen.usableH;
  const usedAreaFirstPage = Math.min(safeCopies, cardsPerPage) * (cardWidthMm * cardHeightMm);
  const printableAreaEfficiencyPct =
    printableArea > 0 ? Math.min(100, Math.round((usedAreaFirstPage / printableArea) * 100)) : 0;

  return {
    paper: basePaper,
    orientation: chosenIsLandscape ? 'landscape' : 'portrait',
    effectivePaperWidthMm,
    effectivePaperHeightMm,
    cardWidthMm,
    cardHeightMm,
    marginMm,
    gapMm,
    cols,
    rows,
    cardsPerPage,
    copiesRequested: safeCopies,
    totalPages,
    slots,
    printableAreaWidthMm: chosen.usableW,
    printableAreaHeightMm: chosen.usableH,
    printableAreaEfficiencyPct,
    fitsOnSinglePage,
    warnings,
  };
}
