/**
 * Convert port number to display label
 * @param port - Port number (2-13 for digital, 14-19 for analog)
 * @returns Display label (e.g., "2"-"13" for digital, "A0"-"A5" for analog)
 */
export function portToLabel(port: number): string {
    if (port >= 14 && port <= 19) {
        // Analog pins: A0-A5
        const analogIndex = port - 14;
        return `A${analogIndex}`;
    }
    // Digital pins: 2-13
    return port.toString();
}

/**
 * Convert display label to port number
 * @param label - Display label (e.g., "2"-"13" for digital, "A0"-"A5" for analog)
 * @returns Port number (2-13 for digital, 14-19 for analog)
 */
export function labelToPort(label: string): number {
    if (label.startsWith('A') || label.startsWith('a')) {
        // Analog pin: A0-A5
        const analogIndex = parseInt(label.substring(1));
        if (analogIndex >= 0 && analogIndex <= 5) {
            return 14 + analogIndex;
        }
    }
    // Digital pin: parse as number
    return parseInt(label);
}

/**
 * Get a human-readable label for port display in UI
 * @param port - Port number
 * @returns Formatted label for UI display (e.g., "Cổng 2", "Cổng A0")
 */
export function getPortDisplayLabel(port: number): string {
    return `Cổng ${portToLabel(port)}`;
}
