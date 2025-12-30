#define XPT2046_CS 33
#define XPT2046_CLK 25
#define XPT2046_IRQ 36
#define XPT2046_MOSI 32
#define XPT2046_MISO 39
#define SCREEN_WIDTH  320
#define SCREEN_HEIGHT 240

// Display Rotation (0-3)
// 0 = Portrait, 1 = Landscape, 2 = Portrait Inverted, 3 = Landscape Inverted
#define TFT_ROTATION 1

// SPI Frequency (Hz)
#define TFT_SPI_FREQUENCY  40000000  // 40MHz for ILI9341
#define TOUCH_SPI_FREQUENCY 2500000  // 2.5MHz for XPT2046
