export function getProgressBar(percent, barLength = 20) {
    const filledLength = Math.round((percent / 100) * barLength);
    const bar = "#".repeat(filledLength) + "-".repeat(barLength - filledLength);
    return `[${bar}] ${percent.toFixed(0)}%`;
  }
  