const tailwindColors = [
    "blue", "green", "purple", "amber", "rose", "cyan", "emerald", "indigo"
];

const intensityLevels = [100, 200, 300, 400, 500, 600, 700, 800, 900];

const generateRandomTailwindColor = () => {
    const color = tailwindColors[Math.floor(Math.random() * tailwindColors.length)];
    const bgIntensity = intensityLevels[Math.floor(Math.random() * intensityLevels.length)];
    const textIntensity = intensityLevels[Math.floor(Math.random() * intensityLevels.length)];

    return `bg-${color}-${bgIntensity} text-${color}-${textIntensity}`;
};

export default generateRandomTailwindColor;