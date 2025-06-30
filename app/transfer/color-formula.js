export function getRelativeLuminance(r, g, b) {
    let nR = r / 255;
    let nG = g / 255;
    let nB = b / 255;
      
    const gR = linearize(nR);
    const gG = linearize(nG);
    const gB = linearize(nB);

    return 0.2126 * gR + 0.7152 * gG + 0.0722 * gB;
}

function linearize(normalizedValue) {
    if (normalizedValue <= 0.03928) {
        return normalizedValue / 12.92;
    } else {
        return Math.pow((normalizedValue + 0.055) / 1.055, 2.4);
    }
}