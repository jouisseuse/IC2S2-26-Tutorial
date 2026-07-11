export const candidateOptions = [
  { name: "Crimson", color: "fill-red-700 hover:fill-red-900 bg-gray-200" },
  { name: "Bright Green", color: "fill-lime-400 hover:fill-lime-500 bg-gray-200" },
  { name: "Amber", color: "fill-amber-500 hover:fill-amber-600 bg-gray-200" },
  { name: "Purple", color: "fill-purple-700 hover:fill-purple-900 bg-gray-200" },
  { name: "Sky Blue", color: "fill-sky-500 hover:fill-sky-700 bg-gray-200" },
  { name: "Pink", color: "fill-pink-500 hover:fill-pink-700 bg-gray-200" },
  { name: "Indigo", color: "fill-indigo-500 hover:fill-indigo-700 bg-gray-200" },
  { name: "Slate", color: "fill-slate-400 hover:fill-slate-600 bg-gray-200" },
  { name: "Orange", color: "fill-orange-600 hover:fill-orange-700 bg-gray-200" },
  { name: "Black", color: "fill-black hover:fill-gray-800 bg-gray-200" },
];

export function sortCandidatesForTutorial(options, tutorialChoice) {
  if (!tutorialChoice) return options;

  const startIndex = options.findIndex((option) => option.name === tutorialChoice);
  if (startIndex < 0) return options;

  return [
    ...options.slice(startIndex),
    ...options.slice(0, startIndex),
  ];
}
